import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/common/models/user.service';
import { BaseComponent, spinnerType } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/common/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent extends BaseComponent implements OnInit {
  constructor(
    private userService: UserService,
    spinner: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super(spinner);
  }

  ngOnInit(): void {}

  async login(txtUsernameOrEmail: string, txtPassword: string) {
    this.showSpinner(spinnerType.BallPulse);
    await this.userService.login(txtUsernameOrEmail, txtPassword, () => {
      this.authService.identityCheck();
      this.activatedRoute.queryParams.subscribe((params) => {
        const returnUrl: string = params['returnUrl'];
        if (returnUrl) this.router.navigate([returnUrl]);
      });
      this.hideSpinner(spinnerType.BallPulse);
    });
  }
}
