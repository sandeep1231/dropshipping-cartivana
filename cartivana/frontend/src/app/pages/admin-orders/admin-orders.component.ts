import { Component, OnInit } from '@angular/core';
// import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  standalone: false
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  filters = {
    email: '',
    status: '',
    startDate: '',
    endDate: ''
  };

  statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.adminService.getAllOrders(this.filters).subscribe(res => {
      this.orders = res;
    });
  }

  goToOrderDetails(orderId: string): void {
    this.router.navigate(['/admin/orders', orderId]);
  }
}
