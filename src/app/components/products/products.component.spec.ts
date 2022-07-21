import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { generateManyProducts } from 'src/app/models/product.mock';
import { ProductService } from 'src/app/services/product.service';
import { ProductComponent } from '../product/product.component';
import { ProductsComponent } from './products.component';
import {of, defer} from 'rxjs';
import { ValueService } from 'src/app/services/value.service';
import { By } from '@angular/platform-browser';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let valueService: jasmine.SpyObj<ValueService>

  beforeEach(async () => {
    let productServiceSpy = jasmine.createSpyObj('ProductService', ['getAll']);
    let valueServiceSpy = jasmine.createSpyObj('ValueService', ['getPromiseValue']);

    await TestBed.configureTestingModule({
      declarations: [ ProductsComponent, ProductComponent ],
      providers: [
        {provide: ProductService, useValue: productServiceSpy},
        {provide: ValueService, useValue: valueServiceSpy}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    valueService = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
//    fixture.detectChanges();
    const productsMock = generateManyProducts(3);
    console.log(productsMock);
    productService.getAll.and.returnValue(of(productsMock));
    fixture.detectChanges();//ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(productService.getAll).toHaveBeenCalled();
  });

  describe('tests for getAllProducts', () => {

    it('should return product list from service', () => {
      // Arrange
      const productsMock = generateManyProducts(10);
      productService.getAll.and.returnValue(of(productsMock));
      const countPrev = component.products.length;
      // Act
      component.getAllProducts();
      fixture.detectChanges();
      // Assert
      expect(component.products.length).toEqual(productsMock.length + countPrev);
    });

    it('should change the status "loading" => "success"', fakeAsync(() => {
      // Arrange
      const productsMock = generateManyProducts(10);
      productService.getAll.and.returnValue(defer(() => Promise.resolve(productsMock)));
      // Act
      component.getAllProducts();
      fixture.detectChanges();

      expect(component.status).toEqual('loading');

      tick(); // exec, obs, setTimeout, promise
      fixture.detectChanges();
      // Assert
      expect(component.status).toEqual('success');
    }));

    it('should change the status "loading" => "error"', fakeAsync(() => {
      // Arrange
      productService.getAll.and.returnValue(defer(() => Promise.reject('error')));
      // Act
      component.getAllProducts();
      fixture.detectChanges();

      expect(component.status).toEqual('loading');

      tick(4000); // exec, obs, setTimeout, promise
      fixture.detectChanges();
      // Assert
      expect(component.status).toEqual('error');
    }));

    describe('Test for callPromise', () => {
      
      it('should call to promise',async () => {
        //Arrange
        const mockMsg = 'my mock is string';
        valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));
        
        const rta = await component.callPromise();
        fixture.detectChanges();
        //Assert
        expect(rta).toEqual(mockMsg);
        expect(valueService.getPromiseValue).toHaveBeenCalled()
      });

      it('should show "my mock string" in <p> when btn was clicked', fakeAsync(() => {
        // Arrange
        const mockMsg = 'my mock string';
        valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));
        const btnDe = fixture.debugElement.query(By.css('.btn-promise'));
        // Act
        btnDe.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();
        const rtaDe = fixture.debugElement.query(By.css('p.rta'));
        // Assert
        expect(component.rta).toEqual(mockMsg);
        expect(valueService.getPromiseValue).toHaveBeenCalled();
        expect(rtaDe.nativeElement.textContent).toEqual(mockMsg);
      }));
    })

  });
});
