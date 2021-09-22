/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = true;
  private _usserId = 'user1';

  constructor() { }

  get isAuthenticated() {
    return this._isAuthenticated;
  }

  get userId() {
    return this._usserId;
  }

  login() {
    this._isAuthenticated = true;
  }

  logout() {
    this._isAuthenticated = false;
  }
}
