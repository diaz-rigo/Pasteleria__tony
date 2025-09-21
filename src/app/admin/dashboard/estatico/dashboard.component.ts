// import { Component, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// type Tab = 'resumen';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule,RouterModule],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent {
//   activeTab = signal<Tab>('resumen');

//   setTab(t: Tab) { this.activeTab.set(t); }
//   isTab(t: Tab) { return this.activeTab() === t; }

//   // Métricas demo (estático)
//   kpis = [
//     { label: 'Ventas hoy', value: '$3,240', delta: '+12%' },
//     { label: 'Pedidos activos', value: '18', delta: '+3' },
//     { label: 'Productos sin stock', value: '7', delta: '-2' },
//     { label: 'Ticket promedio', value: '$180', delta: '+$12' },
//   ];

//   // Listas demo (estático)
//   topProducts = [
//     { name: 'Pastel Red Velvet 1kg', ventas: 42, precio: 320, img: 'https://picsum.photos/seed/red/80/80' },
//     { name: 'Pay de Limón 1/2kg', ventas: 31, precio: 180, img: 'https://picsum.photos/seed/lime/80/80' },
//     { name: 'Brownies (6 pzas)', ventas: 27, precio: 150, img: 'https://picsum.photos/seed/brown/80/80' },
//   ];

//   recentOrders = [
//     { code: 'ORD-5493', cliente: 'María León', total: 540, estado: 'PREPARACION', fecha: '09/09/2025' },
//     { code: 'ORD-5487', cliente: 'J. Ramírez', total: 320, estado: 'CONFIRMADO', fecha: '09/09/2025' },
//     { code: 'ORD-5481', cliente: 'L. Camacho', total: 180, estado: 'ENTREGADO', fecha: '08/09/2025' },
//   ];
// }
