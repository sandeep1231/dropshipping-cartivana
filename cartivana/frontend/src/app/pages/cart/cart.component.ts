import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.model';
import { environment } from '../../../environments/environment';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: false
})
export class CartComponent implements OnInit {
  cartItems: any = [];
  cart: Cart | undefined;
  loading = false;
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }
  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe(data => {
      // Fix imageUrl for backend-served images in cart items
      if (data && data.items) {
        data.items = data.items.map((item: any) => ({
          ...item,
          product: {
            ...item.product,
            imageUrl: item.product.imageUrl && item.product.imageUrl.startsWith('/uploads')
              ? environment.apiUrl.replace(/\/api$/, '') + item.product.imageUrl
              : item.product.imageUrl
          }
        }));
      }
      this.cart = data;
      this.loading = false;
    }, () => { this.loading = false; });
  }

  updateQuantity(itemId: string, quantity: number): void {
    this.loading = true;
    this.cartService.updateCartItem(itemId, quantity).subscribe(() => {
      this.loadCart();
      this.cartService.refreshCartQuantity();
    }, () => { this.loading = false; });
  }

  removeItem(itemId: string): void {
    this.loading = true;
    this.cartService.removeCartItem(itemId).subscribe(() => {
      this.loadCart();
      this.cartService.refreshCartQuantity();
    }, () => { this.loading = false; });
  }
  addToCart(productId: string, quantity: number = 1): void {
    this.loading = true;
    this.cartService.addToCart(productId, quantity).subscribe(() => {
      this.loadCart();
      this.cartService.refreshCartQuantity();
    }, () => { this.loading = false; });
  }
  updateQty(itemId: string, quantity: number): void {
    this.updateQuantity(itemId, quantity);
  }
  
  get total() {
    return this.cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  }
}
