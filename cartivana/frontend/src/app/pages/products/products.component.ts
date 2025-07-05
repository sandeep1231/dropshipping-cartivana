import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/api-models';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: false
})
export class ProductsComponent implements OnInit {
    constructor(private cartService: CartService, private productService: ProductService){}
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories = ['All', 'Woodcraft', 'Textiles', 'Jewelry', 'Paintings'];
  selectedCategory = 'All';
  quantities: { [key: string]: number } = {};

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
        this.allProducts = data;
        this.filteredProducts = [...this.allProducts];
  });
    // this.allProducts = [
    //   { id: '1',name: 'Wooden Tray', price: 899, imageUrl: '/assets/images/woodcraft.jpg', category: 'Woodcraft' },
    //   { id: '2',name: 'Pattachitra Painting', price: 1499, imageUrl: '/assets/images/paintings.jpg', category: 'Paintings' },
    //   { id: '3',name: 'Silver Necklace', price: 2199, imageUrl: '/assets/images/jewelry.jpg', category: 'Jewelry' },
    //   { id: '4',name: 'Silk Ikat Shawl', price: 2599, imageUrl: '/assets/images/textiles.jpg', category: 'Textiles' },
    //   { id: '5',name: 'Bamboo Wall Art', price: 999, imageUrl: '/assets/images/woodcraft.jpg', category: 'Woodcraft' }
    // ];
    
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.filteredProducts = category === 'All'
      ? [...this.allProducts]
      : this.allProducts.filter((p: { category: string; }) => p.category === category);
  }

  addToCart(productId: string, quantity: number = 1): void {
    this.cartService.addToCart(productId, quantity).subscribe(() => {
      alert('Added to cart!');
    });
  }
}
