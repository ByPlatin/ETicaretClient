import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from '../../../entities/user';
import { Create_User } from '../../../contracts/users/create_user';
import { firstValueFrom, Observable } from 'rxjs';
import { Token } from '../../../contracts/token/token';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../../ui/custom-toastr.service';
import { TokenResponse } from '../../../contracts/token/tokenRsponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpClientService: HttpClientService,
    private toasterService: CustomToastrService
  ) {}

  async create(user: User): Promise<Create_User> {
    const observable: Observable<Create_User | User> =
      this.httpClientService.post<Create_User | User>(
        {
          controller: 'users',
        },
        user
      );

    return (await firstValueFrom(observable)) as Create_User;
  }

  async login(
    userNameorEmail: string,
    password: string,
    callBackFunction?: () => void
  ): Promise<any> {
    const observable: Observable<any | TokenResponse> =
      this.httpClientService.post<any | TokenResponse>(
        {
          controller: 'users',
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

      this.toasterService.message('Kullanıcı girişi yapıldı.', 'Login', {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      });
    }
    callBackFunction();
  }
}
