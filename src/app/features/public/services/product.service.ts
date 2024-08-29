import { environment } from './../../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // private apiUrl = `${environment.api}/product`; // Your API URL
  // return this.http.get<IproductResponse>(`${environment.api}/product/${id}`)

  constructor(private http: HttpClient) { }

  // Function to get all products
  getProducts(): Observable<any> {
    return this.http.get<any>(`${environment.api}/product`);
  }
}
