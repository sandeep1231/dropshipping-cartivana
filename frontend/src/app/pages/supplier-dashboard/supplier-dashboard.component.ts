import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SupplierService } from '../../services/supplier.service';
import { Product } from '../../models/api-models';
import { HttpClient } from '@angular/common/http';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
// import { SupplierService } from 'src/app/services/supplier.service';
// import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-supplier-dashboard',
  templateUrl: './supplier-dashboard.component.html',
  styleUrls: ['./supplier-dashboard.component.scss'],
  standalone: false
})
export class SupplierDashboardComponent implements OnInit {
  myProducts: Product[] = [];
  rejectedProducts: Product[] = [];
  newProduct = {
    _id: '',
    name: '',
    imageUrl: '',
    description: '',
    price: 0,
    category: ''
  };
  showAddProductForm = false;
  editingProduct: Product | null = null;
  searchText = '';
  currentPage = 1;
  itemsPerPage = 5;


  productStats = { total: 0, approved: 0, pending: 0, rejected: 0 };
  totalOrders = 0;

  statsCards: { label: string; value: number }[] = [];


  pieChartType: ChartType = 'pie';
  pieChartOptions: ChartOptions = { responsive: true };
  pieChartData: ChartData<'pie', number[], string> = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [{ data: [] }]
  };
  
  barChartType: ChartType = 'bar';
  barChartOptions: ChartOptions = { responsive: true };
  barChartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

barChartData: ChartData<'bar', number[], string> = {
  labels: this.barChartLabels,
  datasets: [
    { label: 'Orders', data: [] }
  ]
};

  

  constructor(
    public auth: AuthService,
    private supplierService: SupplierService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadProductStats();
    this.loadOrderStats();
  }

  loadProducts() {
    this.supplierService.getMyProducts().subscribe((products: Product[]) => {
      this.myProducts = products;
      this.rejectedProducts = this.myProducts.filter(p => p.status === 'rejected');

    });
  }
  loadProductStats() {
    this.supplierService.getProductStats().subscribe(stats => {
      this.productStats = stats;
      this.pieChartData.datasets[0].data = [stats.approved, stats.pending, stats.rejected];

      this.statsCards = [
        { label: 'Total Products', value: stats.total },
        { label: 'Approved', value: stats.approved },
        { label: 'Pending', value: stats.pending },
        { label: 'Rejected', value: stats.rejected }
      ];
    });
  }

  loadOrderStats() {
    this.supplierService.getOrderStats().subscribe(stats => {
      this.totalOrders = stats.totalOrders;
      this.statsCards.push({ label: 'Total Orders', value: stats.totalOrders });
      this.barChartData.datasets[0].data = stats.monthlyOrders;
    });
  }
  addProduct() {
    this.supplierService.addProduct(this.newProduct).subscribe(() => {
      this.showAddProductForm = false;
      this.newProduct = { _id: '', name: '', imageUrl: '', description: '', price: 0, category: '' };
      this.loadProducts();
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.supplierService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
  

editProduct(product: Product) {
  this.editingProduct = { ...product };
}

updateProduct() {
  if (!this.editingProduct) return;
  this.supplierService.updateProduct(this.editingProduct._id, this.editingProduct).subscribe(() => {
    this.editingProduct = null;
    this.loadProducts();
  });
}


get filteredProducts() {
  return this.myProducts
    .filter(p => p.name.toLowerCase().includes(this.searchText.toLowerCase()))
    .slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
}

totalPages(): number {
  return Math.ceil(this.myProducts.length / this.itemsPerPage);
}

uploadFile(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
  
    this.http.post<any>('http://localhost:5000/api/upload', formData).subscribe(res => {
      this.newProduct.imageUrl = res.imageUrl;
    });
  }
  
}
