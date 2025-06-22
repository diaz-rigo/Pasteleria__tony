import { Component, signal } from '@angular/core';
import { Product } from '../../shared/models/product.model';
import { ProductService } from '../../shared/services/product.service';
import { RatingStarsComponent } from '../../shared/components/rating-stars/rating-stars.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroComponent } from './hero/hero.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { ConfigService, SystemConfig } from '../../shared/services/config.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RatingStarsComponent, CommonModule, RouterModule,HeroComponent,FeaturedProductsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // providers: [ProductService]
  providers:[ConfigService]

})
export class HomeComponent {


  testimonials = [
    {
      name: "María González",
      comment: "Los pasteles son exquisitos y la presentación impecable. Siempre que hay una celebración en casa, pedimos aquí.",
      rating: 5
    },
    {
      name: "Carlos Martínez",
      comment: "Calidad premium a precios razonables. El servicio de entrega fue puntual y el pastel llegó en perfecto estado.",
      rating: 4
    },
    {
      name: "Ana López",
      comment: "Me encanta la variedad de opciones sin azúcar. Como diabética, es difícil encontrar repostería tan deliciosa y apta para mí.",
      rating: 5
    }
  ];
  
    config = signal<SystemConfig | null>(null);
  
    constructor(private configService: ConfigService) {}
  
  hoverCTA = false; // <-- agrega esta línea

  ngOnInit(): void {
    this.configService.getConfig().subscribe({
      next: (res) => this.config.set(res),
      error: () => console.warn('Error cargando configuración del sistema')
    });
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