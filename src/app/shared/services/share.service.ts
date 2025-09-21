import { Injectable } from '@angular/core';
import type { Product } from '../models/product.model';
import type { Variant } from '../models/variant.model';
import type { SizeStock } from '../models/size-stock.model';

@Injectable({ providedIn: 'root' })
export class ShareService {
  private readonly FALLBACK_IMG = '/assets/og-default.jpg';

  private absUrl(baseUrl: string | undefined, pathOrUrl?: string | null): string {
    if (!pathOrUrl) return (baseUrl ?? window.location.origin) + this.FALLBACK_IMG;
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    return (baseUrl ?? window.location.origin) + pathOrUrl;
  }

  private mxn(v?: number) {
    return (v ?? 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  }

  buildMessage(product: Product, variant?: Variant, size?: SizeStock, url?: string) {
    const lines: string[] = [];
    lines.push(`*${product?.name ?? 'Producto'}*`);
    if (variant?.flavor) lines.push(`Sabor: ${variant.flavor}`);
    if (size) {
      if (size.size != null) lines.push(`Tamaño: ${size.size} kg`);
      if (size.price != null) lines.push(`Precio: ${this.mxn(size.price)}`);
    }
    if (url) { lines.push(''); lines.push(url); }
    return lines.join('\n');
  }

  async shareProductWithImage(opts: {
    product: Product;
    variant?: Variant;
    size?: SizeStock;
    selectedImage?: string | null;
    url?: string;
    baseUrl?: string; // si tienes dominio público tipo https://pasteleria-tony.vercel.app
  }): Promise<void> {
    const { product, variant, size, selectedImage, url, baseUrl } = opts;

    const imageUrl = this.absUrl(
      baseUrl,
      selectedImage ||
      variant?.images?.[0] ||
      (product as any)?.images?.[0] ||
      this.FALLBACK_IMG
    );

    const text = this.buildMessage(product, variant, size, url);

    try {
      if ('share' in navigator && imageUrl) {
        const resp = await fetch(imageUrl, { mode: 'cors' });
        const blob = await resp.blob();
        const ext = blob.type?.includes('png') ? '.png' : '.jpg';
        const fileName = (imageUrl.split('/').pop() || 'producto') + ext;
        const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });

        if ((navigator as any).canShare?.({ files: [file] })) {
          await (navigator as any).share({
            files: [file],
            title: product?.name ?? 'Producto',
            text,
            url
          });
          return;
        }
      }
    } catch (e) {
      // caemos al fallback
      console.warn('Web Share API c/archivo falló o no disponible. Fallback a WhatsApp.', e);
    }

    this.shareOnWhatsApp({ product, variant, size, url });
  }

  shareOnWhatsApp(opts: { product: Product; variant?: Variant; size?: SizeStock; url?: string }) {
    const text = this.buildMessage(opts.product, opts.variant, opts.size, opts.url);
    const enc = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${enc}`, '_blank');
  }
}
