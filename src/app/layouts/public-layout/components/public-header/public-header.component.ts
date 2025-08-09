import { Component, Input, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';
import { ConfigService, SystemConfig } from '../../../../shared/services/config.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [CommonModule, RouterModule,HttpClientModule],
  templateUrl: './public-header.component.html',
  styleUrls: ['./public-header.component.css'],
  providers:[ConfigService]
})
export class PublicHeaderComponent implements OnInit {

  mobileMenuOpen = false;
  cartItems = 3;

  config = signal<SystemConfig | null>(null);

  constructor(private configService: ConfigService,private router:Router) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe({
      next: (res) => this.config.set(res),
      error: () => console.warn('Error cargando configuración del sistema')
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  openLogin() {
    this.router.navigate(['/login']);
    // lógica para login
  }

  openCart() {
    // lógica para carrito
  }

  isActive(path: string): boolean {
    return window.location.pathname === path;
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
}
