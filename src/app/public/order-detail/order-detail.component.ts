import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../shared/services/orders.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent {
  private route = inject(ActivatedRoute);
  private orders = inject(OrdersService);

  vm = signal<any>(null);
  toast = signal<string | null>(null);
  toastTimer: any;

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code')!;
    this.orders.getByCode(code).subscribe({
      next: (r) => { if (r?.ok) this.vm.set(r.data); },
      error: (e) => console.error(e)
    });
  }

  variantLabel(it: any): string {
    return [it?.flavor, it?.color, it?.texture, it?.shape]
      .filter(Boolean)
      .join(' · ');
  }

  statusClass = (status?: string) => ({
    'bg-emerald-50 text-emerald-700 border-emerald-200': status === 'CONFIRMADO',
    'bg-amber-50 text-amber-700 border-amber-200': status === 'PENDIENTE',
    'bg-slate-50 text-slate-700 border-slate-200': status === 'CREADO' || !status,
    'bg-rose-50 text-rose-700 border-rose-200': status === 'RECHAZADO'
  });

  flash(msg: string) {
    this.toast.set(msg);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(null), 1500);
  }

  async copyText(val: string, msg = 'Copiado') {
    try {
      await navigator.clipboard.writeText(val);
      this.flash(msg);
    } catch {
      this.flash('No se pudo copiar');
    }
  }

  async copyAddress(o: any) {
    const addr = o?.delivery?.address || '';
    if (!addr) return this.flash('Sin dirección');
    this.copyText(addr, 'Dirección copiada');
  }

  async copySummary(o: any) {
    const lines = [
      `Pedido: ${o.orderCode}`,
      `Estado: ${o.meta?.status || '—'}`,
      `Entrega: ${o.delivery?.metodoEntrega || '—'}`,
      `Fecha: ${o.delivery?.schedule?.fecha || '—'} ${o.delivery?.schedule?.horaStr ? `· ${o.delivery?.schedule?.horaStr}` : ''}`,
      `Dirección: ${o.delivery?.address || '—'}`,
      '',
      'Artículos:',
      ...(o.items || []).map((it: any) =>
        `- ${it.productName} (${this.variantLabel(it)}${it.size ? ` · Talla ${it.size}` : ''}) x${it.quantity} = ${this.money(it.lineTotal)}`
      ),
      '',
      `Subtotal: ${this.money(o.payment?.subtotal)}`,
      `Envío: ${this.money(o.payment?.deliveryFee)}`,
      `Total: ${this.money(o.payment?.total)}`
    ].join('\n');

    this.copyText(lines, 'Resumen copiado');
  }

  async share(o: any) {
    const title = `Pedido ${o.orderCode}`;
    const text = `Estado: ${o.meta?.status || '—'} · Total: ${this.money(o.payment?.total)}`;
    const url = location.href;

    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title, text, url });
      } catch { /* cancelado */ }
    } else {
      this.copyText(`${title}\n${text}\n${url}`, 'Enlace copiado');
    }
  }

  print() {
    window.print();
  }

  private money(val: number | undefined | null) {
    const n = Number(val ?? 0);
    return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  }
}
