import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private pedidoInfoSubject = new BehaviorSubject<any>(null);
  pedidoInfo$ = this.pedidoInfoSubject.asObservable();

  constructor() { }

  setPedidoInfo(info: any) {
    this.pedidoInfoSubject.next(info);
  }
}
