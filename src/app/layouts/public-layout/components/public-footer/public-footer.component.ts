
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfigService, SystemConfig } from '../../../../shared/services/config.service';
type PhoneLoose = {
  type?: 'mobile' | 'office' | 'whatsapp' | string;
  number?: string;
  isPrimary?: boolean | null;
};

type PhoneStrict = {
  type: string;
  number: string;
  isPrimary: boolean;
};

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
   templateUrl: './public-footer.component.html',
  providers:[ConfigService]
,
  styles: []
})
export class PublicFooterComponent {


  
    config = signal<SystemConfig | null>(null);
  
    constructor(private configService: ConfigService) {}
  
    ngOnInit(): void {
      this.configService.getConfig().subscribe({
        next: (res) => this.config.set(res),
        error: () => console.warn('Error cargando configuración del sistema')
      });
    }

    // helpers para el template
formatAddress(a: any): string {
  if (!a) return '';
  const parts = [a.street, a.city, a.state, a.zipCode, a.country].filter(Boolean);
  return parts.join(', ');
}

sortPhones(phones: PhoneLoose[] | null | undefined): PhoneStrict[] {
  const list: PhoneStrict[] = (phones ?? [])
    .filter((p): p is PhoneLoose => !!p)
    .map((p) => ({
      type: (p.type ?? 'mobile').toString(),
      number: (p.number ?? '').toString(),
      isPrimary: !!p.isPrimary,
    }))
    // descarta entradas sin número
    .filter((p) => p.number.trim().length > 0);

  // WhatsApp primario (score 3) > WhatsApp no primario (2) > cualquier primario (1) > resto (0)
  const score = (p: PhoneStrict) => (p.type === 'whatsapp' ? 2 : 0) + (p.isPrimary ? 1 : 0);
  return list.sort((a, b) => score(b) - score(a));
}


sanitizePhone(n: string): string {
  return (n || '').replace(/\D/g, '');
}

prettyPhone(n: string): string {
  const s = this.sanitizePhone(n);
  // Formato MX simple: 3-3-4 o 2-4-4 si aplica
  if (s.length === 10) return `${s.slice(0,3)} ${s.slice(3,6)} ${s.slice(6)}`;
  if (s.length === 12 && s.startsWith('52')) return `${s.slice(2,5)} ${s.slice(5,8)} ${s.slice(8)}`;
  return s;
}

capitalize(t: string): string {
  return (t || '').charAt(0).toUpperCase() + (t || '').slice(1);
}

isDarkFooter(hex?: string): boolean {
  // heurística simple para contraste
  if (!hex) return false;
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  const luminance = (0.299*r + 0.587*g + 0.114*b)/255;
  return luminance < 0.5;
}
cleanMeta(desc?: string): string {
  // quita guiones/puntos repetidos al final y trim
  return (desc ?? '').replace(/[-.]+$/g, '').trim();
}

cleanFooter(text?: string): string {
  // quita puntos repetidos al final y trim
  return (text ?? '').replace(/[.]+$/g, '').trim();
}

}