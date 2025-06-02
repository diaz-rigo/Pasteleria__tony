// featured-products.component.ts
import { Component, inject } from '@angular/core';
import { Product } from '../../../shared/models/product.model';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../shared/services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { Variant } from '../../../shared/models/variant.model';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [RatingStarsComponent, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.css'],
  providers: [ProductService]
})
export class FeaturedProductsComponent {
  productService = inject(ProductService);
  featuredProducts: Product[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadProducts();
  }
 loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.featuredProducts = products.filter(product => product.isFeatured);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.errorMessage = 'No pudimos cargar los productos destacados. Por favor intenta más tarde.';
        this.isLoading = false;
      }
    });
  }
getSafeVariants(product: Product): Variant[] {
  return product?.variants ?? [];
}

  // Helper method to safely get product image
  getProductImage(product: Product): string {
    return product.variants?.[0]?.images?.[0] || 'path/to/default/image.jpg';
  }


  // Determina si un color es claro para ajustar el texto
  isLightColor(hex?: string): boolean {
    if (!hex) return false;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  }
hasPriceRange(product: Product): boolean {
  let min = Infinity, max = 0;

  product.variants?.forEach(variant => {
    variant.sizeStock?.forEach(stock => {
      if (typeof stock.price === 'number') {
        if (stock.price < min) min = stock.price;
        if (stock.price > max) max = stock.price;
      }
    });
  });

  return isFinite(min) && min !== max;
}

hasMultipleSizes(product: Product): boolean {
  if (!product.variants) return false;

  const sizes = new Set<number>();
  product.variants.forEach(variant => {
    variant.sizeStock?.forEach(stock => {
      if (stock.size !== undefined) {
        sizes.add(stock.size);
      }
    });
  });
  return sizes.size > 1;
}
getExtraVariantCount(product: Product): number {
  if (!product.variants) return 0;
  return product.variants.length > 3 ? product.variants.length - 3 : 0;
}


  getExtraVariantCountFromVariants(variants: Variant[]): number {
    return variants.length > 3 ? variants.length - 3 : 0;
  }



    // Obtiene el precio inicial (mínimo)
getStartingPrice(product: Product): number {
  let minPrice = Infinity;

  product.variants?.forEach(variant => {
    variant.sizeStock?.forEach(stock => {
      if (typeof stock.price === 'number' && stock.price < minPrice) {
        minPrice = stock.price;
      }
    });
  });

  return minPrice !== Infinity ? minPrice : 0;
}

getUniqueSizes(product: Product): number[] {
  const sizes = new Set<number>();
  product.variants?.forEach(variant => {
    variant.sizeStock?.forEach(stock => {
      if (stock.size !== undefined) {
        sizes.add(stock.size);
      }
    });
  });
  return Array.from(sizes).sort((a, b) => a - b);
}



}