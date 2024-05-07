// token.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  setAccessToken(token: string): void {
    localStorage.setItem(this.accessTokenKey, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
    
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>('/refresh-token', this.getRefreshToken());
  }

  getTokenExp(): Date | null {
    const accessToken = this.getAccessToken();
    if (accessToken) {
        return this.expirationTime(accessToken);
    } else {
        console.error('No access token to extract expiration time from!');
        return null;
    }
}

clearTokens(){
  localStorage.clear();
}

  expirationTime(token: string): Date | null {
  const parts = token.split('.');
  if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
  }
  const payloadBase64Url = parts[1];
  try {
      const payloadJSON = atob(payloadBase64Url);
      const payload = JSON.parse(payloadJSON);
      if ('exp' in payload) {
          // Expiration time is in seconds, so multiply by 1000 to convert to milliseconds
          return payload.exp;
      } else {
          console.error('Expiration time (exp) not found in the JWT payload');
          return null;
      }
  } catch (error) {
      console.error('Error extracting expiration time:', error);
      return null;
  }
}




}
