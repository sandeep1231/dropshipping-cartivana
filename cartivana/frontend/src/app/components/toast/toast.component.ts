import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: false,
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
