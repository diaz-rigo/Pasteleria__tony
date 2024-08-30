// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Subject } from 'rxjs';
// import { CartItem } from 'src/app/shared/models/cart.model';
// import { StorageService } from './storage.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class CartService {
//   private cart: CartItem[] = [];
//   itemsInCart: Subject<number> = new Subject<number>();
//   quantity: number = 0;
//   private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
//   cartItems$ = this.cartItemsSubject.asObservable();

//   constructor(private storegService: StorageService) {}
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
//     // localStorage.setItem('carrito', JSON.stringify(this.cart));
//     this.storegService.setCarrito(this.cart);
//   }

//   // remove(cartItem: CartItem): void {
//   //   this.cart=this.storegService.getCarrito()
//   //   if (this.cart && this.cart.length > 0) {
//   //     this.cart.forEach((item) => {
//   //       if (item.id === cartItem.id && item.cantidad > 0) {
//   //         item.cantidad = item.cantidad- 1;
//   //       } else if (this.quantity === 0) {
//   //         this.cart = this.cart.find(item => item.id != cartItem.id)
//   //       }
//   //     });
//   //   }
//   //   this.sendQuantity();
//   //   this.storegService.setCarrito(this.cart)
//   // }
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
//  this.storegService.setCarrito(this.cart);
//   }

//   //   this.sendQuantity();
//   //   this.storegService.setCarrito(this.cart);
//   // }
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
//     this.storegService.setCarrito(this.cart);
//   }

//   private sendQuantity(): void {
//     this.quantity = 0;
//     this.cart.forEach((item) => {
//       this.quantity = this.quantity + item.cantidad;
//     });
//     this.itemsInCart.next(this.quantity);
//   }




//   // totalPrice$ = new BehaviorSubject<number>(0);

//   // // Método para actualizar el carrito y el precio total
//   // updateCartAndTotalPrice(newCartItems: CartItem[]): void {
//   //   this.cartItems = newCartItems;
//   //   const totalPrice = this.calculateTotalPrice();
//   //   this.totalPrice$.next(totalPrice); // Emitir el precio total actualizado
//   // }

//   // Función para obtener un elemento del carrito por su ID
//   getCartItem(productId: string): CartItem | undefined {
//     return this.cart.find(item => item.id === productId);
//   }

//   // Función para actualizar la cantidad de un elemento en el carrito
//   updateQuantity(productId: string, newQuantity: number): void {
//     const cartItem = this.cart.find(item => item.id === productId);
//     if (cartItem) {
//       cartItem.cantidad = newQuantity;
//       this.sendQuantity();
//       this.storegService.setCarrito(this.cart);
//     }
//   }
// }
