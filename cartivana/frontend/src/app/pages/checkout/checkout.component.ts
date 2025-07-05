import { Component, OnInit } from '@angular/core';
// import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Cart } from '../../models/cart.model';
import { Order } from '../../models/api-models';
// import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: false
})
export class CheckoutComponent implements OnInit {
  cartItems: Cart | undefined;
  form = {
    name: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
    paymentMethod: 'cod'
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(cart => this.cartItems = cart);
  }

//   get total() {
//     return this.cartItems?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
//   }

  placeOrder() {
    if (!this.form.name || !this.form.address || !this.form.city || !this.form.pincode || !this.form.phone) {
      alert('Please fill all fields');
      return;
    }

    if (!this.cartItems) return;
    const products = this.cartItems.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity
    }));
    const totalAmount = this.cartItems.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const orderPayload = {
      products,
      totalAmount
    };

    this.orderService.placeOrder(orderPayload).subscribe({
      next: (res: Order) => {
        alert('✅ Order placed successfully!');
        this.cartService.clearCart();
        this.router.navigate(['/']);
      },
      error: () => {
        alert('❌ Failed to place order.');
      }
    });
  }
}
