import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../../structure/product'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
@Input() products$: Observable<Product[]> = of([])
}
