import { ComponentFixture, TestBed } from '@angular/core/testing';
import { generateManyProducts } from 'src/app/models/product.mock';
import { ProductService } from 'src/app/services/product.service';
import { ProductComponent } from '../product/product.component';
import { ProductsComponent } from './products.component';
import {of} from 'rxjs';

fdescribe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    let productServiceSpy = jasmine.createSpyObj('ProductService', ['getAll']);
    await TestBed.configureTestingModule({
      declarations: [ ProductsComponent, ProductComponent ],
      providers: [
        {provide: ProductService, useValue: productServiceSpy}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
//    fixture.detectChanges();
  });

  it('should create', () => {
    const productsMock = generateManyProducts(3);
    console.log(productsMock);
    productService.getAll.and.returnValue(of(productsMock));
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(productService.getAll).toHaveBeenCalled();
  });
});
