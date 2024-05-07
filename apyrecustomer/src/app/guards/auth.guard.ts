import { HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import {
  catchError,
  EMPTY,
  map,
  Observable,
  of,
  take,
  tap,
  switchMap,
  throwError,
  observable,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ErrorService } from '../services/error.service';
import { TokenService } from '../services/token.service';

export const AuthsGuard: CanActivateFn = (route, state) => {
  const tokenSvc = inject(TokenService);
  const authSvc = inject(AuthService);
  const router = inject(Router);
  const errorSvc = inject(ErrorService);
  const magicCode = route.queryParams['token'];

  const accessToken = tokenSvc.getAccessToken();
  const refreshToken = tokenSvc.getRefreshToken();
  if (accessToken && refreshToken) {
    return authSvc.verifyToken(accessToken, refreshToken).pipe(
      map(response => {
        if (!response) {
          const error = new Error('Unauthorized: Error 401');
          console.error(error);
          router.navigate(['/landing']);
          return false;
        }
        console.log('returning true guard is passing for verifying token');
        return true;
      }),
      catchError(err => {
        console.error(err);
        const error = new Error('Unauthorized: Error 401');
        console.error(error);
        router.navigate(['/landing']);
        return of(false);
      }),
    );
  } else if (magicCode) {
    return authSvc.verifyMagicLink(magicCode).pipe(
      switchMap(res => {
        if (!res) {
          router.navigate(['/landing']);
          return of(false);
        } else {
          return authSvc.exchangeMagicLink(magicCode).pipe(
            tap(res => {
              tokenSvc.setAccessToken(res.headers.get('x-access-token'));
              tokenSvc.setRefreshToken(res.headers.get('refresh-token'));
            }),
            map(() => {
              return router.createUrlTree([state.url.split('?')[0]]); //navigate to /prelim without token
            }),
          );
        }
      }),
      catchError(err => {
        errorSvc.tokenExpired();
        console.error(err);
        const error = new Error('Unauthorized: Error 401');
        console.error(error);
        router.navigate(['/landing']);
        return of(false);
      }),
    );
  } else {
    const error = new Error('Unauthorized: Error 401');
    console.error(error);
    router.navigate(['/landing']);
    return false;
  }
};
