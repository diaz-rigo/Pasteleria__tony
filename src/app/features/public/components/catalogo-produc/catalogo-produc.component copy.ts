// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
// import { ProductService } from '../../services/product.service';
// import { DialogModule } from 'primeng/dialog';
// import { ButtonModule } from 'primeng/button';
// const PRIMECOMPONENTS = [ButtonModule,DialogModule]; //

// @Component({
//   selector: 'app-catalogo-produc',
//   standalone: true,
//   imports: [
//     CommonModule,
//     HttpClientModule,PRIMECOMPONENTS
//   ],
//   providers: [ProductService],
//   templateUrl: './catalogo-produc.component.html',
//   styleUrls: ['./catalogo-produc.component.scss']
// })
// export class CatalogoProducComponent implements OnInit {
//   categories: string[] = [];
//   selectedCategory: string = '';
//   products: any[] = [];
//   filteredProducts: any[] = [];
//   selectedProduct: any = null;
//   selectedVariant: any = null;

//   constructor(private productService: ProductService) { }

//   ngOnInit(): void {
//     this.loadProducts();
//   }

//   loadProducts(): void {
//     this.productService.getProducts().subscribe(
//       (data: any[]) => {
//         this.products = data;
//         this.categories = [...new Set(this.products.map(product => product.category))];
//         if (this.categories.length > 0) {
//           this.selectCategory(this.categories[0]);
//         }
//       },
//       error => {
//         console.error('Error fetching products:', error);
//       }
//     );
//   }

//   selectCategory(category: string): void {
//     this.selectedCategory = category;
//     this.filterProducts();
//     if (this.filteredProducts.length > 0) {
//       this.selectProduct(this.filteredProducts[0]);
//     }
//   }

//   filterProducts(): void {
//     this.filteredProducts = this.products.filter(product => product.category === this.selectedCategory);
//   }

//   selectProduct(product: any): void {
//     this.selectedProduct = product;
//     if (this.selectedProduct.variants && this.selectedProduct.variants.length > 0) {
//       this.selectVariant(this.selectedProduct.variants[0]);
//     }
//   }

//   selectVariant(variant: any): void {
//     this.selectedVariant = variant;
//   }
// }
