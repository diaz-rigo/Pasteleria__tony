// config.store.ts
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConfigService, SystemConfig } from '../services/config.service';

const defaultConfig: SystemConfig = {
  contactInfo: {
    address: {
      street: '   Av. Luis Amador Pahuatitla',
      city: 'Jaltocán',
      state: 'Hidalgo',
      zipCode: '43040',
      country: 'México'
    },
    businessName: 'Repostería Tony prueba',
    phones: [
      { type: 'mobile', number: '7711512740', isPrimary: true },
      { type: 'whatsapp', number: '7711836689', isPrimary: true }
    ],
    businessHours: [
      { days: 'Lunes a Viernes', hours: '08:00 AM - 6:00 PM', isOpen: false }
    ],
    socialMedia: [
      { platform: 'facebook', url: 'https://pasteleria-tony.vercel.app', isActive: true }
    ],
    mapEmbedUrl: '',
    contactFormEnabled: true
  },
  headerBackgroundColor: '#ffeafb',
  footerBackgroundColor: '#f6efef',
  primaryColor: '#e4b500',
  logoUrl: 'https://res.cloudinary.com/dvvhnrvav/image/upload/v1749933866/pasteleria-tony/pngs/htl76bq1jvkr20sn1e9b.png',
  faviconUrl: 'https://res.cloudinary.com/dvvhnrvav/image/upload/v1749934243/pasteleria-tony/pngs/wmqfdo93tutrk6f5so6n.png',
  footerText: '© 2025 Pasteleria Tony',
  footerLinks: [],
  heroButtonText: 'Ver productos',
  heroButtonUrl: '/productos',
  heroSubtitle: 'Elaboramos pasteles y postres con ingredientes de alta calidad y pasión por la tradición. Cada creación está pensada para deleitar los sentidos. .-',
  heroTitle: 'Pasteleria Tony ',
  showHeroButton: true,
  showHeroImage: true,
  showHeroSubtitle: true,
  showHeroTitle: true,
  heroImageUrl: '',
  showheaderImage: true,
  metaDescription: 'Descubre nuestros deliciosos postres artesanales hechos con ingredientes de la más alta calidad prueba ',
  metaKeywords: ['repostería','pasteles','postres','dulces','artesanal prueba'],
  metaTitle: 'Repostería Tony - Los mejores postres artesanales -'
};

@Injectable({ providedIn: 'root' })
export class ConfigStore {
  config = signal<SystemConfig | null>(null);
  private loaded = false;

  constructor(private api: ConfigService) {}

  async loadOnce(): Promise<void> {
    if (this.loaded) return;
    // 1) set default immediately so app can render
    this.config.set(defaultConfig);

    // 2) mark as loaded to avoid multiple parallel fetches
    this.loaded = true;

    // 3) fetch real config in background and replace if success
    firstValueFrom(this.api.getConfig())
      .then(cfg => {
        if (cfg) this.config.set(cfg);
      })
      .catch(err => {
        console.warn('No se pudo obtener la config remota, usando default.', err);
        // deja el default
      });
    // NOTA: no await; retornamos inmediatamente
  }

  // Si necesitas refrescar manualmente (por ejemplo: botón "recargar config")
  async refresh(): Promise<void> {
    const cfg = await firstValueFrom(this.api.getConfig());
    this.config.set(cfg);
  }
}
