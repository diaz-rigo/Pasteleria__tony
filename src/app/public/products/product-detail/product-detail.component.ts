import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../../shared/models/product.model';
import { Variant } from '../../../shared/models/variant.model';
import { SizeStock } from '../../../shared/models/size-stock.model';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { OrderCreatePayload, OrderItem } from '../../../shared/models/order.model';
import { OrdersService } from '../../../shared/services/orders.service';
import { PedidoModalComponent } from './pedido-modal/pedido-modal.component';
import { CreateOrderRequest } from '../../../shared/types/orders.types';
import { ToastService } from '../../../shared/services/toast.service';
import { SeoService } from '../../../shared/services/seo.service';
import { ShareService } from '../../../shared/services/share.service';
// === MINI VM del panel
type OrderMini = {
  code: string;
  metodoEntrega: 'RECOGER' | 'DOMICILIO';
  dateISO?: string;
  dateLabel?: string;
  timeLabel?: string;
  total?: number;
  address?: string;
};

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [PedidoModalComponent, CommonModule, FormsModule, RatingStarsComponent, CurrencyPipe, HttpClientModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [ProductService, OrdersService]
})
export class ProductDetailComponent implements OnInit {
  @Input() product = signal<Product | undefined>(undefined);
  selectedVariantIndex = signal(0);
  selectedSizeIndex = signal(0);
  quantity = signal(1);
  loading = signal(true);
  error = signal<string | null>(null);
  selectedImage = signal<string | null>(null);
  variants = computed(() => this.product()?.variants || []);
  mostrarPedido = signal(false);

  private readonly baseUrl = 'https://pasteleria-tony.vercel.app'; // <-- cámbialo a tu dominio real (HTTPS)
 
//  constructor(private share: ShareService) {}

