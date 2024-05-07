import { HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, EMPTY, map, Observable, of, take, tap, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

export const MenuGuard: CanActivateFn = (route, state) => {
    const tokenSvc = inject(TokenService);
    const authSvc = inject(AuthService)
    const router = inject(Router);
    const magicCode = route.queryParams['token']

    if (magicCode) {
      return authSvc.verifyMagicLink(magicCode).pipe(
        map(response => {
          if (!response) {
            console.error('Error verifying magic link:', 'Response is falsy');
            return false;
          }
          const accessToken = response.headers.get('X-Access-Token');
          const refreshToken = response.headers.get('Refresh-Token');
          tokenSvc.setAccessToken(accessToken);
          tokenSvc.setRefreshToken(refreshToken);
          return true;
        }),
        catchError(error => {
          console.error('Error verifying magic link:', error);
          return of(false);
        })
      );
    } else {
      const accesstoken = tokenSvc.getAccessToken();
      const refreshToken = tokenSvc.getRefreshToken();
      

      if (accesstoken && refreshToken) {
        console.log('CERTIFYING TOKEN')
        return authSvc.verifyToken(accesstoken, refreshToken).pipe(
          map(response => !!response),
          catchError(error => {
            console.error(error);
            return of(false);
          })
        );
      }
      router.navigate(['/login']);
      return false;
      
    }
  }
