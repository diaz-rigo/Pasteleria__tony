import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { Product } from '../../../shared/models/product.model'; // Asegúrate de importar tu interfaz real
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RatingStarsComponent, CurrencyPipe, TruncatePipe,CommonModule,RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product; // Elimina el valor por defecto ya que los campos son opcionales

 
  ngOnInit(): void {
    console.log(this.product,"this.product")

    
  }
}