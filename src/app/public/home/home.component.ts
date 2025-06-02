import { Component } from '@angular/core';
import { Product } from '../../shared/models/product.model';
import { ProductService } from '../../shared/services/product.service';
import { RatingStarsComponent } from '../../shared/components/rating-stars/rating-stars.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroComponent } from './hero/hero.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RatingStarsComponent, CommonModule, RouterModule,HeroComponent,FeaturedProductsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // providers: [ProductService]
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

  // constructor(private productService: ProductService) {}
}