import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Cliente {
  nombre: string;
  email: string;
  telefono: string;
}

interface Item {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-order.component.html',
})
export class NewOrderComponent {
  cliente = signal<Cliente>({
    nombre: 'Cliente Demo',
    email: 'cliente@correo.com',
    telefono: '771-111-2233'
  });

  productos = signal<Item[]>([
    { id: '1', nombre: 'Pastel Chocolate 1kg', precio: 320, cantidad: 1, imagen: 'https://picsum.photos/seed/choco/100/100' },
    { id: '2', nombre: 'Pay Limón 1/2kg', precio: 180, cantidad: 2, imagen: 'https://picsum.photos/seed/lime/100/100' },
    { id: '3', nombre: 'Brownies (6 pzas)', precio: 150, cantidad: 1, imagen: 'https://picsum.photos/seed/brown/100/100' },
  ]);

  get subtotal() {
    return this.productos().reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  }
  get envio() { return 50; }
  get total() { return this.subtotal + this.envio; }

  confirmar() {
    alert(`Pedido confirmado para ${this.cliente().nombre}. Total: $${this.total}`);
  }
}
