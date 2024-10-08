import { Component, Inject, OnInit, Output } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileUploadOptions } from '../../services/common/file-upload/file-upload.component';
import { ProductService } from '../../services/common/models/product.service';
import { List_Product_Image } from '../../contracts/list_productImage';
import { NgxSpinnerService } from 'ngx-spinner';
import { spinnerType } from '../../base/base.component';
import { DialogService } from '../../services/common/dialog.service';
import {
  DeleteDialogComponent,
  DeleteState,
} from '../delete-dialog/delete-dialog.component';

declare var $: any;

@Component({
  selector: 'app-select-product-image-dialog',
  templateUrl: './select-product-image-dialog.component.html',
  styleUrl: './select-product-image-dialog.component.scss',
})
export class SelectProductImageDialogComponent
  extends BaseDialog<SelectProductImageDialogComponent>
  implements OnInit
{
  constructor(
    dialogRef: MatDialogRef<SelectProductImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectProductImageState | string,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService
  ) {
    super(dialogRef);
  }

  @Output() options: Partial<FileUploadOptions> = {
    accept: '.png, .jpg, .jpeg',
    action: 'upload',
    controller: 'products',
    explanation: 'Ürün resmini seçiniz...',
    isAdminPage: true,
    queryString: `id=${this.data}`,
  };

  images: List_Product_Image[];
  async ngOnInit() {
    this.spinner.show(spinnerType.BallAtom);
    this.images = await this.productService.readImages(
      this.data as string,
      () => this.spinner.hide(spinnerType.BallAtom)
    );
  }

  async deleteImage(imageId: string, event: any) {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => {
        this.spinner.show(spinnerType.BallPulse);
        await this.productService.deleteImage(
          this.data as string,
          imageId,
          () => {
            this.spinner.hide(spinnerType.BallPulse);
            var card = $(event.srcElement).parent().parent();
            card.fadeOut(500);
          }
        );
      },
    });
  }

  showCase(imageId: string) {
    this.spinner.show(spinnerType.BallPulse);
    this.productService.changeShowcaseImage(imageId, this.data as string, () => {
      this.spinner.hide(spinnerType.BallPulse);
    });
  }
}

export enum SelectProductImageState {
  Close,
}
