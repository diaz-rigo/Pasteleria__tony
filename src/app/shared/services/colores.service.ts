import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColoresService {
// Función para aclarar el color
lightenColor(color: string, percent: number): string {
  if (!color) return '#ffffff';
  
  // Si es un color hexadecimal
  if (color.startsWith('#')) {
    return this.lightenHexColor(color, percent);
  }
  
  // Si es un color RGB/RGBA
  if (color.startsWith('rgb')) {
    return this.lightenRgbColor(color, percent);
  }
  
  return color;
}

// Función para oscurecer el color
darkenColor(color: string, percent: number): string {
  if (!color) return '#e5e7eb';
  
  // Si es un color hexadecimal
  if (color.startsWith('#')) {
    return this.darkenHexColor(color, percent);
  }
  
  // Si es un color RGB/RGBA
  if (color.startsWith('rgb')) {
    return this.darkenRgbColor(color, percent);
  }
  
  return color;
}

// Función para determinar el color de contraste
getContrastColor(hexColor: string): string {
  if (!hexColor) return '#000000';
  
  // Si el color es transparente o muy claro, devolver negro
  if (hexColor === 'transparent' || hexColor === '#ffffff' || hexColor === '#fff') {
    return '#000000';
  }
  
  // Convertir hex a RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calcular luminosidad (fórmula WCAG)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Si la luminosidad es mayor que 0.5, usar texto negro, sino blanco
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

// ----- Funciones auxiliares -----

private lightenHexColor(hex: string, percent: number): string {
  // Eliminar el # si está presente
  hex = hex.replace(/^#/, '');
  
  // Convertir a RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Aclarar cada componente
  const newR = Math.min(255, r + (255 - r) * (percent / 100));
  const newG = Math.min(255, g + (255 - g) * (percent / 100));
  const newB = Math.min(255, b + (255 - b) * (percent / 100));
  
  // Convertir de nuevo a HEX
  return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
}

private darkenHexColor(hex: string, percent: number): string {
  // Eliminar el # si está presente
  hex = hex.replace(/^#/, '');
  
  // Convertir a RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Oscurecer cada componente
  const newR = Math.max(0, r * (1 - percent / 100));
  const newG = Math.max(0, g * (1 - percent / 100));
  const newB = Math.max(0, b * (1 - percent / 100));
  
  // Convertir de nuevo a HEX
  return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
}

private lightenRgbColor(rgb: string, percent: number): string {
  // Extraer los valores RGB
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/i);
  if (!match) return rgb;
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  const a = match[4] ? parseFloat(match[4]) : 1;
  
  // Aclarar cada componente
  const newR = Math.min(255, r + (255 - r) * (percent / 100));
  const newG = Math.min(255, g + (255 - g) * (percent / 100));
  const newB = Math.min(255, b + (255 - b) * (percent / 100));
  
  return a === 1 
    ? `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`
    : `rgba(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)}, ${a})`;
}

private darkenRgbColor(rgb: string, percent: number): string {
  // Extraer los valores RGB
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/i);
  if (!match) return rgb;
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  const a = match[4] ? parseFloat(match[4]) : 1;
  
  // Oscurecer cada componente
  const newR = Math.max(0, r * (1 - percent / 100));
  const newG = Math.max(0, g * (1 - percent / 100));
  const newB = Math.max(0, b * (1 - percent / 100));
  
  return a === 1
    ? `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`
    : `rgba(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)}, ${a})`;
}
}
