import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, mergeMap, map, catchError, tap  } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import * as TokenActions from './token.actions';

@Injectable()
export class TokenEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  verifyTokens$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokenActions.verifyTokens),
      mergeMap(() => {
        const accessToken = this.tokenService.getAccessToken();
        const refreshToken = this.tokenService.getRefreshToken();

        if (accessToken && refreshToken) {
          return this.authService.verifyToken(accessToken, refreshToken).pipe(
            tap(resp => console.log('verifying token: ', resp)),
            map(response => {
              if (response) {
                return TokenActions.tokensVerified();
              } else {
                this.router.navigate(['/login']);
                return TokenActions.tokensVerificationFailed();
              }
            }),
            catchError(error => {
              console.error('Error verifying tokens:', error);
              this.router.navigate(['/login']);
              return of(TokenActions.tokensVerificationFailed());
            })
          );
        } else {
          this.router.navigate(['/login']);
          return of(TokenActions.tokensVerificationFailed());
        }
      })
    )
  );
}
