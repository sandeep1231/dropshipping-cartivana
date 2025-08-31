import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product, Order } from '../../models/api-models';
import { environment } from '../../../environments/environment';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: false
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  quantity = 1;
  zoomStyle: any = {};
  selectedImageIndex: number = 0;
  mainImageUrl: string = '';
  imageUrls: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService, // Inject OrderService
    public cd: ChangeDetectorRef,
    private toastService: ToastService,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(id).subscribe((data: Product) => {
      // Fix imageUrls for backend-served images
      let fixedImageUrls: string[] = [];
      if (Array.isArray(data.imageUrls) && data.imageUrls.length > 0) {
        fixedImageUrls = data.imageUrls.map(url => url.startsWith('/uploads')
          ? environment.apiUrl.replace(/\/api$/, '') + url
          : url);
      }
      this.product = {
        ...data,
        imageUrls: fixedImageUrls,
        description: data.description || 'This is a beautiful handcrafted product from Odisha, made with care and tradition. Perfect for your home or as a unique gift. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur.'
      };
      this.imageUrls = fixedImageUrls;
      this.mainImageUrl = fixedImageUrls[0] || '';
      this.selectedImageIndex = 0;
      this.cd.detectChanges();
    });
  }

  onImageMouseMove(event: MouseEvent) {
    const img = event.target as HTMLImageElement;
    const rect = img.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.zoomStyle = {
      transform: 'scale(2)',
      'transform-origin': `${x}% ${y}%`,
      'z-index': 10,
      'box-shadow': '0 8px 32px rgba(0,0,0,0.18)'
    };
  }

  onImageMouseLeave() {
    this.zoomStyle = {};

  }

  onThumbnailClick(index: number) {
    this.selectedImageIndex = index;
    this.mainImageUrl = this.imageUrls[index];
  }
  addToCart(productId: string , quantity: number): void {
    this.cartService.addToCart(productId, quantity).subscribe(() => {
      this.toastService.showToast('Product added to cart!', 'success');
      this.cartService.refreshCartQuantity();
    });
  }

  buyNow(productId: string, quantity: number): void {
    if (!this.product) return;
    
    const totalAmount = this.product.price * quantity;
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
}
