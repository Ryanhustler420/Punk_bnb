import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

interface AuthResponsePayloadData {
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
  private _userIsAuthenticated = false;
  private _userId = null;

  constructor(private http: HttpClient) {}

  get userId() {
    return this._userId;
  }

  get isAuthenticated() {
    return this._userIsAuthenticated;
  }

  login() {
    this._userIsAuthenticated = true;
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponsePayloadData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
        environment.firebaseAPIKey
      }`,
      {email: email, password: password, returnSecureToken: true}
    );
  }

  logout() {
    this._userIsAuthenticated = false;
  }
}
