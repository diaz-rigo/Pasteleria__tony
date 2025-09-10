// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ProductCardComponent } from './product-card/product-card.component';
// import { LoadingComponent } from '../../shared/components/loading/loading.component';
// import { ProductService } from '../../shared/services/product.service';
// import { Product } from '../../shared/models/product.model';
// import { HttpClientModule } from '@angular/common/http';


// @Component({
//   selector: 'app-products',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     ProductCardComponent,
//     LoadingComponent,HttpClientModule
//   ],
//   templateUrl: './products.component.html',
//   styleUrls: ['./products.component.css'],
//   providers:[ProductService]
// })
// export class ProductsComponent implements OnInit {
//   categories: string[] = [
//     'Pays',
//     'Galletas',
//     'Postres',
//     'Pasteles'
//   ];
// // #f2d29b
//   flavors: string[] = [
//     'Original',
//     'Vainilla',
//     'Fresa',
//     'Chocolate'
//   ];

//   products: Product[] = [];
//   filteredProducts: Product[] = [];
//   loading: boolean = true;
//   currentPage: number = 1;
//   itemsPerPage: number = 6;
//   selectedCategories: string[] = [];
//   selectedFlavors: string[] = [];
//   maxPrice: number = 1000;

//   ngOnInit(): void {
//     this.loadProducts();
//   }
//   constructor(private productService: ProductService) {} // Inyección del servicio

// private loadProducts(): void {
//   this.loading = true;
  
//   // Remove the setTimeout simulation and use only the service call
//   this.productService.getProducts().subscribe({
//     next: (products: Product[]) => {
//       this.products = products;
//       this.filteredProducts = [...products];
//       this.loading = false;
//     },
//     error: (error) => {
//       console.error('Error al cargar productos:', error);
//       this.loading = false;
//       // Handle error (e.g., show error message to user)
//     }
//   });
// }


//   onCategoryFilterChange(category: string, isChecked: boolean): void {
//     if (isChecked) {
//       this.selectedCategories.push(category);
//     } else {
//       this.selectedCategories = this.selectedCategories.filter(c => c !== category);
//     }
//     this.applyFilters();
//   }

//   onFlavorFilterChange(flavor: string, isChecked: boolean): void {
//     if (isChecked) {
//       this.selectedFlavors.push(flavor);
//     } else {
//       this.selectedFlavors = this.selectedFlavors.filter(f => f !== flavor);
//     }
//     this.applyFilters();
//   }

//   onPriceFilterChange(maxPrice: number): void {
//     this.maxPrice = maxPrice;
//     this.applyFilters();
//   }

//   onSortChange(sortOption: string): void {
//     switch (sortOption) {
//       // case 'Precio: Menor a Mayor':
//       //   this.filteredProducts.sort((a, b) => {
//       //     const priceA = Math.min(...a.variants.map(v => Math.min(...v.sizeStock.map(s => s.price))));
//       //     const priceB = Math.min(...b.variants.map(v => Math.min(...v.sizeStock.map(s => s.price))));
//       //     return priceA - priceB;
//       //   });
//       //   break;
//       // case 'Precio: Mayor a Menor':
//       //   this.filteredProducts.sort((a, b) => {
//       //     const priceA = Math.max(...a.variants.map(v => Math.max(...v.sizeStock.map(s => s.price))));
//       //     const priceB = Math.max(...b.variants.map(v => Math.max(...v.sizeStock.map(s => s.price))));
//       //     return priceB - priceA;
//       //   });
//       //   break;
//       // case 'Destacados':
//       //   this.filteredProducts.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
//       //   break;
//       // default:
//       //   // Orden por defecto (fecha de añadido)
//       //   this.filteredProducts.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
//     }
//   }

//   private applyFilters(): void {
//     this.filteredProducts = this.products.filter(product => {
//       // Filtro por categoría
//       // if (this.selectedCategories.length > 0 && !this.selectedCategories.includes(product.category)) {
//       //   return false;
//       // }
      
//       // // Filtro por sabor
//       // if (this.selectedFlavors.length > 0) {
//       //   const productFlavors = product.variants.map(v => v.flavor);
//       //   if (!this.selectedFlavors.some(f => productFlavors.includes(f))) {
//       //     return false;
//       //   }
//       // }
      
//       // // Filtro por precio
//       // const minProductPrice = Math.min(...product.variants.flatMap(v => v.sizeStock.map(s => s.price)));
//       // if (minProductPrice > this.maxPrice) {
//       //   return false;
//       // }
      
//       return true;
//     });
    
//     this.currentPage = 1; // Resetear a la primera página al aplicar nuevos filtros
//   }

//   get paginatedProducts(): Product[] {
//     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//     return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
//   }

//   changePage(page: number): void {
//     this.currentPage = page;
//   }

//   get totalPages(): number {
//     return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
//   }
// }