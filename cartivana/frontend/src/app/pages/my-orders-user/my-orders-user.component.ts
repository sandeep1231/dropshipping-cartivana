import { Component, OnInit } from '@angular/core';
// import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/api-models';

@Component({
  selector: 'app-my-orders-user',
  templateUrl: './my-orders-user.component.html',
  styleUrls: ['./my-orders-user.component.scss'],
  standalone: false
})
export class MyOrdersUserComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.orderService.getMyOrdersForUser().subscribe((res: Order[]) => {
      this.orders = res;
    });
  }

  goToOrder(id: string): void {
    this.router.navigate(['/my-orders', id]);
  }

  getOrderSummaryStatus(order: Order): string {
    if (!order.products || order.products.length === 0) return '';
    // Priority: cancelled > pending > confirmed > shipped > delivered
    const statusPriority = ['cancelled', 'pending', 'confirmed', 'shipped', 'delivered'];
    let found = 'delivered';
    for (const status of statusPriority) {
      if (order.products.some(item => item.status === status)) {
        found = status;
        break;
      }
    }
    return found;
  }
}
