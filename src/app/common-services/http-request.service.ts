import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  public baseUrl: string;
  private headers: HttpHeaders;
  private options: any;

  constructor(private _http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    // You can enhance this with dynamic logic like your old service
    //this.baseUrl = 'http://localhost:3000/'; // For Cafe Connect project
    this.baseUrl = 'https://cafe-connect-backend-ih16.onrender.com/'; // For Cafe Connect project
  }

  request(type: string, url: string, requestBody?: any): Observable<any> {
    const token = localStorage.getItem('token'); // if you plan to use token
    const headerConfig: any = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headerConfig['Authorization'] = `Bearer ${token}`;
    }

    this.headers = new HttpHeaders(headerConfig);
    this.options = { headers: this.headers };

    if (type.toLowerCase() == 'get') {
      return this._http.get(this.baseUrl + 'api/' + url, this.options);
    } 
    else if (type.toLowerCase() == 'post') {
      return this._http.post(this.baseUrl + 'api/' + url, requestBody, this.options);
    } 
    else if (type.toLowerCase() == 'patch') {
      return this._http.patch(this.baseUrl + 'api/' + url, requestBody, this.options);
    } 
    else if (type.toLowerCase() == 'delete') {
      return this._http.delete(this.baseUrl + 'api/' + url, this.options);
    } 
    else {
      throw new Error('Unsupported HTTP method: ' + type);
    }
  }
}
