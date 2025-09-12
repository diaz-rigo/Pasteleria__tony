// import { Injectable, Inject } from '@angular/core';
// import { Meta, Title, DOCUMENT } from '@angular/platform-browser';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private doc: Document
  ,    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  setCanonical(url: string) {
    if (!this.isBrowser) return; // evita tocar DOM en SSR
    const head = this.doc.head || this.doc.getElementsByTagName('head')[0];
    if (!head) return;

    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', url);
  }


  setProductTags(opts: {
    siteName: string;
    url: string;               // ABSOLUTA
    title: string;
    description: string;
    imageUrl: string;          // ABSOLUTA 1200x630
    imageAlt?: string;
    priceMXN?: number;
  }) {
    const { siteName, url, title, description, imageUrl, imageAlt = title, priceMXN } = opts;

    this.title.setTitle(title);

    // Open Graph
    this.meta.updateTag({ property: 'og:type', content: 'product' });
    this.meta.updateTag({ property: 'og:site_name', content: siteName });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:image:alt', content: imageAlt });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });

    // Product (opcional)
    if (priceMXN != null) {
      this.meta.updateTag({ property: 'product:price:amount', content: String(priceMXN) });
      this.meta.updateTag({ property: 'product:price:currency', content: 'MXN' });
    }

    this.setCanonical(url);
  }
}
