import { Component, OnInit, OnDestroy } from '@angular/core';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { Store, select } from '@ngrx/store';
import * as fromProduct from '../state/product.reducer';
import * as productActions from '../state/product.actions';
import { takeWhile } from '../../../../node_modules/rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  componentActive = true;
  errorMessage$: Observable<string>;
  products$: Observable<Product[]>;
  pageTitle = 'Products';
  errorMessage: string;

  displayCode: boolean;

  products: Product[];

  // Used to highlight the selected product in the list
  selectedProduct: Product | null;

  constructor(
    private store: Store<fromProduct.State>,
    private productService: ProductService
  ) { }

  ngOnInit(): void {

    this.store.pipe(
      select(fromProduct.getCurrentProduct),
      takeWhile( () => this.componentActive )
    ).subscribe(
      currentProduct => this.selectedProduct = currentProduct
    );

    this.errorMessage$ = this.store.pipe( select(fromProduct.getError));
    this.store.dispatch(new productActions.Load());
    this.products$ = this.store.pipe(
      select(fromProduct.getProducts)
    );

    this.store.pipe(
      select(fromProduct.getShowProductCode),
      takeWhile( () => this.componentActive )
    ).subscribe( showproductCode => {
        this.displayCode = showproductCode;
    });
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  checkChanged(value: boolean): void {
    this.store.dispatch( new productActions.ToggleProductCode(value) );
  }

  newProduct(): void {
    this.store.dispatch( new productActions.InitializeCurrentProduct() );
  }

  productSelected(product: Product): void {
    this.store.dispatch( new productActions.SetCurrentProduct(product) );
  }

}
