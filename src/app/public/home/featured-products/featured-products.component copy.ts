// import { Component, inject } from '@angular/core';
// import { Product } from '../../../shared/models/product.model';
// import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';
// import { RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { ProductService } from '../../../shared/services/product.service';
// import { HttpClientModule } from '@angular/common/http';

// @Component({
//   selector: 'app-featured-products',
//   standalone: true,
//   imports: [RatingStarsComponent,CommonModule, RouterModule,HttpClientModule],
//   templateUrl: './featured-products.component.html',
//   styleUrl: './featured-products.component.css',
//   providers:[ProductService]
// })
// export class FeaturedProductsComponent {
//   productService = inject(ProductService)
//   featuredProducts: Product[] = [

//   ];
// ngOnInit(): void {
//   //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
//   //Add 'implements OnInit' to the class.
//   this.loadProducts()
// }
  
// private loadProducts(): void {
//   this.productService.getProducts().subscribe({
//     next: (products: Product[]) => {
//       // Filtrar solo los productos destacados
//       this.featuredProducts = products.filter(product => product.isFeatured);
//     },
//     error: (error) => {
//       console.error('Error al cargar productos:', error);
//     }
//   });
// }

// }
