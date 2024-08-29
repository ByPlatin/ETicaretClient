import { Component, OnInit } from '@angular/core';
import {
  AlertifyService,
  MessageType,
  Position,
} from '../../../services/admin/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, spinnerType } from '../../../base/base.component';
import { SignalrService } from '../../../services/common/signalr.service';
import { HubUrls } from '../../../constants/hub-urls';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent extends BaseComponent implements OnInit {
  constructor(
    private alertify: AlertifyService,
    spinner: NgxSpinnerService,
    private signalRService: SignalrService
  ) {
    super(spinner);
    signalRService.start(HubUrls.ProductHub);
  }

  ngOnInit(): void {
    this.signalRService.on('receiveProductAdddedMessage', (message) => {
      this.alertify.message(message, {
        messageType: MessageType.Notify,
        position: Position.TopRight,
      });
    });
  }
  d() {
    this.alertify.dismiss();
  }

  m() {
    this.alertify.message('Deneme mesajı', {
      messageType: MessageType.Success,
      delay: 5,
      position: Position.TopRight,
    });
  }
}
