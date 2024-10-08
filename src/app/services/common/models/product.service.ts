import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from '../../../contracts/create_product';
import { HttpErrorResponse } from '@angular/common/http';
import { List_Product } from '../../../contracts/list_product';
import { firstValueFrom, Observable } from 'rxjs';
import { List_Product_Image } from '../../../contracts/list_productImage';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClientService: HttpClientService) {}

  create(
    product: Create_Product,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ) {
    this.httpClientService.post({ controller: 'products' }, product).subscribe(
      (result) => {
        successCallBack();
      },
      (errorResponse: HttpErrorResponse) => {
        const _err: Array<{ key: string; value: Array<string> }> =
          errorResponse.error;
        let message = '';
        _err.forEach((v, index) => {
          v.value.forEach((_v, _index) => {
            message += `${_v}<br>`;
          });
        });
        errorCallBack(message);
      }
    );
  }

  async read(
    page: number = 0,
    size: number = 5,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ): Promise<{ totalProductCount: number; products: List_Product[] }> {
    const promiseData: Promise<{
      totalProductCount: number;
      products: List_Product[];
    }> = this.httpClientService
      .get<{ totalProductCount: number; products: List_Product[] }>({
        controller: 'products',
        queryString: `page=${page}&size=${size}`,
      })
      .toPromise();

    promiseData
      .then((d) => successCallBack())
      .catch((errorResponse: HttpErrorResponse) =>
        errorCallBack(errorResponse.message)
      );

    return await promiseData;
  }

  async delete(id: string) {
    const obs: Observable<any> = this.httpClientService.delete<any>(
      { controller: 'products' },
      id
    );
    await firstValueFrom(obs);
  }

  async readImages(
    id: string,
    successCallBack?: () => void
  ): Promise<List_Product_Image[]> {
    const getObsrvable: Observable<List_Product_Image[]> =
      this.httpClientService.get<List_Product_Image[]>(
        {
          action: 'getProductImages',
          controller: 'products',
        },
        id
      );
    const images: List_Product_Image[] = await firstValueFrom(getObsrvable);
    successCallBack();
    return images;
  }

  async deleteImage(id: string, imageId: string, successCallBack?: () => void) {
    const deleteObservable = this.httpClientService.delete(
      {
        action: 'deleteproductimage',
        controller: 'products',
        queryString: `imageId=${imageId}`,
      },
      id
    );
    await firstValueFrom(deleteObservable);
    successCallBack();
  }

  async changeShowcaseImage(
    imageId: string,
    productId: string,
    successCallBack?: () => void
  ): Promise<void> {
    const changeShowcaseImageObservable = this.httpClientService.get({
      controller: 'products',
      action: 'ChangeShowcaseImages',
      queryString: `ImageId=${imageId}&ProductId=${productId}`,
    });

    await firstValueFrom(changeShowcaseImageObservable);
    successCallBack();
  }
}
