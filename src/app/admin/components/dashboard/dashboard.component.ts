import { Component } from '@angular/core';
import {
  AlertifyService,
  MessageType,
  Position,
} from '../../../services/admin/alertify.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(private alertify: AlertifyService) {}

  ngOnInit(): void {}
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
