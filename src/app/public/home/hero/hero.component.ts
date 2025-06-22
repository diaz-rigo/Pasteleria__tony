import { Component, signal } from '@angular/core';
import { ConfigService, SystemConfig } from '../../../shared/services/config.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, HttpClientModule,RouterModule], templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  providers: [ConfigService]

})
export class HeroComponent {

  config = signal<SystemConfig | null>(null);

  constructor(private configService: ConfigService) { }

  ngOnInit(): void {
    this.configService.getConfig().subscribe({
      next: (res) => this.config.set(res),
      error: () => console.warn('Error cargando configuración del sistema')
    });
  }
get baseColor(): string {
  return this.config()?.headerBackgroundColor || '#fbeded';
}
//  isActive(path: string): boolean {
//     return window.location.pathname === path;
//   }

getDynamicGradient(): string {
  const from = this.config()?.headerBackgroundColor || '#fbeded';
  const to = this.generateStrongGradientColor(from);
  return `linear-gradient(to bottom right, ${from}, ${to})`;
}

generateStrongGradientColor(hex: string): string {
  // Expandir #abc a #aabbcc
  if (/^#([0-9a-f]{3})$/i.test(hex)) {
    hex = '#' + [...hex.slice(1)].map(c => c + c).join('');
  }

  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // Aumentar luminosidad mucho más para un gradiente fuerte
  l = Math.min(1, l + 0.25);  // +25% luminosidad
  s = Math.min(1, s + 0.15);  // +15% saturación

  // Convertir HSL → RGB
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    return [
      Math.round(hue2rgb(p, q, h + 1/3) * 255),
      Math.round(hue2rgb(p, q, h) * 255),
      Math.round(hue2rgb(p, q, h - 1/3) * 255)
    ];
  };

  const [r2, g2, b2] = hslToRgb(h, s, l);
  const toHex = (v: number) => v.toString(16).padStart(2, '0');

  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
}








  getTextColor(bgColor: string): string {
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(bgColor)) return '#000000';

    if (bgColor.length === 4) {
      bgColor = '#' + [...bgColor.slice(1)].map(c => c + c).join('');
    }

    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);

    // Luminancia relativa
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance > 186 ? '#000000' : '#ffffff';
  }
  getButtonColor(baseColor: string): string {
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(baseColor)) return '#be2541';

    // Expandir #abc → #aabbcc
    if (baseColor.length === 4) {
      baseColor = '#' + [...baseColor.slice(1)].map(c => c + c).join('');
    }

    // 👉 Detectar específicamente el color #fbeded (sin distinguir mayúsculas/minúsculas)
    if (baseColor.toLowerCase() === '#fbeded') {
      return '#be2541'; // color personalizado para fondo rosado pastel
    }

    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    // Muy claro
    if (luminance > 240) {
      return '#1f2937';
    }

    // Claro
    if (luminance > 200) {
      return '#be2541';
    }

    // Medio
    if (luminance > 120) {
      const darken = (v: number) => Math.max(0, Math.floor(v * 0.75));
      const toHex = (v: number) => v.toString(16).padStart(2, '0');
      return `#${toHex(darken(r))}${toHex(darken(g))}${toHex(darken(b))}`;
    }

    // Oscuro
    const lighten = (v: number) => Math.min(255, Math.floor(v + (255 - v) * 0.3));
    const toHex = (v: number) => v.toString(16).padStart(2, '0');
    return `#${toHex(lighten(r))}${toHex(lighten(g))}${toHex(lighten(b))}`;
  }

getTextColorwelcom(baseColor: string): string {
  if (!/^#([0-9A-F]{3}){1,2}$/i.test(baseColor)) return '#be2541';

  // Expandir #abc → #aabbcc
  if (baseColor.length === 4) {
    baseColor = '#' + [...baseColor.slice(1)].map(c => c + c).join('');
  }

  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  // Si es específicamente #fbeded, usar rojo pastel elegante
  if (baseColor.toLowerCase() === '#fbeded') {
    return '#be2541';
  }

  // Si es blanco o casi blanco
  if (luminance > 240) {
    return '#111827'; // gris oscuro elegante (tailwind gray-900)
  }

  // Si es claro
  if (luminance > 200) {
    // Calculamos un color complementario fuerte
    const compR = 255 - r;
    const compG = 255 - g;
    const compB = 255 - b;
    return `rgb(${compR}, ${compG}, ${compB})`;
  }

  // Si es medio tono
  if (luminance > 120) {
    return '#ffffff';
  }

  // Si es muy oscuro
  return '#ffd95a'; // dorado pastel
}



}
