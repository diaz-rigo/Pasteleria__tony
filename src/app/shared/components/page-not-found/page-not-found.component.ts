import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfigService, SystemConfig } from '../../services/config.service';
import { getDynamicGradient, getTextColor } from '../../helpers/color.helpers';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

interface Particle {
  size: string;
  top: string;
  left: string;
  color: string;
  animationDuration: string;
  animationDelay: string;
}

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
  providers: [ConfigService]
})
export class PageNotFoundComponent {
  busqueda = '';
  config = signal<SystemConfig | null>(null);
  
  particles: Particle[] = [];

  constructor(
    private router: Router,
    private configService: ConfigService
  ) {
    this.generateParticles();
  }

  ngOnInit(): void {
    this.configService.getConfig().subscribe({
      next: (res) => this.config.set(res),
      error: () => console.warn('Error cargando configuración del sistema')
    });
  }

  private generateParticles(): void {
    const particleColors = ['#d38890', '#eeceb2', '#be2541', '#fbeded', '#ffd6a5', '#c9e4de'];
    
    this.particles = Array.from({ length: 15 }, () => ({
      size: `${Math.random() * 3 + 1}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      animationDuration: `${10 + Math.random() * 20}s`,
      animationDelay: `${Math.random() * 5}s`
    }));
  }

  irABusqueda(): void {
    const q = this.busqueda?.trim();
    this.router.navigate(['/productos'], q ? { queryParams: { q } } : undefined);
  }

  getDynamicGradient(): string {
    const baseColor = this.config()?.headerBackgroundColor || '#fbeded';
    return getDynamicGradient(baseColor);
  }

  getButtonColor(base?: string): string {
    return base || '#be2541';
  }

  getTextColor(bg?: string): string {
    return getTextColor(bg || '#ffffff');
  }

  getTextColorwelcom(bg?: string): string {
    return this.getTextColor(bg);
  }
}