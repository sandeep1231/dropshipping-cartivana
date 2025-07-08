

import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/api-models';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
// import { ProductService } from 'src/app/services/product.service';
// import { Product } from 'src/app/models/api-models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  quantities: { [key: string]: number } = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.productService.getFeatured().subscribe((res: Product[]) => {
      this.featuredProducts = res;
      // Initialize quantities to 1 for each product
      this.featuredProducts.forEach(p => {
        if (!this.quantities[p._id]) {
          this.quantities[p._id] = 1;
        }
      });
    });
  }

  addToCart(productId: string, quantity: number = 1): void {
    this.cartService.addToCart(productId, quantity).subscribe(() => {
      this.toastService.showToast('Product added to cart!', 'success');
      this.cartService.refreshCartQuantity();
      this.quantities[productId] = 1; // reset after add
    });
  }
}
