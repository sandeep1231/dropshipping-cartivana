import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { Order } from '../../models/api-models';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe((res: Order[]) => {
      this.orders = res;
    });
  }
}
