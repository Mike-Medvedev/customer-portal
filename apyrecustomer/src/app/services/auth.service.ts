// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { tap, take } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  requestMagicLink(email: string): Observable<any> {
    const body = { email };
    return this.http.post<any>(`${this.apiUrl}/get-magic-link`, body);
  }

  verifyMagicLink(code: string): Observable<any> {
     const body = { code }
    return this.http.post<any>(`${this.apiUrl}/verify-magic-link`, body)
  }

  exchangeMagicLink(code: string): Observable<any> {
    const body = { code: code }
    return this.http.post<any>(`${this.apiUrl}/exchange-magic-link`, body ,{observe: 'response'})
  }

  verifyToken(accessToken: string, refreshToken: string): Observable<any> {
    const body = {accessToken: accessToken, refreshToken: refreshToken}

    return this.http.post<any>(`${this.apiUrl}/verify-token`, body);
  }
}