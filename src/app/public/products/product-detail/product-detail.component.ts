import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../../shared/models/product.model';
import { Variant } from '../../../shared/models/variant.model';
import { SizeStock } from '../../../shared/models/size-stock.model';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingStarsComponent, CurrencyPipe, HttpClientModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [ProductService]
})
export class ProductDetailComponent implements OnInit {
  @Input() product = signal<Product | undefined>(undefined);
  selectedVariantIndex = signal(0);
  selectedSizeIndex = signal(0);
  quantity = signal(1);
  loading = signal(true);
  error = signal<string | null>(null);
  selectedImage = signal<string | null>(null);
  variants = computed(() => this.product()?.variants || []);
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      } else {
        this.error.set('No se proporcionó ID de producto');
        this.loading.set(false);
      }
    });
  }


  loadProduct(id: string): void {
    this.error.set(null);
    this.loading.set(true);
    
    this.productService.getProductById(id).pipe(
      tap(product => {
        this.product.set(product);
        if (product?.variants && product.variants.length > 0) {
          this.selectedVariantIndex.set(0);
          this.selectedSizeIndex.set(0);
          this.selectedImage.set(product.variants[0].images?.[0] || null);
        }
        this.loading.set(false);
      }),
      catchError(err => {
        this.error.set('Error al cargar el producto');
        this.loading.set(false);
        console.error('Error loading product:', err);
        return of(undefined);
      })
    ).subscribe(); // Just subscribe directly instead of using toSignal
  }

  hasMultipleSizes(): boolean {
    const variant = this.getSelectedVariant();
    return variant?.sizeStock ? variant.sizeStock.length > 1 : false;
  }

  selectVariant(index: number): void {
    this.selectedVariantIndex.set(index);
    this.selectedSizeIndex.set(0);
    this.quantity.set(1);
    
    const variant = this.getSelectedVariant();
    this.selectedImage.set(variant?.images?.[0] || null);
  }

  selectSize(index: number): void {
    this.selectedSizeIndex.set(index);
    this.quantity.set(1);
  }

  incrementQuantity(): void {
    const maxStock = this.getSelectedSize()?.stock || 0;
    if (this.quantity() < maxStock) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  getSelectedVariant(): Variant | undefined {
    return this.product()?.variants?.[this.selectedVariantIndex()];
  }

  getSelectedSize(): SizeStock | undefined {
    const variant = this.getSelectedVariant();
    return variant?.sizeStock?.[this.selectedSizeIndex()];
  }

  onSelectImage(image: string) {
    this.selectedImage.set(image);
  }
  // Reemplaza hasMultipleSizes() con esta nueva función
showSizesSection(): boolean {
  const variant = this.getSelectedVariant();
  return !!(variant?.sizeStock && variant.sizeStock.length > 0);
}


}