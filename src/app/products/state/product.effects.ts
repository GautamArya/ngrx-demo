import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as productActions from './product.actions';
import { ProductService } from '../product.service';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Product } from '../product';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class ProductEffects {
  constructor( private action$: Actions,
  private productService: ProductService) { }

  @Effect()
  loadProducts$: Observable<Action> = this.action$.pipe(
    ofType( productActions.ProductActionTypes.Load),
    mergeMap( (action: productActions.Load) => this.productService.getProducts().pipe(
      map( (products: Product[]) => ( new productActions.LoadSuccess(products) ) ),
      catchError( err => of(new productActions.LoadFail(err)))
    ) )
  );

  @Effect()
  updateProduct$: Observable<Action> = this.action$.pipe(
    ofType(productActions.ProductActionTypes.UpdateProduct),
    map( (action: productActions.UpdateProduct) => action.payload),
    mergeMap( (product: Product) =>
      this.productService.updateProduct(product).pipe(
        map(updatedProduct => (new productActions.UpdateProductSuccess(updatedProduct))),
        catchError( err => of(new productActions.UpdateProductFail(err)))
      )
    )
  );

  @Effect()
  createProduct$: Observable<Action> = this.action$.pipe(
    ofType(productActions.ProductActionTypes.CreateProduct),
    // ofType(productActions.ProductActionTypes.SetCurrentProduct),
    map( (action: productActions.CreateProduct) => action.payload ),
    mergeMap( (product: Product) =>
      this.productService.createProduct(product).pipe(
        map( newProduct => (new productActions.CreateProductSuccess(newProduct))),
        catchError(err => of(new productActions.UpdateProductFail(err)))
      )
    )
  );
}
