import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminSummaryResponse, OrdersService } from '../../shared/services/orders.service';
import { Order } from '../../shared/types/orders.types';

type Tab = 'resumen';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private ordersSvc = inject(OrdersService);

  activeTab = signal<Tab>('resumen');
  isTab(t: Tab) { return this.activeTab() === t; }
  setTab(t: Tab) { this.activeTab.set(t); }

  // loading & error
  loading = signal<boolean>(false);
  errorMsg = signal<string | null>(null);

  // imagen fallback para top-products
  defaultImg = 'https://placehold.co/160x160?text=Foto';

  // datos vivos
  summary = signal<AdminSummaryResponse['data'] | null>(null);
  recentOrders = signal<{ code: string; cliente: string; total: number; estado: string; fecha: string }[]>([]);
  topProducts = signal<{ name: string; ventas: number; precio: number; img?: string }[]>([]);

  // KPIs
  kpis = signal<{ label: string; value: string | number; delta?: string }[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.loading.set(true);
    this.errorMsg.set(null);

    // 1) Summary → KPIs
    this.ordersSvc.adminSummary().subscribe({
      next: (res) => {
        this.summary.set(res.data);
        this.computeKpis(res.data);
      },
      error: (err) => {
        this.errorMsg.set('No se pudo cargar el resumen');
        console.error(err);
      }
    });

    // 2) Pedidos recientes
    this.ordersSvc.listOrdersAdmin({ sortBy: 'createdAt_desc', page: 1, pageSize: 5 }).subscribe({
      next: (res) => {
        const items = res.data?.items ?? [];
        const mapped = items.map((o: Order) => ({
          code: o.orderCode ?? String(o._id ?? '—'),
          cliente: o.customer?.nombre ?? '—',
          total: o.payment?.total ?? 0,
          estado: o.meta?.status ?? '—',
          fecha: this.formatProgramado(o),                 // 👈 aquí el cambio clave
          metodo: o.delivery?.metodoEntrega ?? '—',        // (opcional si luego lo pintas)
          modo: o.meta?.mode ?? '—'                        // (opcional)
        }));
        this.recentOrders.set(mapped);
      },
      error: (err) => {
        this.errorMsg.set('No se pudieron cargar pedidos recientes');
        console.error(err);
      },
      complete: () => this.loading.set(false)
    });

    // 3) Top productos (nuevo endpoint)
    this.ordersSvc.adminTopProducts?.(5).subscribe?.({
      next: (res: any) => {
        // Si tu endpoint no trae img, deja el campo para usar defaultImg en la vista
        this.topProducts.set(res.data ?? []);
      },
      error: (e: any) => console.error(e)
    });
  }

  private computeKpis(data: AdminSummaryResponse['data']) {
    const totalIngresos = data?.totals?.total ?? 0;
    const totalPedidos = (data?.byStatus ?? []).reduce((acc, s) => acc + (s.count || 0), 0);
    const activos = (data?.byStatus ?? [])
      .filter(s => !['ENTREGADO', 'CANCELADO'].includes(s._id ?? ''))
      .reduce((acc, s) => acc + s.count, 0);
    const ticketProm = totalPedidos > 0 ? (totalIngresos / totalPedidos) : 0;

    this.kpis.set([
      { label: 'Ingresos (periodo)', value: `$${totalIngresos.toFixed(2)}` },
      { label: 'Pedidos activos', value: activos },
      { label: 'Productos sin stock', value: '—' },
      { label: 'Ticket promedio', value: `$${ticketProm.toFixed(2)}` }
    ]);
  }


  // defaultImg = 'https://via.placeholder.com/80x80?text=PT';
  private readonly TZ = 'America/Monterrey';

  private fmtDate(d?: string | Date, withTime = true): string {
    if (!d) return '—';
    const dt = typeof d === 'string' ? new Date(d) : d;
    return withTime
      ? dt.toLocaleString('es-MX', { timeZone: this.TZ, dateStyle: 'short', timeStyle: 'short' })
      : dt.toLocaleDateString('es-MX', { timeZone: this.TZ });
  }

  private formatProgramado(o: Order): string {
    const iso = o?.delivery?.schedule?.fecha;     // p.ej. "2025-09-20T18:50:00.000Z"
    const horaStr = o?.delivery?.schedule?.horaStr; // p.ej. "18:50"
    if (!iso) return this.fmtDate(o?.createdAt, true);

    const dt = new Date(iso);
    const today = new Date();
    const sameDay =
      dt.toLocaleDateString('es-MX', { timeZone: this.TZ }) ===
      today.toLocaleDateString('es-MX', { timeZone: this.TZ });

    const label = sameDay ? 'hoy' : this.fmtDate(dt, false);
    const hhmm = horaStr ?? dt.toLocaleTimeString('es-MX', { timeZone: this.TZ, hour: '2-digit', minute: '2-digit' });
    return `${label} ${hhmm}`;
  }
  statusClass(s?: string) {
  switch (s) {
    case 'CONFIRMADO':   return 'bg-indigo-50 text-indigo-700';
    case 'PREPARACION':  return 'bg-amber-50 text-amber-700';
    case 'LISTO':        return 'bg-emerald-50 text-emerald-700';
    case 'EN_CAMINO':    return 'bg-sky-50 text-sky-700';
    case 'ENTREGADO':    return 'bg-green-50 text-green-700';
    case 'CANCELADO':    return 'bg-rose-50 text-rose-700';
    default:             return 'bg-slate-100 text-slate-700';
  }
}



}
