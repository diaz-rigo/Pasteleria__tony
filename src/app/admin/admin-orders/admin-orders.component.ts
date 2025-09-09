import { Component, computed, inject, signal } from '@angular/core';
import { OrdersService } from '../../shared/services/orders.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ApiError, Order } from '../../shared/types/orders.types';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

type Status =
  | 'CREADO'
  | 'PENDIENTE_PAGO'
  | 'CONFIRMADO'
  | 'PREPARACION'
  | 'LISTO'
  | 'EN_CAMINO'
  | 'ENTREGADO'
  | 'CANCELADO'
  | '';

type MetodoEntrega = 'RECOGER' | 'DOMICILIO' | '';
type Modo = 'PEDIR' | 'APARTAR' | '';
// imports: [CommonModule, FormsModule, HttpClientModule],

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, CurrencyPipe, HttpClientModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
  providers: [DatePipe, OrdersService, CurrencyPipe]
})
export class AdminOrdersComponent {
  private ordersSvc = inject(OrdersService);
  private datePipe = inject(DatePipe);
  private currency = inject(CurrencyPipe);

  // Estado de red
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Datos
  orders = signal<Order[]>([]);
  selectedOrder = signal<Order | null>(null);
  detailOpen = signal<boolean>(false);

  // Filtros / búsqueda / orden
  search = signal<string>('');
  status = signal<Status>('');
  metodo = signal<MetodoEntrega>('');
  modo = signal<Modo>('');
  startDate = signal<string>(''); // YYYY-MM-DD
  endDate = signal<string>('');   // YYYY-MM-DD
  sortBy = signal<'createdAt_desc' | 'createdAt_asc' | 'total_desc' | 'total_asc'>('createdAt_desc');

  // Paginación (cliente)
  page = signal<number>(1);
  pageSize = signal<number>(12);
  // nuevos estados para server paging
  serverTotal = signal<number>(0);
  serverTotalPages = signal<number>(1);

  // Cargador inicial
  ngOnInit(): void {
    this.load();
  }
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.ordersSvc.listOrdersAdmin({
      q: this.search(),
      status: this.status(),
      metodo: this.metodo(),
      modo: this.modo(),
      startDate: this.startDate(),
      endDate: this.endDate(),
      sortBy: this.sortBy(),
      page: this.page(),
      pageSize: this.pageSize()
    }).subscribe({
      next: (resp) => {
        this.loading.set(false);
        if (resp.ok) {
          const d = resp.data;
          this.orders.set(d.items);
          this.page.set(d.page);
          this.pageSize.set(d.pageSize);
          this.serverTotal.set(d.total);
          this.serverTotalPages.set(d.totalPages);
        } else {
          const e = resp as unknown as ApiError;
          this.error.set(e.msg || 'Error al cargar pedidos');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Error de red al cargar pedidos');
        console.error(err);
      }
    });
  }
  mark(next: Status) {
  const id = this.selectedOrder()?.['_id'];
  if (!id) return;
  this.ordersSvc.markStatus(id, next).subscribe({
    next: (r) => {
      if (r.ok) {
        this.selectedOrder.set(r.data);
        this.load(); // para refrescar la lista
      }
    },
    error: (e) => console.error(e)
  });
}

  // load(): void {
  //   this.loading.set(true);
  //   this.error.set(null);
  //   // Aquí NO pasamos userId ni guestId porque es vista admin (global)
  //   this.ordersSvc.listOrders().subscribe({
  //     next: (resp) => {
  //       this.loading.set(false);
  //       if (resp.ok) {
  //         this.orders.set(resp.data);
  //         // reinicia paginación cuando recargas
  //         this.page.set(1);
  //       } else {
  //         const e = resp as ApiError;
  //         this.error.set(e.msg || 'Error al cargar pedidos');
  //       }
  //     },
  //     error: (err) => {
  //       this.loading.set(false);
  //       this.error.set('Error de red al cargar pedidos');
  //       console.error(err);
  //     }
  //   });
  // }

  // --- Derivados (computed) ---
  filtered = computed<Order[]>(() => {
    const q = this.search().toLowerCase().trim();
    const s = this.status();
    const m = this.metodo();
    const md = this.modo();
    const sd = this.startDate();
    const ed = this.endDate();

    return this.orders().filter(o => {
      // Búsqueda por código / cliente / email / teléfono / producto
      const inSearch =
        !q ||
        o.orderCode?.toLowerCase().includes(q) ||
        o.customer?.nombre?.toLowerCase().includes(q) ||
        o.customer?.email?.toLowerCase().includes(q) ||
        o.customer?.telefono?.toLowerCase().includes(q) ||
        (o.items?.some(i =>
          i.productName?.toLowerCase().includes(q) ||
          i.flavor?.toLowerCase().includes(q)
        ));

      if (!inSearch) return false;

      // Filtro por estado
      if (s && o.meta?.status !== s) return false;

      // Filtro por método entrega
      if (m && o.delivery?.metodoEntrega !== m) return false;

      // Filtro por modo (PEDIR / APARTAR)
      if (md && o.meta?.mode !== md) return false;

      // Filtro por rango de fecha (createdAt)
      if (sd) {
        const from = new Date(sd + 'T00:00:00');
        if (new Date(o.createdAt) < from) return false;
      }
      if (ed) {
        const to = new Date(ed + 'T23:59:59');
        if (new Date(o.createdAt) > to) return false;
      }

      return true;
    });
  });

