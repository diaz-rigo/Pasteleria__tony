import { Component, signal, effect } from '@angular/core';
import { ConfigService, SystemConfig } from '../../shared/services/config.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  providers: [ConfigService]
})
export class SettingsComponent {
  config = signal<SystemConfig>({
    headerBackgroundColor: '',
    footerBackgroundColor: '',
    primaryColor: '',
    logoUrl: '',
    faviconUrl: '',
    footerText: '',
    footerLinks: [],
    heroTitle: '',
    heroSubtitle: '',
    heroImageUrl: '',
    heroButtonText: '',
    heroButtonUrl: '',
    showHeroTitle: true,
    showHeroSubtitle: true,
    showHeroImage: true,
    showheaderImage: true,
    showHeroButton: true,
    contactInfo: {
      businessName: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      phones: [],
      emails: [],
      businessHours: [],
      socialMedia: [],
      mapEmbedUrl: '',
      contactFormEnabled: true
    },
    metaTitle: '',
    metaDescription: '',
    metaKeywords: []
  });

  restablecerPorDefecto(): void {
    this.editableConfig = {
      headerBackgroundColor: '#fbeded',
      footerBackgroundColor: '#212121',
      primaryColor: '#e4b500',
      logoUrl: 'https://res.cloudinary.com/dvvhnrvav/image/upload/v1749933866/pasteleria-tony/pngs/htl76bq1jvkr20sn1e9b.png',
      faviconUrl: 'https://res.cloudinary.com/dvvhnrvav/image/upload/v1749934243/pasteleria-tony/pngs/wmqfdo93tutrk6f5so6n.png',
      footerText: '© 2025 Pasteleria Tony',
      footerLinks: [],
      heroTitle: 'Pasteleria Tony',
      heroSubtitle: 'Elaboramos pasteles y postres con ingredientes de alta calidad y pasión por la tradición. Cada creación está pensada para deleitar los sentidos.',
      heroImageUrl: '',
      heroButtonText: 'Ver productos',
      heroButtonUrl: '/productos',
      showHeroTitle: true,
      showHeroSubtitle: true,
      showHeroImage: true,
      showheaderImage: true,
      showHeroButton: true,
      contactInfo: {
        businessName: 'Repostería Tony',
        address: {
          street: 'Calle Principal 123',
          city: 'Ciudad',
          state: 'Estado',
          zipCode: '00000',
          country: 'México'
        },
        phones: [{
          type: 'mobile',
          number: '',
          isPrimary: true
        }],
        emails: [{
          address: 'contacto@reposteria-tony.com',
          isPrimary: true
        }],
        businessHours: [{
          days: 'Lunes a Viernes',
          hours: '9:00 AM - 6:00 PM',
          isOpen: true
        }],
        socialMedia: [],
        mapEmbedUrl: '',
        contactFormEnabled: true
      },
      metaTitle: 'Repostería Tony - Los mejores postres artesanales',
      metaDescription: 'Descubre nuestros deliciosos postres artesanales hechos con ingredientes de la más alta calidad',
      metaKeywords: ['repostería', 'pasteles', 'postres', 'dulces', 'artesanal']
    };
  }

  editableConfig: SystemConfig = this.config();
  loading = signal<boolean>(false);
  message = signal<string>('');
  configId = '';

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.loadConfig();
  }

  loadConfig(): void {
    this.loading.set(true);
    this.configService.getConfig().subscribe({
      next: (res) => {
        this.config.set(res);
        // Asegurar que los nuevos campos tengan valores por defecto si no existen
        this.editableConfig = { 
          ...this.config(), // Valores por defecto
          ...res // Valores de la base de datos
        };
        this.configId = res._id!;
        this.loading.set(false);
      },
      error: () => {
        this.message.set('Error al cargar configuración.');
        this.loading.set(false);
      },
    });
  }

  guardar(): void {
    this.loading.set(true);
    this.configService.updateConfig(this.configId, this.editableConfig).subscribe({
      next: (res) => {
        this.config.set(res);
        this.message.set('Configuración guardada correctamente.');
        this.loading.set(false);
      },
      error: () => {
        this.message.set('Error al guardar configuración.');
        this.loading.set(false);
      },
    });
  }

  // Métodos para manejar arrays dinámicos
  agregarTelefono(): void {
    if (!this.editableConfig.contactInfo?.phones) {
      this.editableConfig.contactInfo!.phones = [];
    }
    this.editableConfig?.contactInfo?.phones.push({
      type: 'mobile',
      number: '',
      isPrimary: false
    });
  }

  eliminarTelefono(index: number): void {
    this.editableConfig.contactInfo?.phones?.splice(index, 1);
  }

  agregarEmail(): void {
    if (!this.editableConfig.contactInfo?.emails) {
      this.editableConfig.contactInfo!.emails = [];
    }
    this.editableConfig?.contactInfo?.emails.push({
      address: '',
      isPrimary: false
    });
  }

  eliminarEmail(index: number): void {
    this.editableConfig.contactInfo?.emails?.splice(index, 1);
  }

  agregarHorario(): void {
    if (!this.editableConfig.contactInfo?.businessHours) {
      this.editableConfig.contactInfo!.businessHours = [];
    }
    this.editableConfig?.contactInfo?.businessHours.push({
      days: '',
      hours: '',
      isOpen: true
    });
  }

  eliminarHorario(index: number): void {
    this.editableConfig.contactInfo?.businessHours?.splice(index, 1);
  }

  agregarRedSocial(): void {
    if (!this.editableConfig.contactInfo?.socialMedia) {
      this.editableConfig.contactInfo!.socialMedia = [];
    }
    this.editableConfig?.contactInfo?.socialMedia.push({
      platform: 'facebook',
      url: '',
      isActive: true
    });
  }

  eliminarRedSocial(index: number): void {
    this.editableConfig.contactInfo?.socialMedia?.splice(index, 1);
  }


  updateKeywords(event: any): void {
  const value = event.target.value;
  this.editableConfig.metaKeywords = value.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0);
}

trackByIndex(index: number): number {
  return index;
}
}