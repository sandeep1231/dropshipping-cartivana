import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/api-models';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: false
})
export class ProductDetailComponent implements OnInit {
    product: Product | undefined;
    quantity = 1;

  mockProducts = [
    {
      id: '1',
      name: 'Pattachitra Wall Hanging',
      price: 1499,
      imageUrl: '/assets/images/pattachitra.jpg',
      category: 'Paintings',
      description: 'Traditional Odisha Pattachitra painting handcrafted by regional artists. A cultural masterpiece.',
      details: 'Material: Cotton Canvas | Size: 24x36 inches | Shipping: Free'
    },
    {
      id: '2',
      name: 'Silver Tribal Necklace',
      price: 2199,
      imageUrl: '/assets/images/jewelry.jpg',
      category: 'Jewelry',
      description: 'Authentic silver-toned necklace inspired by tribal Odisha designs. Lightweight and stunning.',
      details: 'Material: Mixed Alloy | Adjustable | Delivered in 4-6 days'
    },
    { id: '3',name: 'Silver Necklace', price: 2199, imageUrl: '/assets/images/jewelry.jpg', category: 'Jewelry', description: 'Authentic silver-toned necklace inspired by tribal Odisha designs. Lightweight and stunning.',
        details: 'Material: Mixed Alloy | Adjustable | Delivered in 4-6 days' },
      { id: '4',name: 'Silk Ikat Shawl', price: 2599, imageUrl: '/assets/images/textiles.jpg', category: 'Textiles', description: 'Authentic silver-toned necklace inspired by tribal Odisha designs. Lightweight and stunning.',
        details: 'Material: Mixed Alloy | Adjustable | Delivered in 4-6 days' },
      { id: '5',name: 'Bamboo Wall Art', price: 999, imageUrl: '/assets/images/woodcraft.jpg', category: 'Woodcraft', description: 'Authentic silver-toned necklace inspired by tribal Odisha designs. Lightweight and stunning.',
        details: 'Material: Mixed Alloy | Adjustable | Delivered in 4-6 days' }
  ];

  constructor(private route: ActivatedRoute, private cartService: CartService, private productService: ProductService, public cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(id).subscribe((data: Product) => {
      // Add dummy description for demo
      this.product = {
        ...data,
        description: data.description || 'This is a beautiful handcrafted product from Odisha, made with care and tradition. Perfect for your home or as a unique gift. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur.'
      };
      this.cd.detectChanges();
    });
  }
  addToCart(productId: string , quantity: number): void {
    this.cartService.addToCart(productId, quantity).subscribe(() => {
      alert('Product added to cart!');
    });
  }
}
