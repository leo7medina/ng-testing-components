import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { CreateProductDTO, Product, UpdateProductDTO } from '../models/product.model';

import { ProductService } from './product.service';
import { TokenService } from './token.service';
import { TokenInterceptor } from '../interceptor/token.interceptor';

import { generateManyProducts, generateOneProduct } from '../models/product.mock';
import { HttpStatusCode, HTTP_INTERCEPTORS } from '@angular/common/http';


describe('ProductService', () => {
  let service: ProductService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [
        TokenService,
        {
          provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
        }
      ]
    });
    service = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(()=> {
    httpController.verify();
  })

  describe('Test for getAllsimple', () => {
    it('should return a product list', (doneFn) => {
      //Arrage
      const mokData: Product[] = generateManyProducts(2);
      spyOn(tokenService, 'getToken').and.returnValue('123');
      //Act
      service.getAllSimple()
        .subscribe((data)=> {
          //Assert
          expect(data.length).toEqual(mokData.length);
          expect(data).toEqual(mokData);
          doneFn();
        });
      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual(`Bearer 123`);
      req.flush(mokData);
    });
  });


  describe('Test for getAll', () => {
    it('should return a product list', (doneFn) => {
      //Arrage
      const mokData: Product[] = generateManyProducts(4);
      //Act
      service.getAll()
        .subscribe((data)=> {
          //Assert
          expect(data.length).toEqual(mokData.length);
          //expect(data).toEqual(mokData);
          doneFn();
        });
      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mokData);
    });

    it('should return a product list with taxes', (doneFn) => {
      //Arrage
      const mokData: Product[] = [
        {...generateOneProduct(), price: 100},
        {...generateOneProduct(), price: 200},
        {...generateOneProduct(), price: 0},
        {...generateOneProduct(), price: -100}
      ];
      //Act
      service.getAll()
        .subscribe((data)=> {
          //Assert
          expect(data.length).toEqual(mokData.length);
          expect(data[0].taxes).toEqual(19);
          expect(data[1].taxes).toEqual(38);
          expect(data[2].taxes).toEqual(0);
          expect(data[3].taxes).toEqual(0);
          doneFn();
        });
      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mokData);
    });

    it('should send query params with limit 10 and offset 3', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3);
      const limit = 10;
      const offset = 3;
      //Act
      service.getAll(limit, offset)
      .subscribe((data)=> {
        //Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    });
  });

  describe('Test for create', () => {
    it('should return a new product', (doneFn) => {
      //Arrange
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'new product',
        price: 100,
        images: ['img'],
        description: 'asdasda',
        categoryId: 12
      }
      //act
      service.create({...dto}).subscribe( data => {
        //Assert
        expect(data).toEqual(mockData);
        doneFn();
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('test for update', () => {
    it('should update a product', (doneFn) => {
      // Arrange
      const mockData: Product = generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'new product',
      }
      const productId = '1';
      // Act
      service.update(productId, {...dto})
      .subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush(mockData);
    });
  });

  describe('test for delete', () => {
    it('should delete a product', (doneFn) => {
      // Arrange
      const mockData = true;
      const productId = '1';
      // Act
      service.delete(productId)
      .subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData);
    });
  });


  describe('test for getOne', () => {
    it('should return a product', (doneFn) => {
      // Arrange
      const mockData: Product = generateOneProduct();
      const productId = '1';
      // Act
      service.getOne(productId)
      .subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockData);
    });

    it('should return the right msg when the status code is 404', (doneFn) => {
      // Arrange
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError
      };
      // Act
      service.getOne(productId)
      .subscribe({
        error: (error) => {
          // assert
          expect(error).toEqual('El producto no existe');
          doneFn();
        }
      });

      // productService.getOne(productId)
      // .subscribe(null, (error) => {
      //   expect(error).toEqual('El producto no existe');
      //   doneFn();
      // });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });
  });


});
