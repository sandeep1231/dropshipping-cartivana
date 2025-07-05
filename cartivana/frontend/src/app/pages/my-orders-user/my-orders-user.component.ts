import { Component, OnInit } from '@angular/core';
// import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/api-models';

@Component({
  selector: 'app-my-orders-user',
  templateUrl: './my-orders-user.component.html',
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
}
