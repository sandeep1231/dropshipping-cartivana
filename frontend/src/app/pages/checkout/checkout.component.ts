import { Component, OnInit } from '@angular/core';
// import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Cart } from '../../models/cart.model';
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

    const orderPayload = {
      products: this.cartItems?.items.map((item: { _id: any; quantity: any; }) => ({
        product: item._id,
        quantity: item.quantity
      }))
    };

    this.orderService.placeOrder(orderPayload).subscribe({
      next: (res) => {
        alert('✅ Order placed successfully!');
        this.cartService.clearCart();
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert('❌ Failed to place order.');
        console.error(err);
      }
    });
  }
}
