import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/common/models/user.service';
import { BaseComponent, spinnerType } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/common/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FacebookLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { UserAuthService } from '../../../services/common/models/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent extends BaseComponent implements OnInit {
  constructor(
    private userAuthService: UserAuthService,
    spinner: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {
    super(spinner);
    socialAuthService.authState.subscribe(async (user: SocialUser) => {
      console.log(user);
      this.showSpinner(spinnerType.BallPulse);

      switch (user.provider) {
        case 'GOOGLE':
          await userAuthService.googleLogin(user, () => {
            authService.identityCheck();
            this.hideSpinner(spinnerType.BallPulse);
          });
          break;
        case 'FACEBOOK':
          await userAuthService.facebokLogin(user, () => {
            authService.identityCheck();
            this.hideSpinner(spinnerType.BallPulse);
          });
          break;
      }
    });
  }

  ngOnInit(): void {}

  async login(txtUsernameOrEmail: string, txtPassword: string) {
    this.showSpinner(spinnerType.BallPulse);
    await this.userAuthService.login(txtUsernameOrEmail, txtPassword, () => {
      this.authService.identityCheck();
      this.activatedRoute.queryParams.subscribe((params) => {
        const returnUrl: string = params['returnUrl'];
        if (returnUrl) this.router.navigate([returnUrl]);
      });
      this.hideSpinner(spinnerType.BallPulse);
    });
  }
  facebookLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
