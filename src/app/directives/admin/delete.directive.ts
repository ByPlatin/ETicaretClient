import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { ProductService } from '../../services/common/models/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { spinnerType } from '../../base/base.component';
import { MatDialog } from '@angular/material/dialog';
import {
  DeleteDialogComponent,
  DeleteState,
} from '../../dialogs/delete-dialog/delete-dialog.component';
import { HttpClientService } from '../../services/common/http-client.service';
import {
  AlertifyService,
  MessageType,
  Position,
} from '../../services/admin/alertify.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '../../services/common/dialog.service';

declare var $: any;

@Directive({
  selector: '[appDelete]',
})
export class DeleteDirective {
  constructor(
    private element: ElementRef,
    private _renderer: Renderer2,
    private htpClientService: HttpClientService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private alertfy: AlertifyService,
    private dialogService: DialogService
  ) {
    const img = _renderer.createElement('img');
    img.setAttribute('src', 'assets/trash-can-regular.svg');
    img.setAttribute('style', 'cursor: pointer;');
    img.width = 24;
    img.height = 24;
    _renderer.appendChild(element.nativeElement, img);
  }

  @Input() id: string;
  @Input() controller: string;
  @Output() callback: EventEmitter<any> = new EventEmitter();

  @HostListener('click')
  async onClick() {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => {
        this.spinner.show(spinnerType.SquareJellyBox);
        const td: HTMLTableCellElement = this.element.nativeElement;
        this.htpClientService
          .delete({ controller: this.controller }, this.id)
          .subscribe(
            (data) => {
              $(td.parentElement).animate(
                {
                  opacity: 0,
                  left: '+=50',
                  heiht: 'toogle',
                },
                700,
                () => {
                  this.callback.emit();
                  this.alertfy.message('Ürün silindi.', {
                    dismissOthers: true,
                    messageType: MessageType.Success,
                    position: Position.TopRight,
                  });
                }
              );
            },
            (errorResponse: HttpErrorResponse) => {
              this.spinner.hide(spinnerType.SquareJellyBox);
              this.alertfy.message('Ürün silinirken hata oluştu !!!', {
                dismissOthers: true,
                messageType: MessageType.Error,
                position: Position.TopRight,
              });
            }
          );
      },
    });
  }
}
