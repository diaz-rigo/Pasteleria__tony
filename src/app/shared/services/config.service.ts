import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';



export interface SystemConfig {
  _id?: string;
  // Estilos generales
  headerBackgroundColor?: string;
  footerBackgroundColor?: string;
  primaryColor?: string;

  // Medios
  logoUrl?: string;
  faviconUrl?: string;
  showheaderImage?: boolean;

  // Footer
  footerText?: string;
  footerLinks?: { text: string; url: string }[];

  // Hero section
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  heroButtonText?: string;
  heroButtonUrl?: string;

  // Opciones de visibilidad
  showHeroTitle?: boolean;
  showHeroSubtitle?: boolean;
  showHeroImage?: boolean;
  showHeroButton?: boolean;

  createdAt?: Date;

  // Sección de Contacto
  contactInfo?: {
    businessName?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    phones?: {
      type?: 'mobile' | 'office' | 'whatsapp';
      number?: string;
      isPrimary?: boolean;
    }[];
    emails?: {
      address?: string;
      isPrimary?: boolean;
    }[];
    businessHours?: {
      days?: string;
      hours?: string;
      isOpen?: boolean;
    }[];
    socialMedia?: {
      platform?: 'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'youtube' | 'pinterest';
      url?: string;
      isActive?: boolean;
    }[];
    mapEmbedUrl?: string;
    contactFormEnabled?: boolean;
  };

  // SEO y Metadata
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private apiUrl = `${environment.api}/config`;


  constructor(private http: HttpClient) {}

  getConfig(): Observable<SystemConfig> {
    return this.http.get<SystemConfig>(this.apiUrl);
  }

  createConfig(config: SystemConfig): Observable<SystemConfig> {
    return this.http.post<SystemConfig>(this.apiUrl, config);
  }

  updateConfig(id: string, config: SystemConfig): Observable<SystemConfig> {
    return this.http.put<SystemConfig>(`${this.apiUrl}/${id}`, config);
  }

}
