import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  constructor() { }
   // Método para guardar datos de compra en el almacenamiento
   savePurchaseData(data: any): void {
    localStorage.setItem('purchaseData', JSON.stringify(data));
  }

  // Método para obtener datos de compra del almacenamiento
  getPurchaseData(): any {
    const purchaseDataString = localStorage.getItem('purchaseData');
    if (purchaseDataString) {
      return JSON.parse(purchaseDataString);
    }
    return null;
  }

  // Método para eliminar datos de compra del almacenamiento
  clearPurchaseData(): void {
    localStorage.removeItem('purchaseData');
  }
}
