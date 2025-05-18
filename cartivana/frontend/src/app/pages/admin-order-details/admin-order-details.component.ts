import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin.service';
// import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-order-details',
  templateUrl: './admin-order-details.component.html',
  standalone: false
})
export class AdminOrderDetailsComponent implements OnInit {
  order: any;
  loading = true;
  statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  constructor(private route: ActivatedRoute, private adminService: AdminService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.adminService.getOrderById(id).subscribe(res => {
        this.order = res;
        this.loading = false;
      });
    }
  }

  updateStatus(newStatus: string): void {
    if (!this.order?._id) return;
    this.adminService.updateOrderStatus(this.order._id, newStatus).subscribe(res => {
      this.order.status = newStatus;
    });
  }
}
