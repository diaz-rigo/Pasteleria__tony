// import { Component, signal } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { OrdersService } from '../../shared/services/orders.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-order-detail',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './order-detail.component.html',
//   styleUrl: './order-detail.component.css'
// })
// export class OrderDetailComponent {
//   vm = signal<any>(null);
//   constructor(private route: ActivatedRoute, private orders: OrdersService) { }

//   ngOnInit() {
//     const code = this.route.snapshot.paramMap.get('code')!;
//     this.orders.getByCode(code).subscribe({
//       next: (r) => { if (r.ok) this.vm.set(r.data); },
//       error: (e) => console.error(e)
//     });
//   }
//   variantLabel(it: any): string {
//     return [it?.flavor, it?.color, it?.texture, it?.shape]
//       .filter(v => !!v)
//       .join(' · ');
//   }

// }
