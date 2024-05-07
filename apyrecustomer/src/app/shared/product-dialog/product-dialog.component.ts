import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { merge, Observable, Subject, startWith, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap, mergeScan, switchMap } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/structure/product';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.scss'
})
export class ProductDialogComponent implements OnInit {

  products$!: Observable<Product[]>;
  productArray!: Product[];
  filter: string = '';
  private searchTerms = new Subject<string>();
  categories: string[] = ['urns', 'memorial items', 'caskets']
  selectedCategory: string =  '';

  constructor(private productSvc: ProductService, private ref: DynamicDialogRef){}

  ngOnInit(): void {
    this.products$ = merge(
      this.productSvc.getData(),
      this.searchTerms.pipe(
        debounceTime(30), 
        distinctUntilChanged(),
        switchMap((term: string) => this.productSvc.getData(term))
      )
    );
  }
  

  searchByInput(event: Event): void {
    const term = event.target as HTMLInputElement
    this.searchTerms.next(term.value);
}

searchByDropdown(event: DropdownChangeEvent): void {
    this.selectedCategory = event.value;
    this.searchTerms.next(this.selectedCategory);
}


  close(product?: Product) {
    if (product !== undefined) {
      this.ref?.close(product);
    } else {
      this.ref?.close();
    }
  }

  getKeys(product: Product): string[]{
    return Object.keys(product) as string[];
  }

}
