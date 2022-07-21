import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ValueService } from 'src/app/services/value.service';
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
  rta = '';
  constructor(
    private productService: ProductService,
    private valueService: ValueService
    ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.status = 'loading';
    this.productService.getAll()
    .subscribe({
      next: (products) => {
        this.products = [...this.products, ...products];
        this.offset += this.limit;
        this.status = 'success';
      },
      error: error => {
        setTimeout(() => {
          this.products = [];
          this.status = 'error';
        }, 3000);
      }
    });
  }

 async callPromise() {
  this.rta = await this.valueService.getPromiseValue();
  return this.rta;
 }
}
