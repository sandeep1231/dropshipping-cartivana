import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, Order } from '../../models/api-models';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../../environments/environment';
// import { ProductService } from 'src/app/services/product.service';
// import { Product } from 'src/app/models/api-models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  environment = environment;
  featuredProducts: Product[] = [];
  categories: string[] = [];
  quantities: { [key: string]: number } = {};

  modernCategories = [
    {
      name: 'Woodcraft',
      description: 'Handcrafted wooden artifacts and sculptures',
      image: '/assets/images/categories/woodcraft.jpg',
      icon: 'bi bi-tree',
      count: 150
    },
    {
      name: 'Textiles',
      description: 'Traditional handwoven fabrics and garments',
      image: '/assets/images/categories/textiles.jpg',
      icon: 'bi bi-scissors',
      count: 120
    },
    {
      name: 'Jewelry',
      description: 'Exquisite silver and traditional ornaments',
      image: '/assets/images/categories/jewelry.jpg',
      icon: 'bi bi-gem',
      count: 80
    },
    {
      name: 'Paintings',
      description: 'Pattachitra and contemporary art pieces',
      image: '/assets/images/categories/paintings.jpg',
      icon: 'bi bi-palette',
      count: 60
    }
  ];

  testimonials = [
    {
      text: "The quality is exceptional! Each piece reflects the true craftsmanship of Odisha artisans.",
      name: "Priya Sharma",
      location: "Mumbai",
      avatar: "/assets/images/testimonials/user1.jpg"
    },
    {
      text: "Fast delivery and authentic products. Cartivana has become my go-to for unique gifts.",
      name: "Raj Patel",
      location: "Delhi",
      avatar: "/assets/images/testimonials/user2.jpg"
    },
    {
      text: "Supporting local artisans while getting beautiful products. What more could I ask for?",
      name: "Anita Desai",
      location: "Bangalore",
      avatar: "/assets/images/testimonials/user3.jpg"
    }
  ];

  constructor(
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Load categories
    this.productService.getCategories().subscribe((data: string[]) => {
      this.categories = data;
    });

    // Try to get featured products first
    this.productService.getFeatured().subscribe({
      next: (res: Product[]) => {
        this.featuredProducts = res.map(p => ({
          ...p,
          imageUrls: Array.isArray(p.imageUrls) && p.imageUrls.length > 0
            ? p.imageUrls.map(url => url.startsWith('/uploads')
              ? environment.apiUrl.replace(/\/api$/, '') + url
              : url)
            : ['/assets/images/placeholder.png']
        }));
        // If no featured products, get regular products as fallback
        if (this.featuredProducts.length === 0) {
          this.loadRegularProducts();
        } else {
          this.initializeQuantities();
        }
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
        // Fallback to regular products
        this.loadRegularProducts();
      }
    });
  }

  private loadRegularProducts(): void {
    this.productService.getProducts().subscribe({
      next: (res: Product[]) => {
        // Take first 6 products as featured if no actual featured products exist
        this.featuredProducts = res.slice(0, 6).map(p => ({
          ...p,
          imageUrls: Array.isArray(p.imageUrls) && p.imageUrls.length > 0
            ? p.imageUrls.map(url => url.startsWith('/uploads')
              ? environment.apiUrl.replace(/\/api$/, '') + url
              : url)
            : ['/assets/images/placeholder.png']
        }));
        this.initializeQuantities();
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  private initializeQuantities(): void {
    // Initialize quantities to 1 for each product
    this.featuredProducts.forEach(p => {
      if (!this.quantities[p._id]) {
        this.quantities[p._id] = 1;
      }
    });
  }

  addToCart(productId: string, quantity: number = 1): void {
    this.cartService.addToCart(productId, quantity).subscribe(() => {
      this.toastService.showToast('Product added to cart!', 'success');
      this.cartService.refreshCartQuantity();
      this.quantities[productId] = 1; // reset after add
    });
  }

  buyNow(productId: string, quantity: number = 1): void {
    const product = this.featuredProducts.find(p => p._id === productId);
    if (!product) return;
    
    const totalAmount = product.price * quantity;
    this.orderService.buyNow(productId, quantity, totalAmount).subscribe({
      next: (order: Order) => {
        this.toastService.showToast('Order placed successfully!', 'success');
        this.router.navigate(['/order-confirmation'], { queryParams: { orderId: order._id } });
      },
      error: (error) => {
        console.error('Buy now failed:', error);
        this.toastService.showToast('Failed to place order. Please try again.', 'error');
      }
    });
  }

  increaseQty(productId: string) {
    if (!this.quantities[productId]) this.quantities[productId] = 1;
    this.quantities[productId]++;
  }

  decreaseQty(productId: string) {
    if (!this.quantities[productId]) this.quantities[productId] = 1;
    if (this.quantities[productId] > 1) {
      this.quantities[productId]--;
    }
  }
}
