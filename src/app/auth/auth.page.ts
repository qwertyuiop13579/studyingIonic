/* eslint-disable max-len */
/* eslint-disable object-shorthand */
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLoginMode = true;

  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl.create({
      keyboardClose: true, message: 'Logging in...'
    }).then(loadingEl => {
      loadingEl.present();
      let authObs: Observable<AuthResponseData>;
      if (this.isLoginMode) {
        console.log('login');
        authObs = this.authService.login(email, password);
      }
      else {
        console.log('signup');
        authObs = this.authService.signup(email, password);
      }
      authObs.subscribe((resData) => {
        //console.log(resData);
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigate(['/places/tabs/discover']);
      }, (errorRes) => {
        this.isLoading = false;
        loadingEl.dismiss();
        const code = errorRes.error.error.message;
        let message = 'Could not sign you up, please try again later.';
        switch (code) {
          case 'EMAIL_EXISTS': message = 'The email address is already in use by another account.'; break;
          case 'OPERATION_NOT_ALLOWED': message = 'Password sign-in is disabled for this project'; break;
          case 'OO_MANY_ATTEMPTS_TRY_LATER': message = 'We have blocked all requests from this device due to unusual activity. Try again later'; break;
          case 'EMAIL_NOT_FOUND': message = 'There is no user record corresponding to this identifier. The user may have been deleted.'; break;
          case 'INVALID_PASSWORD': message = 'The password is invalid or the user does not have a password.'; break;
          case 'USER_DISABLED': message = 'The user account has been disabled by an administrator.'; break;
        }
        this.showAlert(message);
      });
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.authenticate(email, password);
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  private showAlert(message: string) {
    this.alertCtrl.create({ message: message, header: 'Error occured!', buttons: ['Ok'] }).then((alertEl) => {
      alertEl.present();
    });
  }
}
