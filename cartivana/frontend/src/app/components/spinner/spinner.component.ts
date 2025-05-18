import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>`,
  styles: [`div { display: block; margin: 2rem auto; }`]
})
export class SpinnerComponent {}
