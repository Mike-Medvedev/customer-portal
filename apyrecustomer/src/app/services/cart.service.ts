import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../structure/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Map<string, { product: Product, quantity: number, totalPrice: number }> = new Map<string, { product: Product, quantity: number, totalPrice: number }>();
  private cartSubject: BehaviorSubject<{ product: Product, quantity: number, totalPrice: number }[]> = new BehaviorSubject<{ product: Product, quantity: number, totalPrice: number }[]>([]);

  constructor() { }

  addProduct(product: Product): void {
    const existingCartItem = this.cart.get(product.sku);
    if (existingCartItem) {
      existingCartItem.quantity++;
      existingCartItem.totalPrice += parseFloat(existingCartItem.product.price);
    } else {
      this.cart.set(product.sku, { product, quantity: 1, totalPrice: parseFloat(product.price) });
    }
    this.emitCartUpdate();
  }

  removeProduct(sku: string): void {
    this.cart.delete(sku);
    this.emitCartUpdate();
  }

  getProducts(): Observable<{ product: Product, quantity: number, totalPrice: number }[]> {
    return this.cartSubject.asObservable();
  }

  private emitCartUpdate(): void {
    const cartArray = Array.from(this.cart.values());
    console.table(cartArray)
    this.cartSubject.next(cartArray);
  }
}
