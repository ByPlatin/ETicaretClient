import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService } from '../../../../services/common/models/product.service';
import { Create_Product } from '../../../../contracts/create_product';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, spinnerType } from '../../../../base/base.component';
import {
  AlertifyService,
  MessageType,
  Position,
} from '../../../../services/admin/alertify.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent extends BaseComponent implements OnInit {
  constructor(
    spiner: NgxSpinnerService,
    private productService: ProductService,
    private alertify: AlertifyService
  ) {
    super(spiner);
  }
  ngOnInit(): void {}

  @Output() createdProduct: EventEmitter<Create_Product> = new EventEmitter();

  create(
    Name: HTMLInputElement,
    Stock: HTMLInputElement,
    Price: HTMLInputElement
  ) {
    this.showSpinner(spinnerType.SquareJellyBox);
    const create_product: Create_Product = new Create_Product();
    create_product.name = Name.value;
    create_product.stock = parseInt(Stock.value);
    create_product.price = parseFloat(Price.value);

    this.productService.create(
      create_product,
      () => {
        this.hideSpinner(spinnerType.SquareJellyBox);
        this.alertify.message('Kayıt başarılı', {
          messageType: MessageType.Success,
          dismissOthers: true,
          position: Position.TopRight,
        });
        this.createdProduct.emit(create_product);
      },
      (errorMes) => {
        this.alertify.message(errorMes, {
          messageType: MessageType.Error,
          dismissOthers: true,
          position: Position.TopRight,
        });
      }
    );
  }
}
