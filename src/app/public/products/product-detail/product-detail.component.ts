import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../../shared/models/product.model';
import { Variant } from '../../../shared/models/variant.model';
import { SizeStock } from '../../../shared/models/size-stock.model';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { OrderCreatePayload, OrderItem } from '../../../shared/models/order.model';
import { OrdersService } from '../../../shared/services/orders.service';
import { PedidoModalComponent } from './pedido-modal/pedido-modal.component';

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


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private orders: OrdersService,
    private meta: Meta,
    private title: Title
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
        this.updateMetaTags(product);

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
  shareOnWhatsApp(): void {
    const product = this.product();
    if (!product) return;

    const variant = this.getSelectedVariant();
    const size = this.getSelectedSize();

    // 1) Toma la imagen seleccionada o la primera del variant o (si aplica) del producto
    const imageUrl =
      this.selectedImage?.() ||
      variant?.images?.[0] ||
      (product as any)?.images?.[0] || // por si tu objeto product también trae images[]
      '';

    // Construye el mensaje (ponemos primero la imagen para forzar preview)
    const lines: string[] = [];
    if (imageUrl) lines.push(imageUrl); // 👈 esto ayuda a que WhatsApp muestre esa imagen en el preview

    lines.push(`*${product.name || ''}*`);

    if (variant?.flavor) {
      lines.push(`Sabor: ${variant.flavor}`);
    }

    if (size) {
      if (size.size) lines.push(`Tamaño: ${size.size} kg`);
      if (size.price != null) {
        const precioFormateado = size.price.toLocaleString('es-MX', {
          style: 'currency',
          currency: 'MXN',
        });
        lines.push(`Precio: ${precioFormateado}`);
      }
    }

    lines.push(''); // salto de línea
    lines.push(window.location.href);

    const message = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/?text=${message}`, '_blank');
  }

  async shareWithImage(): Promise<void> {
    const product = this.product();
    if (!product) return;

    const variant = this.getSelectedVariant();
    const size = this.getSelectedSize();

    const imageUrl =
      this.selectedImage?.() ||
      variant?.images?.[0] ||
      (product as any)?.images?.[0] ||
      '';

    // Texto/caption: incluye la URL AQUÍ, no en la propiedad `url` de share()
    const lines: string[] = [];
    lines.push(`*${product.name || ''}*`);
    if (variant?.flavor) lines.push(`Sabor: ${variant.flavor}`);
    if (size) {
      if (size.size) lines.push(`Tamaño: ${size.size} kg`);
      if (size.price != null) {
        const precioFormateado = size.price.toLocaleString('es-MX', {
          style: 'currency',
          currency: 'MXN',
        });
        lines.push(`Precio: ${precioFormateado}`);
      }
    }
    lines.push('');
    lines.push(window.location.href);
    const caption = lines.join('\n');

    try {
      if (imageUrl && 'share' in navigator) {
        const resp = await fetch(imageUrl, { mode: 'cors' });
        const blob = await resp.blob();

        // Asegura una extensión razonable
        const ext = blob.type?.includes('png')
          ? '.png'
          : blob.type?.includes('webp')
            ? '.webp'
            : '.jpg';
        const base = (imageUrl.split('/').pop() || 'producto').replace(/\?.*$/, '');
        const file = new File([blob], (base || 'producto') + ext, {
          type: blob.type || 'image/jpeg',
        });

        // 1) Intento con files + text (sin usar `url`)
        const canShareWithText =
          (navigator as any).canShare?.({ files: [file], text: caption }) ?? false;

        if (canShareWithText) {
          await (navigator as any).share({
            files: [file],
            text: caption,   // 👈 aquí va todo el texto + link
            // NO pongas `url`: algunos targets lo usan y omiten el caption
          });
          return;
        }

        // 2) Si no acepta `text` con files, prueba solo files (algunos iOS/Safari)
        const canShareFilesOnly = (navigator as any).canShare?.({ files: [file] }) ?? false;
        if (canShareFilesOnly) {
          await (navigator as any).share({ files: [file], text: caption });
          // Si el target ignora `text`, hacemos fallback al wa.me para mandar el caption
          // (no podemos adjuntar y además forzar caption en todos los targets)
          this.shareOnWhatsApp(); // manda el caption + preview por URL
          return;
        }
      }
    } catch (e) {
      console.warn('Fallo Web Share con archivos; usando fallback a WhatsApp', e);
    }

    // 3) Fallback a WhatsApp clásico (con URL de imagen al inicio para preview)
    this.shareOnWhatsApp();
  }

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

  updateMetaTags(product: Product): void {
    const variant = this.getSelectedVariant();
    const imageRaw = variant?.images?.[0];
    const imageUrl = this.absoluteUrl(imageRaw);

    this.title.setTitle(`${product.name || ''} | Tu Tienda`);

    this.meta.updateTag({ property: 'og:title', content: product.name || '' });
    this.meta.updateTag({ property: 'og:description', content: variant?.description || product.ingredientes || 'Producto de alta calidad' });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:url', content: window.location.href });
    this.meta.updateTag({ property: 'og:type', content: 'product' });
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


  // Handler del envío desde el modal
  onEnviarPedido = (customer: any) => {
    const p = this.product();
    const v = this.getSelectedVariant();
    const s = this.getSelectedSize();
    if (!p || !s) return;

    const unitPrice = Number(s.price ?? 0);
    const qty = this.quantity();
    const subtotal = unitPrice * qty;

    const item: OrderItem = {
      productId: this.getProductId() || '',
      productName: p.name || '',
      variantId: this.getSelectedVariantId(),
      variantFlavor: v?.flavor,
      size: s.size,
      unitPrice,
      quantity: qty,
      subtotal,
      image: this.selectedImage() || v?.images?.[0],
      color: (v as any)?.color,
    };

    const payload: OrderCreatePayload = {
      items: [item],
      customer,
      modo: 'PEDIR',
      currency: 'MXN',
      source: 'WEB',
    };

    this.loading.set(true);
    this.orders.createOrder(payload).subscribe({
      next: (resp) => {
        this.loading.set(false);
        this.mostrarPedido.set(false);
        // feedback simple
        alert(`¡Pedido recibido!\nFolio: ${resp.folio}\nTotal: ${resp.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`);
        // opcional: redirigir a un "gracias" o detalle de pedido
        // this.router.navigate(['/pedido', resp.id]);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        alert('Ocurrió un error al crear el pedido. Intenta nuevamente.');
      }
    })
  }

}