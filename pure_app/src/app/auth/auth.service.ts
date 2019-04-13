import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {User} from './user.model';
import {tap, map} from 'rxjs/operators';
import {Plugins} from '@capacitor/core';

export interface AuthResponsePayloadData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {}

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  get isAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponsePayloadData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
          environment.firebaseAPIKey
        }`,
        {
          email: email,
          password: password,
        }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  private setUserData(userData: AuthResponsePayloadData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    this._user.next(
      new User(
        userData.localId,
        userData.email,
        userData.idToken,
        expirationTime
      )
    );
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString()
    );
  }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponsePayloadData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
          environment.firebaseAPIKey
        }`,
        {email: email, password: password, returnSecureToken: true}
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    this._user.next(null);
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string
  ) {
    const data = JSON.stringify({userId, token, tokenExpirationDate});
    Plugins.Storage.set({key: 'authData', value: data});
  }
}
