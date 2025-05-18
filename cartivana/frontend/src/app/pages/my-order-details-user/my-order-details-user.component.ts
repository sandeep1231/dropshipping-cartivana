import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
// import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-my-order-details-user',
  templateUrl: './my-order-details-user.component.html',
  standalone: false
})
export class MyOrderDetailsUserComponent implements OnInit {
  order: any;
  loading = true;

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getOrderByIdForUser(id).subscribe(res => {
        this.order = res;
        this.loading = false;
      });
    }
  }
}
