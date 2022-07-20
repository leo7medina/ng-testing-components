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
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getAll()
    .subscribe(products => {
      this.products = products;
    });
  }
}
