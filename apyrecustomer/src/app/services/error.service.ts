import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private error$ = new Observable<number>();

  constructor() {}

  tokenExpired(): void {
    this.error$ = of(0);
  }

  getTokenExpiredObservable(): Observable<number | null> {
    return this.error$
  }
}
