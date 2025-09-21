import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { Product } from '../../../shared/models/product.model'; // Asegúrate de importar tu interfaz real
import { RouterModule } from '@angular/router';
import { ShareService } from '../../../shared/services/share.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RatingStarsComponent, CurrencyPipe, TruncatePipe,CommonModule,RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product; // Elimina el valor por defecto ya que los campos son opcionales

 
 constructor(private share: ShareService) {}

  private productUrl(p: Product) {
    const id = (p as any)?._id ?? (p as any)?.id;
    return `${window.location.origin}/productos-detail/${id}`;
  }

  async shareWithImage() {
    if (!this.product) return;
    const v = this.product.variants?.[0];
    const s = v?.sizeStock?.[0];          // primera talla/precio disponible
    const selectedImage = v?.images?.[0]; // primera imagen de la variante
    await this.share.shareProductWithImage({
      product: this.product,
      variant: v,
      size: s,
      selectedImage,
      url: this.productUrl(this.product),
      baseUrl: 'https://pasteleria-tony.vercel.app' // ajústalo si cambias de dominio
    });
  }
}