import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from './../../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  limit = 10;
  offset = 0;
  status: 'loading' | 'success' | 'error' | 'init' = 'init';
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.status = 'loading';
    this.productService.getAll()
    .subscribe(products => {
      this.products = [...this.products, ...products];
      this.offset += this.limit;
      this.status = 'success';
    });
  }
}
