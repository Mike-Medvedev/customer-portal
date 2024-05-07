import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiURL = environment.apiURL;

  constructor(private http: HttpClient) {}

  sendFormData(formData: any): Observable<any> {
    const body = {formData: formData};
    console.log('Sending data to backend' + formData)
    return this.http.post<any>(`${this.apiURL}/send-form-data`, body)
  }


}
