import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartQuantity = 0;
  private cartSub?: Subscription;

  constructor(public auth: AuthService, private router: Router, public cartService: CartService) {}

  ngOnInit() {
    this.cartSub = this.cartService.getCartQuantityObservable().subscribe(qty => {
      this.cartQuantity = qty;
    });
    // Initial fetch
    this.cartService.refreshCartQuantity();
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
