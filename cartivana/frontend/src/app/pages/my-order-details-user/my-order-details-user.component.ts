import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/api-models';

@Component({
  selector: 'app-my-order-details-user',
  templateUrl: './my-order-details-user.component.html',
  styleUrls: ['./my-order-details-user.component.scss'],
  standalone: false
})
export class MyOrderDetailsUserComponent implements OnInit {
  order: Order | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getOrderByIdForUser(id).subscribe((res: Order) => {
        this.order = res;
        this.loading = false;
      });
    }
  }
  isStepActive(step: string): boolean {
    if (!this.order || !this.order.products) return false;
    return this.order.products.some(item => item.status === step.toLowerCase());
  }
}
