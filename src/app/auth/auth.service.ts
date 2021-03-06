/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable object-shorthand */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Storage } from '@capacitor/storage';

import { environment } from '../../environments/environment';
import { User } from './user.model';


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
export class AuthService implements OnDestroy {
  private userSubj = new BehaviorSubject<User>(null);
  private activeTimeout: any;

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

  get token() {
    return this.userSubj.asObservable().pipe(map((user) => {
      if (user) {
        return user.token;
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
    if (this.activeTimeout) {
      clearTimeout(this.activeTimeout);
    }
    Storage.remove({ key: 'authData' });
    this.userSubj.next(null);
  }

  autoLogin() {
    return from(Storage.get({ key: 'authData' })).pipe(map((authData) => {
      if (!authData || !authData.value) {
        return null;
      }
      const data = JSON.parse(authData.value) as { userId: string; token: string; tokenExpirationDate: string; email: string };
      const expirationTime = new Date(data.tokenExpirationDate);
      if (expirationTime <= new Date()) {
        return null;
      }
      const user = new User(data.userId, data.email, data.token, expirationTime);
      return user;
    }),
      tap((user) => {
        if (user) {
          this.userSubj.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map((user) => {
        return !!user;
      }));
  }

  ngOnDestroy() {
    if (this.activeTimeout) {
      clearTimeout(this.activeTimeout);
    }
  }

  private autoLogout(duration: number) {
    if (this.activeTimeout) {
      clearTimeout(this.activeTimeout);
    }
    this.activeTimeout = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + +userData.expiresIn * 1000);
    const newUser = new User(userData.localId, userData.email, userData.idToken, expirationTime);
    this.userSubj.next(newUser);
    this.autoLogout(newUser.tokenDuration);
    this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);
  }

  private storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string) {
    const data = JSON.stringify({ userId: userId, token: token, tokenExpirationDate: tokenExpirationDate, email: email });
    Storage.set({ key: 'authData', value: data });

  }
}
