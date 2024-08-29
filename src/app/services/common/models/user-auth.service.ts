import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { TokenResponse } from '../../../contracts/token/tokenRsponse';
import { HttpClientService } from '../http-client.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../../ui/custom-toastr.service';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  constructor(
    private httpClientService: HttpClientService,
    private toasterService: CustomToastrService
  ) {}

  async login(
    userNameorEmail: string,
    password: string,
    callBackFunction?: () => void
  ): Promise<any> {
    const observable: Observable<any | TokenResponse> =
      this.httpClientService.post<any | TokenResponse>(
        {
          controller: 'auth',
          action: 'login',
        },
        {
          userNameorEmail,
          password,
        }
      );
    const tokenRsponse: TokenResponse = (await firstValueFrom(
      observable
    )) as TokenResponse;
    if (tokenRsponse) {
      localStorage.setItem('accessToken', tokenRsponse.token.accessToken);
      localStorage.setItem('refreshToken', tokenRsponse.token.refreshToken);

      this.toasterService.message('Kullanıcı girişi yapıldı.', 'Login', {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      });
    }
    callBackFunction();
  }

  async refreshTokenLogin(
    refreshToken: string,
    callBackFunction?: () => void
  ): Promise<any> {
    const observable: Observable<any | TokenResponse> =
      this.httpClientService.post(
        {
          action: 'refreshtokenlogin',
          controller: 'auth',
        },
        { refreshToken: refreshToken }
      );
    const tokenResponse: TokenResponse = (await firstValueFrom(
      observable
    )) as TokenResponse;
    if (tokenResponse) {
      localStorage.setItem('accessToken', tokenResponse.token.accessToken);
      localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);
    }
    callBackFunction();
  }

  async googleLogin(
    user: SocialUser,
    callBackFunction?: () => void
  ): Promise<any> {
    const observable: Observable<SocialUser | TokenResponse> =
      this.httpClientService.post<SocialUser | TokenResponse>(
        { action: 'google-login', controller: 'auth' },
        user
      );

    const tokenResponse: TokenResponse = (await firstValueFrom(
      observable
    )) as TokenResponse;

    if (tokenResponse) {
      localStorage.setItem('accessToken', tokenResponse.token.accessToken);
      localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);
      this.toasterService.message('Google girişi başarılı', 'Bilgi', {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      });
    }
    callBackFunction();
  }

  async facebokLogin(
    user: SocialUser,
    callBackFunction?: () => void
  ): Promise<any> {
    const observable: Observable<SocialUser | TokenResponse> =
      this.httpClientService.post<SocialUser | TokenResponse>(
        {
          controller: 'auth',
          action: 'facebook-login',
        },
        user
      );

    const tokenResponse: TokenResponse = (await firstValueFrom(
      observable
    )) as TokenResponse;

    if (tokenResponse) {
      localStorage.setItem('accessToken', tokenResponse.token.accessToken);
      localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);
      this.toasterService.message(
        'Facebook Girişi başarılı',
        'Giriş Yapıldı.',
        {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight,
        }
      );
    }

    callBackFunction();
  }
}
