import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OrderCreatePayload, OrderCreateResponse } from '../models/order.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private http = inject(HttpClient);

  // Ajusta la URL base a tu API
  private baseUrl = '/api/orders';

  createOrder(payload: OrderCreatePayload): Observable<OrderCreateResponse> {
    return this.http.post<OrderCreateResponse>(`${this.baseUrl}`, payload);
  }
}
