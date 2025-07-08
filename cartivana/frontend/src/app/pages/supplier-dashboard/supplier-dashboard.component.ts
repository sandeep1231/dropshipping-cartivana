import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SupplierService } from '../../services/supplier.service';
import { Product } from '../../models/api-models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
// import { environment } from '../../environments/environment';
// import { ProductService } from '../../services/product.service';
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
  imageUploading = false;
  imageSelected = false;
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
    private http: HttpClient,
    // private productService: ProductService
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
    // If an image was selected but not uploaded yet, prevent submit
    if (this.imageSelected && (this.imageUploading || !this.newProduct.imageUrl)) {
      alert('Please wait for the image to finish uploading.');
      return;
    }
    this.supplierService.addProduct(this.newProduct).subscribe(() => {
      this.showAddProductForm = false;
      this.newProduct = { _id: '', name: '', imageUrl: '', description: '', price: 0, category: '' };
      this.imageUploading = false;
      this.imageSelected = false;
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

  uploadFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const formData = new FormData();
    formData.append('image', file);
    this.imageUploading = true;
    this.imageSelected = true;
    this.http.post<{ imageUrl: string }>(`${environment.apiUrl}/upload`, formData).subscribe({
      next: (res) => {
        this.newProduct.imageUrl = res.imageUrl;
        this.imageUploading = false;
      },
      error: () => {
        this.imageUploading = false;
        alert('Image upload failed. Please try again.');
      }
    });
  }
  // Cleaned up duplicate addProduct and productService usage
  
}