  sorted = computed<Order[]>(() => {
    const list = [...this.filtered()];
    switch (this.sortBy()) {
      case 'createdAt_asc':
        return list.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
      case 'total_desc':
        return list.sort((a, b) => (b.payment?.total ?? 0) - (a.payment?.total ?? 0));
      case 'total_asc':
        return list.sort((a, b) => (a.payment?.total ?? 0) - (b.payment?.total ?? 0));
      case 'createdAt_desc':
      default:
        return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
  });

  totalItems = computed(() => this.sorted().length);
  totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize())));
  paginated = computed<Order[]>(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.sorted().slice(start, start + this.pageSize());
  });

  // --- UI helpers ---
  setPage(p: number) {
    const max = this.totalPages();
    if (p < 1) p = 1;
    if (p > max) p = max;
    this.page.set(p);
  }

  resetFilters() {
    this.search.set('');
    this.status.set('');
    this.metodo.set('');
    this.modo.set('');
    this.startDate.set('');
    this.endDate.set('');
    this.sortBy.set('createdAt_desc');
    this.page.set(1);
  }

  openDetail(o: Order) {
    this.selectedOrder.set(o);
    this.detailOpen.set(true);
  }
  closeDetail() {
    this.detailOpen.set(false);
    // this.selectedOrder.set(null); // si deseas limpiar
  }

  // --- formatos ---
  fmtDate(d: string) {
    return this.datePipe.transform(d, 'dd/MM/yyyy, HH:mm') || '';
  }
  fmtMoney(n?: number) {
    return this.currency.transform(n ?? 0, 'MXN', 'symbol-narrow', '1.0-0') || '$0';
  }

  // --- chips / estilos ---
  statusBadgeClasses(s?: string) {
    switch (s) {
      case 'CREADO':
        return 'bg-slate-100 text-slate-800 ring-1 ring-slate-200';
      case 'PENDIENTE_PAGO':
        return 'bg-amber-100 text-amber-800 ring-1 ring-amber-200';
      case 'CONFIRMADO':
        return 'bg-blue-100 text-blue-800 ring-1 ring-blue-200';
      case 'PREPARACION':
        return 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200';
      case 'LISTO':
        return 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200';
      case 'EN_CAMINO':
        return 'bg-cyan-100 text-cyan-800 ring-1 ring-cyan-200';
      case 'ENTREGADO':
        return 'bg-green-100 text-green-800 ring-1 ring-green-200';
      case 'CANCELADO':
        return 'bg-rose-100 text-rose-800 ring-1 ring-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 ring-1 ring-slate-200';
    }
  }

  metodoBadgeClasses(m?: string) {
    return m === 'DOMICILIO'
      ? 'bg-purple-100 text-purple-800 ring-1 ring-purple-200'
      : 'bg-slate-100 text-slate-800 ring-1 ring-slate-200';
  }


  // === Estado de acción ===
actionBusy = signal<boolean>(false);

// Mapa de transiciones válidas (puedes ajustar a tu flujo)
private forwardFlow: Status[] = [
  'CREADO',
  'PENDIENTE_PAGO',
  'CONFIRMADO',
  'PREPARACION',
  'LISTO',
  'EN_CAMINO',
  'ENTREGADO'
];

// Devuelve las opciones permitidas desde el estado actual
allowedNextStatuses(current?: Status): Status[] {
  if (!current) return ['CONFIRMADO'];
  
  // Handle terminal states first
  if (current === 'CANCELADO' || current === 'ENTREGADO') {
    return [];
  }
  
  const idx = this.forwardFlow.indexOf(current);
  const nexts: Status[] = [];

  // Allow moving forward one step
  if (idx >= 0 && idx < this.forwardFlow.length - 1) {
    nexts.push(this.forwardFlow[idx + 1]);
  }

  // Always allow cancellation for non-terminal states
  nexts.push('CANCELADO');

  return nexts;
}
private canTransition(from: Status | undefined, to: Status): boolean {
  if (!from) return true;
  if (from === to) return false;
  if (to === 'CANCELADO' && from !== 'ENTREGADO') return true;
  const a = this.forwardFlow.indexOf(from);
  const b = this.forwardFlow.indexOf(to);
  return a !== -1 && b !== -1 && b >= a; // solo hacia delante
}

// // Acción: marcar nuevo estatus
// mark(next: Status) {
//   const id = this.selectedOrder()?.['_id'] as string | undefined;
//   if (!id || !next) return;

//   this.actionBusy.set(true);

//   // Optimistic UI (opcional): guarda snapshot para revertir si falla
//   const prev = this.selectedOrder();

//   this.ordersSvc.markStatus(id, next).subscribe({
//     next: (resp) => {
//       this.actionBusy.set(false);
//       if (!resp.ok) return;

//       // Actualiza detalle
//       this.selectedOrder.set(resp.data);

//       // Sincroniza en el array de la tabla
//       const updated = resp.data;
//       const list = this.orders().map(o => (o['_id'] === updated['_id'] ? updated : o));
//       this.orders.set(list);
//     },
//     error: (err) => {
//       this.actionBusy.set(false);
//       console.error(err);
//       // Aquí podrías mostrar un toast
//     }
//   });
// }


}
