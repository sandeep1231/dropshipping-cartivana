import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SupplierService } from '../../services/supplier.service';
import { Product } from '../../models/api-models';
// import { Product } from 'src/app/models/api-models';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: false
})
export class AdminDashboardComponent {

    allProducts: any[] = [];
supplierFilter = '';
pendingProducts: Product[] = [];

constructor(public auth: AuthService, private supplierService: SupplierService) {}

loadAllProducts() {
  this.supplierService.getAllProducts(this.supplierFilter).subscribe((res: any) => {
    this.allProducts = res;
  });
}

deleteProduct(id: string) {
  if (confirm('Are you sure you want to delete this product?')) {
    this.supplierService.deleteProduct(id).subscribe(() => {
      this.loadAllProducts();
    });
  }
}


loadPendingProducts() {
  this.supplierService.getPendingProducts().subscribe((res: Product[]) => {
    this.pendingProducts = res;
  });
}

approveProduct(id: string) {
  this.supplierService.approveProduct(id).subscribe(() => {
    this.loadPendingProducts();
    this.loadAllProducts();
  });
}
rejectProduct(id: string) {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason !== null) {
      this.supplierService.rejectProduct(id, reason).subscribe(() => {
        this.loadPendingProducts();
        this.loadAllProducts();
      });
    }
  }
  toggleFeatured(id: string) {
    this.supplierService.toggleFeatured(id).subscribe(() => {
      this.loadAllProducts();
    });
  }
  
  

ngOnInit(): void {
    this.loadAllProducts();
    this.loadPendingProducts();
}

}
