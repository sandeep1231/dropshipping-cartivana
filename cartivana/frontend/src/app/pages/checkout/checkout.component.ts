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

  errors: { [key: string]: string } = {};
  orderError: string = '';

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
    this.errors = {};
    this.orderError = '';
    // Inline validation
    if (!this.form.name) this.errors['name'] = 'Full Name is required';
    if (!this.form.address) this.errors['address'] = 'Address is required';
    if (!this.form.city) this.errors['city'] = 'City is required';
    if (!this.form.pincode) this.errors['pincode'] = 'Pincode is required';
    if (!this.form.phone) this.errors['phone'] = 'Phone is required';

    if (Object.keys(this.errors).length > 0) return;

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
        this.cartService.clearCart();
        this.router.navigate(['/order-confirmation'], { queryParams: { orderId: res._id } });
      },
      error: () => {
        this.orderError = 'Failed to place order. Please try again.';
      }
    });
  }
}
