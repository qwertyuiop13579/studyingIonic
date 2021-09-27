/* eslint-disable no-underscore-dangle */
export class User {

  constructor(public id: string, public email: string, private _token: string, public tokenExpirationDate: Date) { }

  get token() {
    if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
      return null;

    }
    return this._token;
  }

  get tokenDuration() {
    if (!this.token) {
      return 0;
    }
    return 3000;
    //return this.tokenExpirationDate.getTime() - new Date().getTime();
  }
}
