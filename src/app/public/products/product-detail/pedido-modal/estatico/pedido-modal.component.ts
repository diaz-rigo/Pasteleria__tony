// import { Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { OrderCustomer } from '../../../../shared/models/order.model';
// // import { OrderCustomer, OrderCreatePayload } from '../../models/order.model';

// @Component({
//   selector: 'app-pedido-modal',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './pedido-modal.component.html',
//   styleUrls: ['./pedido-modal.component.css']
// })
// export class PedidoModalComponent {
//   @Input({ required: true }) abierto = signal<boolean>(false);
//   @Input() modo: 'PEDIR' | 'APARTAR' = 'PEDIR';

//   // Datos informativos del producto seleccionados desde el padre (solo lectura en el modal)
//   @Input({ required: true }) productoNombre = '';
//   @Input() varianteFlavor: string | undefined;
//   @Input() sizeEtiqueta: string | number | undefined;
//   @Input({ required: true }) unitPrice = 0;
//   @Input({ required: true }) quantity = 1;
//   @Input() image?: string;

//   @Output() cerrar = new EventEmitter<void>();
//   @Output() enviar = new EventEmitter<OrderCustomer>();
//   private fb = inject(FormBuilder);

//   form = this.fb.group({
//     nombre: ['', [Validators.required, Validators.minLength(3)]],
//     telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
//     email: ['', [Validators.required, Validators.email]],
//     dedicatoria: [''],
//     decoracion: [''], // si luego lo ocupas arriba, lo mandas en nota
//     metodoEntrega: ['RECOGER', Validators.required],
//     direccion: [''],
//     fecha: ['', Validators.required],
//     hora: ['', Validators.required],
//     nota: [''],
//   });

//   total = computed(() => this.unitPrice * this.quantity);

//   // constructor(private fb: FormBuilder) {}

//   onClose() { this.cerrar.emit(); }

//   onSubmit() {
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }

//     const v = this.form.getRawValue();
//     const customer: OrderCustomer = {
//       nombre: v.nombre!,
//       telefono: v.telefono!,
//       email: v.email!,
//       dedicatoria: v.dedicatoria || undefined,
//       direccion: v.metodoEntrega === 'DOMICILIO' ? (v.direccion || '') : undefined,
//       metodoEntrega: v.metodoEntrega as 'RECOGER' | 'DOMICILIO',
//       fecha: v.fecha!,
//       hora: v.hora!,
//       nota: [v.nota, v.decoracion].filter(Boolean).join(' | ') || undefined,
//     };

//     this.enviar.emit(customer);
//   }
// }
