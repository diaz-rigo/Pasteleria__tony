// import { Component, Input, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { CurrencyPipe } from '@angular/common';
// import { Product } from '../../../shared/models/product.model';
// import { Variant } from '../../../shared/models/variant.model';
// import { SizeStock } from '../../../shared/models/size-stock.model';
// import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';
// import { ActivatedRoute, RouterModule } from '@angular/router';
// import { ProductService } from '../../../shared/services/product.service';
// import { HttpClientModule } from '@angular/common/http';

// @Component({
//   selector: 'app-product-detail',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RatingStarsComponent, CurrencyPipe,HttpClientModule,RouterModule],
//   templateUrl: './product-detail.component.html',
//   styleUrls: ['./product-detail.component.css'],
//   providers:[ProductService]
// })
// export class ProductDetailComponent implements OnInit {
//   @Input() product?: Product;
//   selectedVariantIndex: number = 0;
//   selectedSizeIndex: number = 0;
//   quantity: number = 1;
//   loading: boolean = true;
//   error: string | null = null;
//   selectedImage: string | null = null;

//  constructor(
//     private route: ActivatedRoute,
//     private productService: ProductService
//   ) {}
//   // ngOnInit(): void {
//   //   console.log("detalle producto")
//   //   console.log("detalle producto_",this.product)
//   //   if (this.product?.variants && this.product.variants.length > 0) {
//   //     this.selectedVariantIndex = 0;
//   //     this.selectedSizeIndex = 0;
//   //   }
//   // }
//   ngOnInit(): void {
//     this.route.paramMap.subscribe(params => {
//       const id = params.get('id');
//       if (id) {
//         this.loadProduct(id);
//       } else {
//         this.error = 'No se proporcionó ID de producto';
//         this.loading = false;
//       }
//     });
//   }

  
//    loadProduct(id: string): void {
//     // this.loading = true;
//     this.error = null;
    
//     this.productService.getProductById(id).subscribe({
//       next: (product) => {
//         this.product = product;
//         if (product?.variants && product.variants.length > 0) {
//           this.selectedVariantIndex = 0;
//           this.selectedSizeIndex = 0;
//             this.selectedImage = product.variants[0].images?.[0] || null;

//         }
//         this.loading = false;
//       },
//       error: (err) => {
//         this.error = 'Error al cargar el producto';
//         this.loading = false;
//         console.error('Error loading product:', err);
//       }
//     });
//   }

// hasMultipleSizes(): boolean {
//   const variant = this.getSelectedVariant();
//   return variant?.sizeStock ? variant.sizeStock.length > 1 : false;
// }

//   selectVariant(index: number): void {

//     this.selectedVariantIndex = index;
//     this.selectedSizeIndex = 0;
//     this.quantity = 1;


//     const variant = this.getSelectedVariant();
//     this.selectedImage = variant?.images?.[0] || null;
//   }

//   selectSize(index: number): void {
//     this.selectedSizeIndex = index;
//     this.quantity = 1;

//     // Reiniciar imagen seleccionada al cambiar de variante
//   }

//   incrementQuantity(): void {
//     const maxStock = this.getSelectedSize()?.stock || 0;
//     if (this.quantity < maxStock) {
//       this.quantity++;
//     }
//   }

//   decrementQuantity(): void {
//     if (this.quantity > 1) {
//       this.quantity--;
//     }
//   }

//   getSelectedVariant(): Variant | undefined {
//     return this.product?.variants?.[this.selectedVariantIndex];
//   }

//   getSelectedSize(): SizeStock | undefined {
//     const variant = this.getSelectedVariant();
//     return variant?.sizeStock?.[this.selectedSizeIndex];
//   }

//   // getTotalPrice(): number {
//   //   const size = this.getSelectedSize();
//   //   return size ? size.price * this.quantity : 0;
//   // }



//   // IMAGENES
//   onSelectImage(image: string) {
//   this.selectedImage = image;
// }
// }