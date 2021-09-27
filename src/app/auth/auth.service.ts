/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable object-shorthand */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './user.model';
import { map, tap } from 'rxjs/operators';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubj = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) { }

  get isAuthenticated() {
    return this.userSubj.asObservable().pipe(map((user) => {
      if (user) {
        return !!user.token;
      }
      else {
        return false;
      }
    }));
  }

  get userId() {
    return this.userSubj.asObservable().pipe(map((user) => {
      if (user) {
        return user.id;
      }
      else {
        return null;
      }
    }));
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      { email: email, password: password, returnSecureToken: true }).pipe(tap(this.setUserData.bind(this)));

  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
      { email: email, password: password, returnSecureToken: true }).pipe(tap(this.setUserData.bind(this)));;
  }

  logout() {
    this.userSubj.next(null);
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + +userData.expiresIn * 1000);
    this.userSubj.next(new User(userData.localId, userData.email, userData.idToken, expirationTime));
  }
}
