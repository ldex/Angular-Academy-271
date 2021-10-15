import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, startWith, switchMap } from 'rxjs/operators';

import { Product } from '../product.interface';
import { FavouriteService } from '../favourite.service';
import { ProductService } from '../product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  @Input() product: Product;

  constructor(
    private favouriteService: FavouriteService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  newFavourite(product: Product) {
    this.favouriteService.addToFavourites(product);
    this.router.navigateByUrl('/products');
  }

  private idParamFromRoute$: Observable<number> = this.activatedRoute.params.pipe(
    filter(routeParams => routeParams.hasOwnProperty("id")), // Is there an id parameter ?
    map(routeParams => routeParams["id"]), // get the id parameter
    filter(id => !isNaN(id)), // filter numeric values ("9000" or 9000)
    map(id => Number(id)) // convert to number ("9000" -> 9000)
  ); // This will only emit if a valid id parameter is found!

  public product$: Observable<Product> = this.idParamFromRoute$.pipe(
    startWith(0), // No id parameter found or id param is not a valid number => default id to 0
    switchMap(
      id => this
              .productService
              .products$
              .pipe(
                map(products => products.find(p => p.id === id) ?? {} as Product), // no product found (or id == 0) returns an empty object
              )
    )
  );

  ngOnInit(): void {
    // const id = + this.activatedRoute.snapshot.params['id'];
    // this
    //   .productService
    //   .products$
    //   .pipe(
    //     map(products => products.find(p => p.id === id))
    //   )
    //   .subscribe(
    //     product => this.product = product
    //   )
  }

}
