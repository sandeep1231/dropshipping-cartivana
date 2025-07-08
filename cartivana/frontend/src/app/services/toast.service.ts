import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  public show = false;
  public message = '';
  public type: 'success' | 'error' | 'info' = 'success';

  showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.message = message;
    this.type = type;
    this.show = true;
    setTimeout(() => this.show = false, 2500);
  }

  hideToast() {
    this.show = false;
  }
}
