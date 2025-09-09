// src/app/shared/services/orders.service.ts
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  ApiError,
  ApiOkOrder,
  ApiOkOrders,
  CreateOrderRequest,
  Order
} from '../types/orders.types';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);
// src/app/shared/services/orders.service.ts


  private resource = `${environment.api}/orders`;
  getByCode(orderCode: string) {
  return this.http.get<{ok: boolean; data: any}>(`${this.resource}/code/${encodeURIComponent(orderCode)}`);
}
  listOrdersAdmin(params: {
    q?: string; status?: string;
    metodo?: 'RECOGER' | 'DOMICILIO' | '';
    modo?: 'PEDIR' | 'APARTAR' | '';
    startDate?: string; endDate?: string;
    sortBy?: 'createdAt_desc' | 'createdAt_asc' | 'total_desc' | 'total_asc';
    page?: number; pageSize?: number;
  } = {}) {
    let hp = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') hp = hp.set(k, String(v));
    });
    return this.http.get<{ ok: boolean; data: {
      page: number; pageSize: number; total: number; totalPages: number; items: Order[];
    } }>(`${this.resource}/admin`, { params: hp });
  }

  markStatus(id: string, nextStatus: string) {
    return this.http.patch<{ ok: boolean; data: Order }>(`${this.resource}/${id}/status`, { nextStatus });
  }
  saveAdminNote(id: string, note: string) {
    return this.http.patch<{ ok: boolean; data: Order }>(`${this.resource}/${id}/note`, { note });
  }
  updatePayment(id: string, payload: {
    method?: string; status?: string; deliveryFee?: number; discount?: number;
    depositRequired?: boolean; depositAmount?: number;
  }) {
    return this.http.patch<{ ok: boolean; data: Order }>(`${this.resource}/${id}/payment`, payload);
  }
  /**
   * Crea un pedido/apartado. Si pasas userId se envía en header `x-user-id`.
   */
  createOrder(payload: CreateOrderRequest, userId?: string): Observable<ApiOkOrder | ApiError> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (userId) headers = headers.set('x-user-id', userId);

    return this.http.post<ApiOkOrder | ApiError>(this.resource, payload, { headers });
  }

  /**
   * Obtiene un pedido por _id de Mongo.
   */
  getOrderById(id: string, userId?: string): Observable<ApiOkOrder | ApiError> {
    let headers = new HttpHeaders();
    if (userId) headers = headers.set('x-user-id', userId);
    return this.http.get<ApiOkOrder | ApiError>(`${this.resource}/${id}`, { headers });
  }

  /**
   * Obtiene un pedido por orderCode.
   */
  getByOrderCode(orderCode: string, userId?: string): Observable<ApiOkOrder | ApiError> {
    let headers = new HttpHeaders();
    if (userId) headers = headers.set('x-user-id', userId);
    return this.http.get<ApiOkOrder | ApiError>(`${this.resource}/code/${orderCode}`, { headers });
  }

  /**
   * Lista pedidos del usuario logeado (si envías userId) o por invitado (guestId).
   * Puedes combinar filtros: status (ej. 'CREADO', 'CONFIRMADO', etc.).
   */
  listOrders(opts?: { userId?: string; guestId?: string; status?: string }): Observable<ApiOkOrders | ApiError> {
    const { userId, guestId, status } = opts || {};
    let headers = new HttpHeaders();
    if (userId) headers = headers.set('x-user-id', userId);

    let params = new HttpParams();
    if (guestId) params = params.set('guestId', guestId);
    if (status) params = params.set('status', status);

    return this.http.get<ApiOkOrders | ApiError>(this.resource, { headers, params });
  }

  // ====== Helpers ======

  /**
   * Arma un payload CreateOrderRequest desde tu formulario/reactive form.
   * Puedes llamarlo antes de createOrder().
   */
  static buildPayloadFromForm(formValue: any, selected: {
    productId: string;
    variant?: { flavor?: string; color?: string; texture?: string; shape?: string };
    size: number;
    quantity: number;
    unitPrice: number;
    images?: string[];
  }): CreateOrderRequest {
    return {
      nombre: formValue.nombre,
      telefono: formValue.telefono,
      email: formValue.email,
      metodoEntrega: formValue.metodoEntrega,
      direccion: formValue.metodoEntrega === 'DOMICILIO' ? formValue.direccion : undefined,
      fecha: formValue.fecha,      // "YYYY-MM-DD"
      hora: formValue.hora,        // "HH:mm"
      dedicatoria: formValue.dedicatoria || undefined,
      decoracion: formValue.decoracion || undefined,
      nota: formValue.nota || undefined,
      modo: formValue.modo,        // 'APARTAR' | 'PEDIR'
      productId: selected.productId,
      variant: selected.variant,
      size: selected.size,
      quantity: selected.quantity,
      unitPrice: selected.unitPrice,
      images: selected.images
    };
  }
}
