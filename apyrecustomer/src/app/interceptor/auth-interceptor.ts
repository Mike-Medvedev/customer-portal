// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
// import { catchError, switchMap } from 'rxjs/operators';
// import { throwError, Observable, of, tap } from 'rxjs';
// import { TokenService } from '../services/token.service';
// import { ErrorService } from '../services/error.service';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(private tokenSvc: TokenService, private errorSvc: ErrorService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
//     if (
//       req.url.includes('/get-magic-link') ||
//       req.url.includes('/verify-magic-link') ||
//       req.url.includes('/exchange-magic-link')
//     ) {
//       return next.handle(req);
//     }
//     return next.handle(this.addToken(req)).pipe(
//       catchError((error: HttpErrorResponse) => {
//         if (error.status === 401) {
//           return this.handle401Error(req, next);
//         }
//         console.error(error);
//         return of(null);
//       }),
//     );
//   }

//   private addToken(req: HttpRequest<any>): HttpRequest<any> {
//     const accessToken = this.tokenSvc.getAccessToken();
//     const refreshToken = this.tokenSvc.getRefreshToken();

//     if (!accessToken || !refreshToken) {
//       const errorResponse = new HttpErrorResponse({
//         error: 'Unauthorized: Access token or refresh token is missing',
//         status: 401,
//         statusText: 'Unauthorized',
//       });
//       throw errorResponse;
//     }

//     return req.clone({
//       setHeaders: {
//         'x-access-token': accessToken,
//         'refresh-token': refreshToken,
//       },
//     });
//   }

//   private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
//     const expirationTime = this.tokenSvc.getTokenExp();

//     if (expirationTime && expirationTime < new Date()) {
//       this.errorSvc.tokenExpired();
//       this.tokenSvc.clearTokens();
//       console.log('intercepting 401 error and clearing tokens');
//       return this.tokenSvc.refreshToken().pipe(
//         tap(res => {
//           console.log('f');
//           console.log(
//             'THis is the new refresh token recieved from backend' +
//               res.headers.get('refresh-token'),
//           );
//           this.tokenSvc.setRefreshToken(res.headers.get('refresh-token'));
//         }),
//         switchMap((refreshedToken: string | null) => {
//           // retry  failed request with new access token
//           if (refreshedToken) {
//             console.log('A new token has been reieved from backend ');
//             req = this.addToken(req);
//             return next.handle(req);
//           } else {
//             console.error('Failed to refresh token');
//             throw new Error('Failed to refresh token');
//           }
//         }),
//       );
//     } else {
//       console.error('Unauthorized request:', req.url);
//       throw new Error('Unauthorized request');
//     }
//   }
// }
