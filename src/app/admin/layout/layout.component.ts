import { Component } from '@angular/core';
declare var alertify: any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  constructor() {}

  ngOnInit(): void {
    alertify.success('Success message');
  }
}
