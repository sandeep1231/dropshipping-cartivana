import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: false
})
export class CartComponent implements OnInit {
  cartItems: any = [];
  cart: Cart | undefined;
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }
  loadCart(): void {
    this.cartService.getCart().subscribe(data => this.cart = data);
  }

  updateQuantity(itemId: string, quantity: number): void {
    this.cartService.updateCartItem(itemId, quantity).subscribe(() => this.loadCart());
  }

  removeItem(itemId: string): void {
    this.cartService.removeCartItem(itemId).subscribe(() => this.loadCart());
  }
  addToCart(productId: string, quantity: number = 1): void {
    this.cartService.addToCart(productId, quantity).subscribe(() => {
      this.loadCart();
    });
  }
  updateQty(itemId: string, quantity: number): void {
    this.updateQuantity(itemId, quantity);
  }
  
  get total() {
    return this.cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  }
}
