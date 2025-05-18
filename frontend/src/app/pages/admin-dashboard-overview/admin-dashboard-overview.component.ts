import { Component } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { AdminService } from '../../services/admin.service';

interface RoleCount {
  _id: string;
  count: number;
}
@Component({
  selector: 'app-admin-dashboard-overview',
  standalone: false,
  templateUrl: './admin-dashboard-overview.component.html',
  styleUrl: './admin-dashboard-overview.component.scss'
})


export class AdminDashboardOverviewComponent {

  
  totalUsers = 0;
  totalProducts = 0;
  totalOrders = 0;
  roleStats: { [role: string]: number } = {};

  loading = true;

  pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  barChartData: ChartData<'bar', number[], string> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
             'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{ label: 'Orders', data: [] }]
  };

  pieChartOptions: ChartOptions = { responsive: true };
  barChartOptions: ChartOptions = { responsive: true };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAdminStats().subscribe(stats => {
      this.totalUsers = stats.totalUsers;
      this.totalProducts = stats.totalProducts;
      this.totalOrders = stats.totalOrders;

      this.roleStats = Object.fromEntries(
        (stats.roleCounts as RoleCount[]).map(r => [r._id, r.count])
      );
      this.pieChartData.labels = Object.keys(this.roleStats);
      this.pieChartData.datasets[0].data = Object.values(this.roleStats);

      this.barChartData.datasets[0].data = stats.monthlyOrders;

      this.loading = false;
    });
  }
}
