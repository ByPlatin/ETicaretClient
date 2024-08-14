import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../../services/ui/custom-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { spinnerType } from '../../base/base.component';
import { _isAuthenticated } from '../../services/common/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const spinner: NgxSpinnerService = inject(NgxSpinnerService);
  spinner.show(spinnerType.BallAtom);
  const router: Router = inject(Router);
  const toastrService: CustomToastrService = inject(CustomToastrService);

  if (!_isAuthenticated) {
    router.navigate(['login'], { queryParams: { returnUrl: state.url } });
    toastrService.message('Oturum açmanız gerekli !', 'Yetisiz Erişim!', {
      messageType: ToastrMessageType.Error,
      position: ToastrPosition.TopRight,
    });
  }

  spinner.hide(spinnerType.BallAtom);

  return true;
};
