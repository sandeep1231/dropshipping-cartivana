

import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/api-models';
import { ProductService } from '../../services/product.service';
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

//   featuredProducts = [
//     { name: 'Handcrafted Tribal Art', price: 1299, imageUrl: '/assets/images/art1.jpg' },
//     { name: 'Odisha Ikat Saree', price: 2399, imageUrl: '/assets/images/ikat.jpg' },
//     { name: 'Pattachitra Wall Hanging', price: 1799, imageUrl: '/assets/images/pattachitra.jpg' },
//     { name: 'Stone Carved Buddha', price: 3499, imageUrl: '/assets/images/buddha.jpg' }
//   ];
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getFeatured().subscribe((res: Product[]) => {
      this.featuredProducts = res;
    });
  }
}