  constructor(
    private router: Router,
private share: ShareService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private orders: OrdersService,
    private meta: Meta,
    private title: Title, private toastService: ToastService,    private seo: SeoService

  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      } else {
        this.error.set('No se proporcionó ID de producto');
        this.loading.set(false);
      }
    });
    window.addEventListener('keydown', this.onKeydown);
  }


  loadProduct(id: string): void {
    this.error.set(null);
    this.loading.set(true);

    this.productService.getProductById(id).pipe(
      tap(product => {
        this.product.set(product);
        if (product?.variants && product.variants.length > 0) {
          this.selectedVariantIndex.set(0);
          this.selectedSizeIndex.set(0);
          this.selectedImage.set(product.variants[0].images?.[0] || null);
        }
        this.loading.set(false);
        this.updateMetaTags(); // <-- aplica meta al cargar

      }),
      catchError(err => {
        this.error.set('Error al cargar el producto');
        this.loading.set(false);
        console.error('Error loading product:', err);
        return of(undefined);
      })
    ).subscribe(); // Just subscribe directly instead of using toSignal
  }

  hasMultipleSizes(): boolean {
    const variant = this.getSelectedVariant();
    return variant?.sizeStock ? variant.sizeStock.length > 1 : false;
  }

  selectVariant(index: number): void {
    this.selectedVariantIndex.set(index);
    this.selectedSizeIndex.set(0);
    this.quantity.set(1);

    const variant = this.getSelectedVariant();
    this.selectedImage.set(variant?.images?.[0] || null);
  }

  selectSize(index: number): void {
    this.selectedSizeIndex.set(index);
    this.quantity.set(1);
  }

  incrementQuantity(): void {
    const maxStock = this.getSelectedSize()?.stock || 0;
    if (this.quantity() < maxStock) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  getSelectedVariant(): Variant | undefined {
    return this.product()?.variants?.[this.selectedVariantIndex()];
  }

  getSelectedSize(): SizeStock | undefined {
    const variant = this.getSelectedVariant();
    return variant?.sizeStock?.[this.selectedSizeIndex()];
  }

  onSelectImage(image: string) {
    this.selectedImage.set(image);
  }
  // Reemplaza hasMultipleSizes() con esta nueva función
  showSizesSection(): boolean {
    const variant = this.getSelectedVariant();
    return !!(variant?.sizeStock && variant.sizeStock.length > 0);
  }
  async shareWithImage(): Promise<void> {
  const product = this.product();
  if (!product) return;
  const variant = this.getSelectedVariant();
  const size = this.getSelectedSize();
  const imageUrl = this.selectedImage?.() || variant?.images?.[0] || (product as any)?.images?.[0];

  await this.share.shareProductWithImage({
    product,
    variant,
    size,
    selectedImage: imageUrl,
    url: window.location.href,
    baseUrl: 'https://pasteleria-tony.vercel.app'
  });
}

shareOnWhatsApp(): void {
  const product = this.product();
  if (!product) return;
  const variant = this.getSelectedVariant();
  const size = this.getSelectedSize();
  this.share.shareOnWhatsApp({ product, variant, size, url: window.location.href });
}

  // async shareWithImage(): Promise<void> {
  //   const product = this.product();
  //   if (!product) return;

  //   const variant = this.getSelectedVariant();
  //   const size = this.getSelectedSize();

  //   const imageUrl =
  //     this.selectedImage?.() ||
  //     variant?.images?.[0] ||
  //     (product as any)?.images?.[0] ||
  //     '';

  //   // Texto base (sin URL de imagen porque ya irá como archivo)
  //   const parts: string[] = [];
  //   parts.push(`*${product.name || ''}*`);
  //   if (variant?.flavor) parts.push(`Sabor: ${variant.flavor}`);
  //   if (size) {
  //     if (size.size) parts.push(`Tamaño: ${size.size} kg`);
  //     if (size.price != null) {
  //       const precioFormateado = size.price.toLocaleString('es-MX', {
  //         style: 'currency',
  //         currency: 'MXN',
  //       });
  //       parts.push(`Precio: ${precioFormateado}`);
  //     }
  //   }
  //   parts.push('');
  //   parts.push(window.location.href);
  //   const text = parts.join('\n');

  //   try {
  //     if (imageUrl && 'share' in navigator) {
  //       const resp = await fetch(imageUrl, { mode: 'cors' });
  //       const blob = await resp.blob();
  //       const fileName =
  //         (imageUrl.split('/').pop() || 'producto') + (blob.type.includes('jpeg') ? '.jpg' : '');
  //       const file = new File([blob], fileName || 'producto.jpg', { type: blob.type || 'image/jpeg' });

  //       // Soporte de share con archivos
  //       // (Chrome Android, Safari iOS 15.4+; requiere HTTPS)
  //       if ((navigator as any).canShare?.({ files: [file] })) {
  //         await (navigator as any).share({
  //           files: [file],
  //           title: product.name || 'Producto',
  //           text,
  //           url: window.location.href, // opcional
  //         });
  //         return;
  //       }
  //     }
  //   } catch (e) {
  //     // si algo falla, seguimos al fallback
  //     console.warn('Web Share API con archivos no disponible o falló, usando fallback a WhatsApp', e);
  //   }

  //   // Fallback a WhatsApp clásico
  //   this.shareOnWhatsApp();
  // }

  // shareOnWhatsApp(): void {
  //   const product = this.product();
  //   if (!product) return;

  //   const variant = this.getSelectedVariant();
  //   const size = this.getSelectedSize();

  //   // Construye el mensaje
  //   let message = `¡Producto!%0A%0A`;
  //   message += `*${product.name || ''}*%0A`;

  //   if (variant?.flavor) {
  //     message += `Sabor: ${variant.flavor}%0A`;
  //   }

  //   if (size) {
  //     if (size.size) {
  //       message += `Tamaño: ${size.size} kg%0A`;
  //     }
  //     if (size.price != null) {
  //       // Formatear precio como moneda
  //       const precioFormateado = size.price.toLocaleString('es-MX', {
  //         style: 'currency',
  //         currency: 'MXN'
  //       });
  //       message += `Precio: ${precioFormateado}%0A`;
  //     }
  //   }

  //   message += `%0A${window.location.href}`;

  //   // Abre WhatsApp con el mensaje
  //   window.open(`https://wa.me/?text=${message}`, '_blank');
  // }

  // -----------------------
  // SEO / Open Graph
  // -----------------------
  private absUrl(pathOrUrl: string | null | undefined): string {
    if (!pathOrUrl) return `${this.baseUrl}/assets/og-default.jpg`;
    return pathOrUrl.startsWith('http') ? pathOrUrl : `${this.baseUrl}${pathOrUrl}`;
  }

  private updateMetaTags(): void {
    const p = this.product();
    const v = this.getSelectedVariant();
    const s = this.getSelectedSize();
    if (!p || !v) return;

    const url = `${this.baseUrl}${this.router.url}`;
    const img = this.selectedImage() || v.images?.[0] || `${this.baseUrl}/assets/og-default.jpg`;
    const imageUrl = this.absUrl(img);
    const price = s?.price;

    const title = `${p.name} – ${v.flavor || 'Clásico'}${s?.size ? ` (${s.size} kg)` : ''}`.trim();
    const description = (v.description && v.description.length > 0)
      ? v.description.slice(0, 155)
      : 'Pasteles frescos y personalizados. Haz tu pedido en línea y recógelo o recibe a domicilio.';

    this.seo.setProductTags({
      siteName: 'Pastelería Tony',
      url,
      title,
      description,
      imageUrl,
      imageAlt: `${p.name} ${v.flavor || ''}`.trim(),
      priceMXN: price
    });

    // (Opcional) JSON-LD si quieres:
    // this.insertProductJsonLd(p, v, s, imageUrl, url);
  }


  private absoluteUrl(pathOrUrl: string | null | undefined): string {
    if (!pathOrUrl) return '';
    try {
      // si ya es absoluta, retorna igual
      return new URL(pathOrUrl).toString();
    } catch {
      // si es relativa, la convierto
      return new URL(pathOrUrl, window.location.origin).toString();
    }
  }

  abrirPedido() {
    // this.modoPedido.set(modo);
    this.mostrarPedido.set(true);
  }



  cerrarPedido() {
    this.mostrarPedido.set(false);
  }
  // Helpers para IDs seguros
  private getSelectedVariantId(): string | undefined {
    const v = this.getSelectedVariant() as any;
    return v?._id ?? v?.id;
  }

  private getProductId(): string | undefined {
    const p = this.product() as any;
    return p?._id ?? p?.id;
  }


  // Handler del envío desde el modal (recibe 'customer' desde el hijo)
  onEnviarPedido = (customer: any) => {
    const p = this.product();
    const v = this.getSelectedVariant();
    const s = this.getSelectedSize();
    if (!p || !v || !s) return;

    // Datos seleccionados en la vista
    const selected = {
      productId: this.getProductId() || '',
      variant: {
        flavor: v?.flavor,
        color: (v as any)?.color,
        texture: (v as any)?.texture,
        shape: (v as any)?.shape,
      },
      size: Number(s.size ?? 0),
      quantity: Number(this.quantity()),
      unitPrice: Number(s.price ?? 0),
      images: [this.selectedImage() || v?.images?.[0]].filter(Boolean) as string[],
    };

    // Construye el formValue compatible con el helper:
    const formValueLike = {
      nombre: customer.nombre,
      telefono: customer.telefono,
      email: customer.email,
      metodoEntrega: customer.metodoEntrega,     // 'RECOGER' | 'DOMICILIO'
      direccion: customer.direccion,             // solo si DOMICILIO
      fecha: customer.fecha,                     // "YYYY-MM-DD"
      hora: customer.hora,                       // "HH:mm"
      dedicatoria: customer.dedicatoria || '',
      decoracion: '',                            // si quieres concatenarlo a nota, ya lo hiciste en el hijo
      nota: customer.nota || '',
      modo: this.modoActual()                    // 'PEDIR' o 'APARTAR' según tu UI
    };

    const payload: CreateOrderRequest = OrdersService.buildPayloadFromForm(formValueLike, selected);

    // Si tienes userId (logueado), colócalo. Si no, omite para invitado.
    // Ejemplo: podrías leerlo de un AuthService o de localStorage
    const userId = this.getUserIdOrNull(); // implementa este método si ya tienes auth

    this.loading.set(true);
    this.orders.createOrder(payload, userId || undefined).subscribe({
      next: (resp) => {
        this.loading.set(false);
        if (resp.ok) {
          // Éxito: mostrar ticket/alerta y cerrar modal
          console.log('Order creada:', resp.data);
          this.toastService.showSuccess('Pedido creada');
          this.cerrarPedido();
          const mini = this.toOrderMini(resp.data);
          this.orderMini.set(mini);
          this.showOrderPanel.set(true);
          // TODO: toast/redirect: this.router.navigate(['/orders', resp.data._id])
        } else {
          // Error validación del backend
          this.error.set(resp.msg || 'No se pudo crear el pedido');
          console.error(resp);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Error de red al crear el pedido');
        console.error(err);
      }
    });
  }
  // Devuelve el modo actual; en tu template ya pasas 'PEDIR', pero lo dejo flexible:
  private modoActual(): 'PEDIR' | 'APARTAR' {
    return 'PEDIR'; // o lee un signal si tienes modo dinámico
  }

  // Ejemplo de cómo obtener userId si estás simulando login
  private getUserIdOrNull(): string | null {
    // Si usas un AuthService real, reemplaza esto.
    const simulated = localStorage.getItem('x-user-id'); // o lo que uses
    return simulated || null;
  }



  // === Signals del panel
  showOrderPanel = signal(false);
  orderMini = signal<OrderMini | null>(null);

  // === Labels amigables de fecha/hora
  private toDateLabels(iso?: string) {
    if (!iso) return { dateLabel: '', timeLabel: '' };
    const d = new Date(iso);
    const dateLabel = d.toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'short' });
    const timeLabel = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    return { dateLabel, timeLabel };
  }

  // === Adaptador de la respuesta -> panel
  private toOrderMini(respData: any): OrderMini {
    const metodoEntrega: 'RECOGER' | 'DOMICILIO' = respData?.delivery?.metodoEntrega || 'RECOGER';
    const dateISO = respData?.delivery?.schedule?.fecha;
    const { dateLabel, timeLabel } = this.toDateLabels(dateISO);
    return {
      code: respData?.orderCode || respData?._id || 'ORD',
      metodoEntrega,
      dateISO,
      dateLabel,
      timeLabel,
      total: respData?.payment?.total,
      address: metodoEntrega === 'DOMICILIO' ? respData?.delivery?.address : respData?.store?.address
    };
  }

  // === Acciones del panel
  closeOrderPanel() {
    this.showOrderPanel.set(false);
    this.orderMini.set(null);
  }

  addToCalendarMini() {
    const vm = this.orderMini();
    if (!vm?.dateISO) return;

    const dt = new Date(vm.dateISO);
    const pad = (n: number) => String(n).padStart(2, '0');
    const toUTC = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
    const dtStart = toUTC(dt);
    const dtEnd = toUTC(new Date(dt.getTime() + 60 * 60 * 1000));

    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//TuTienda//Orden//ES',
      'BEGIN:VEVENT',
      `UID:${vm.code}@tutienda`,
      `DTSTAMP:${toUTC(new Date())}`,
      `DTSTART:${dtStart}`, `DTEND:${dtEnd}`,
      `SUMMARY:Pedido ${vm.metodoEntrega === 'RECOGER' ? '(Recoger)' : '(Domicilio)'} - ${vm.code}`,
      vm.address ? `LOCATION:${vm.address.replace(/\n/g, ' ')}` : '',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${vm.code}.ics`; a.click();
    URL.revokeObjectURL(url);
  }

  openWhatsAppMini() {
    const vm = this.orderMini();
    const msg = encodeURIComponent(`Hola, sobre mi pedido ${vm?.code} (${vm?.metodoEntrega}) para ${vm?.dateLabel} ${vm?.timeLabel}.`);
    window.open(`https://wa.me/5217710000000?text=${msg}`, '_blank'); // cambia al número de tu negocio
  }

  copyOrderCodeMini() {
    const vm = this.orderMini();
    if (vm?.code) navigator.clipboard.writeText(vm.code);
  }

  // === Cerrar con ESC (opcional)
  onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.showOrderPanel()) this.closeOrderPanel();
  };


  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeydown);
  }

}
