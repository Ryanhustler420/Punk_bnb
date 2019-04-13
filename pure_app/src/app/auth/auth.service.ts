import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, from} from 'rxjs';
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

  autoLogin() {
    return from(Plugins.Storage.get({key: 'authData'})).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
        };

        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }

        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
        }
      }),
      map(user => {
        return !!user;
      }),
      tap()
    );
  }

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
          returnSecureToken: true,
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
      expirationTime.toISOString(),
      userData.email
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
    tokenExpirationDate: string,
    email: string
  ) {
    const data = JSON.stringify({userId, token, tokenExpirationDate, email});
    Plugins.Storage.set({key: 'authData', value: data});
  }
}
