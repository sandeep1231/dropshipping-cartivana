import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SupplierService } from '../../services/supplier.service';
import { ProductService } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';
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
  environment = environment;
  get asyncUploading(): boolean {
    return Array.isArray(this.imageUploading) && this.imageUploading.some(u => u);
  }
  myProducts: Product[] = [];
  rejectedProducts: Product[] = [];
  categories: Category[] = [];
  newProduct = {
    _id: '',
    name: '',
    imageUrls: ['', '', '', ''], // Up to 4 images
    description: '',
    price: 0,
    category: '' // This will store the category ObjectId
  };
  imageUploading: boolean[] = [false, false, false, false];
  imageSelected: boolean[] = [false, false, false, false];
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
    private productService: ProductService,
    private categoryService: CategoryService,
    private http: HttpClient,
    // private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.loadProductStats();
    this.loadOrderStats();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        console.log('Supplier dashboard - categories from API:', data);
        data.forEach((cat, index) => {
          console.log(`Category ${index + 1}:`, {
            name: cat.name,
            isActive: cat.isActive,
            isActiveType: typeof cat.isActive
          });
        });
        
        // Ensure isActive has a default value and filter for active categories
        this.categories = data.map(cat => ({
          ...cat,
          isActive: cat.isActive !== undefined ? cat.isActive : true
        })).filter(cat => cat.isActive);
        
        console.log('Filtered categories for supplier:', this.categories);
      },
      error: (error: any) => {
        console.error('Error loading categories for supplier:', error);
      }
    });
  }

  // Handle category selection from the CategorySelector component
  onCategorySelected(category: Category): void {
    // The CategorySelector component will handle updating the ngModel
    // This method can be used for additional logic if needed
    console.log('Category selected:', category);
  }

  // Helper method to get category name from ObjectId or name
  getCategoryName(categoryValue: any): string {
    if (!categoryValue) return 'No Category';
    
    // If it's already a category object with name (from populated data)
    if (typeof categoryValue === 'object' && categoryValue.name) {
      return categoryValue.name;
    }
    
    // If it's an ObjectId string, find the category name
    if (typeof categoryValue === 'string') {
      const category = this.categories.find(cat => cat._id === categoryValue || cat.name === categoryValue);
      return category ? category.name : categoryValue;
    }
    
    return 'Unknown Category';
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
    // Prevent submit if any image is uploading
    if (this.imageUploading.some(uploading => uploading)) {
      alert('Please wait for all images to finish uploading.');
      return;
    }
    // Filter out empty image URLs before sending to backend
    const filteredProduct = {
      ...this.newProduct,
      imageUrls: this.newProduct.imageUrls.filter(url => url && url.trim() !== '')
    };
    console.log('Sending product data:', filteredProduct);
    this.supplierService.addProduct(filteredProduct).subscribe({
      next: (response) => {
        console.log('Product added successfully:', response);
        this.showAddProductForm = false;
        this.newProduct = { _id: '', name: '', imageUrls: ['', '', '', ''], description: '', price: 0, category: '' };
        this.imageUploading = [false, false, false, false];
        this.imageSelected = [false, false, false, false];
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error adding product:', error);
        alert('Failed to add product. Please try again.');
      }
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
    const index = parseInt(input.getAttribute('data-index') || '0', 10);
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const formData = new FormData();
    formData.append('image', file);
    this.imageUploading[index] = true;
    this.imageSelected[index] = true;
    this.http.post<{ imageUrl: string }>(`${environment.apiUrl}/upload`, formData).subscribe({
      next: (res) => {
        this.newProduct.imageUrls[index] = res.imageUrl;
        this.imageUploading[index] = false;
      },
      error: () => {
        this.imageUploading[index] = false;
        alert('Image upload failed. Please try again.');
      }
    });
  }
  // Cleaned up duplicate addProduct and productService usage
  
}
