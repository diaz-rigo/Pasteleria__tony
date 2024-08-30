// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Subject } from 'rxjs';
// import { CartItem } from 'src/app/shared/models/cart.model';
// import { StorageService } from './storage.service';
// import { TotalPriceService } from 'src/app/shared/services/total-price.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class CartService {
//   private cart: CartItem[] = [];
//   itemsInCart: Subject<number> = new Subject<number>();
//   quantity: number = 0;
//   private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
//   cartItems$ = this.cartItemsSubject.asObservable();
//   totalPrice$: BehaviorSubject<number> = new BehaviorSubject<number>(0); // Definir totalPrice$

//   constructor(
//     private storegService: StorageService,
//     private totalPriceService: TotalPriceService // Inyectar el servicio de precio total
//   ) {}

//   updateCartItems(items: CartItem[]): void {
//     this.cartItemsSubject.next(items);
//   }

//   addItem(id: string, quantity: number): void {
//     this.cart = this.storegService.getCarrito();
//     this.cart.forEach((item) => {
//       if (item.id === id) {
//         item.cantidad = item.cantidad + quantity;
//       }
//     });
//     this.sendQuantity();
//     this.updateTotalPrice(); // Actualizar el precio total al agregar un elemento al carrito
//     this.storegService.setCarrito(this.cart);
//   }

//   add(cartItem: CartItem): void {
//     let isExist = false;
//     this.cart = this.storegService.getCarrito();
//     if (this.cart && this.cart.length > 0) {
//       this.cart.forEach((item) => {
//         if (item.id === cartItem.id) {
//           item.cantidad = item.cantidad + 1;
//           isExist = true;
//         }
//       });
//       if (!isExist) {
//         this.cart.push(cartItem);
//       }
//     } else {
//       this.cart = [cartItem];
//     }
//     this.sendQuantity();
//     this.updateTotalPrice(); // Actualizar el precio total al agregar un elemento al carrito
//     this.storegService.setCarrito(this.cart);

//   }

//   decre(cartItem: CartItem): void {
//     this.cart = this.storegService.getCarrito();
//     if (this.cart && this.cart.length > 0) {
//       this.cart.forEach((item, index) => {
//         if (item.id === cartItem.id && item.cantidad > 0) {
//           item.cantidad--; // Reduce la cantidad en 1
//         }
//       });
//     }
//     this.sendQuantity();
//     this.updateTotalPrice(); // Actualizar el precio total al decrementar la cantidad de un elemento
//     this.storegService.setCarrito(this.cart);
//   }

//   remove(cartItem: CartItem): void {
//     this.cart = this.storegService.getCarrito();
//     if (this.cart && this.cart.length > 0) {
//       this.cart.forEach((item, index) => {
//         if (item.id === cartItem.id) {
//           this.cart.splice(index, 1); // Elimina el elemento del arreglo
//           return; // Termina el bucle forEach una vez que se elimina el elemento
//         }
//       });
//     }
//     this.sendQuantity();
//     this.updateTotalPrice(); // Actualizar el precio total al eliminar un elemento del carrito
//     this.storegService.setCarrito(this.cart);
//   }

//   private sendQuantity(): void {
//     this.quantity = 0;
//     this.cart.forEach((item) => {
//       this.quantity = this.quantity + item.cantidad;
//     });
//     this.itemsInCart.next(this.quantity);
//   }

//   // Método para calcular el precio total y actualizar el servicio de precio total
//   private updateTotalPrice(): void {
//     const totalPrice = this.calculateTotalPrice();
//     this.totalPriceService.updateTotalPrice(totalPrice);
//   }

//   // Método para calcular el precio total del carrito
//   private calculateTotalPrice(): number {
//     return this.cart.reduce((total, item) => total + item.precio * item.cantidad, 0);
//   }
//   getCartItem(productId: string): CartItem | undefined {
//     return this.cart.find(item => item.id === productId);
//   }

//   updateQuantity(productId: string, newQuantity: number): void {
//     const cartItem = this.cart.find(item => item.id === productId);
//     if (cartItem) {
//       cartItem.cantidad = newQuantity;
//       this.sendQuantity();
//       this.updateTotalPrice(); // Actualizar el precio total al actualizar la cantidad de un elemento
//       this.storegService.setCarrito(this.cart);
//     }
//   }
//   // Otros métodos del servicio...
// }
