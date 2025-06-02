import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from './product-card/product-card.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/product.model';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent,
    LoadingComponent,HttpClientModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers:[ProductService]
})
export class ProductsComponent implements OnInit {
  categories: string[] = [
    'Pays',
    'Galletas',
    'Postres',
    'Flanes',
    'Pasteles'
  ];

  flavors: string[] = [
    'Original',
    'Vainilla',
    'Fresa',
    'Chocolate'
  ];

  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  selectedCategories: string[] = [];
  selectedFlavors: string[] = [];
  maxPrice: number = 1000;

  ngOnInit(): void {
    this.loadProducts();
  }
  constructor(private productService: ProductService) {} // Inyección del servicio

private loadProducts(): void {
  this.loading = true;
  
  // Remove the setTimeout simulation and use only the service call
  this.productService.getProducts().subscribe({
    next: (products: Product[]) => {
      this.products = products;
      this.filteredProducts = [...products];
      this.loading = false;
    },
    error: (error) => {
      console.error('Error al cargar productos:', error);
      this.loading = false;
      // Handle error (e.g., show error message to user)
    }
  });
}

  // private getSampleProducts(): Product[] {
  //   // Usamos los datos JSON que proporcionaste
  //   return [
  //     {
  //       "_id": "67c7d70d77c1c4b928f4d48e",
  //       "name": "Pay de Queso",
  //       "category": "Pays",
  //       "description": "Clásico pay de queso con base de galleta y textura cremosa",
  //       "ingredientes": "Galleta molida, queso crema, huevos, azúcar, vainilla, crema ácida",
  //       "isFeatured": false,
  //       "availabilityStatus": "available",
  //       "variants": [
  //         {
  //           "flavor": "Original",
  //           "description": "Versión tradicional con cubierta de mermelada de fresa",
  //           "sizeStock": [
  //             {
  //               "size": 8,
  //               "price": 280,
  //               "availabilityStatus": "available"
  //             }
  //           ],
  //           "images": [
  //             "https://res.cloudinary.com/dfpdb2cdl/image/upload/v1741150217/productos/pay_queso.jpg"
  //           ]
  //         }
  //       ],
  //       "dateAdded": "2025-03-05T04:46:05.938Z"
  //     },
  //     {
  //       "_id": "67c7d70d77c1c4b928f4d48f",
  //       "name": "Galletas Decoradas",
  //       "category": "Galletas",
  //       "description": "Galletas artesanales con decorados personalizados",
  //       "ingredientes": "Harina, mantequilla, azúcar, huevo, esencias, colorantes alimenticios",
  //       "isFeatured": true,
  //       "availabilityStatus": "available",
  //       "variants": [
  //         {
  //           "flavor": "Vainilla",
  //           "description": "Galletas con diseños según temporada o evento especial",
  //           "sizeStock": [
  //             {
  //               "size": 12,
  //               "price": 180,
  //               "availabilityStatus": "available"
  //             }
  //           ],
  //           "images": [
  //             "https://res.cloudinary.com/dfpdb2cdl/image/upload/v1741150217/productos/galletas_decoradas.jpg"
  //           ]
  //         }
  //       ],
  //       "dateAdded": "2025-03-05T04:46:05.938Z"
  //     },
  //     {
  //       "_id": "67c7d70d77c1c4b928f4d490",
  //       "name": "Mousse de Fresa",
  //       "category": "Postres",
  //       "description": "Postre ligero y esponjoso con sabor intenso a fresa",
  //       "ingredientes": "Fresas naturales, crema para batir, gelatina sin sabor, azúcar",
  //       "isFeatured": false,
  //       "availabilityStatus": "available",
  //       "variants": [
  //         {
  //           "flavor": "Fresa",
  //           "description": "Presentación en vasito individual con decoración de fresa fresca",
  //           "sizeStock": [
  //             {
  //               "size": 1,
  //               "price": 65,
  //               "availabilityStatus": "available"
  //             }
  //           ],
  //           "images": [
  //             "https://res.cloudinary.com/dfpdb2cdl/image/upload/v1741150217/productos/mousse_fresa.jpg"
  //           ]
  //         }
  //       ],
  //       "dateAdded": "2025-03-05T04:46:05.938Z"
  //     },
  //     {
  //       "_id": "67c7d70d77c1c4b928f4d491",
  //       "name": "Flan Napolitano",
  //       "category": "Flanes",
  //       "description": "Postre tradicional con cubierta de caramelo y textura sedosa",
  //       "ingredientes": "Huevo, leche condensada, leche evaporada, vainilla, caramelo",
  //       "isFeatured": false,
  //       "availabilityStatus": "available",
  //       "variants": [
  //         {
  //           "flavor": "Original",
  //           "description": "Presentación en molde individual o familiar",
  //           "sizeStock": [
  //             {
  //               "size": 6,
  //               "price": 120,
  //               "availabilityStatus": "available"
  //             },
  //             {
  //               "size": 12,
  //               "price": 220,
  //               "availabilityStatus": "available"
  //             }
  //           ],
  //           "images": [
  //             "https://res.cloudinary.com/dfpdb2cdl/image/upload/v1741150217/productos/flan_napolitano.jpg"
  //           ]
  //         }
  //       ],
  //       "dateAdded": "2025-03-05T04:46:05.938Z"
  //     },
  //     {
  //       "_id": "67c7d70d77c1c4b928f4d492",
  //       "name": "Pastel Tradicional",
  //       "category": "Pasteles",
  //       "description": "Pastel clásico con diferentes opciones de relleno y decoración",
  //       "ingredientes": "Harina, huevo, azúcar, mantequilla, leche, polvo para hornear, relleno a elegir",
  //       "isFeatured": true,
  //       "availabilityStatus": "available",
  //       "variants": [
  //         {
  //           "flavor": "Chocolate",
  //           "description": "Bizcocho de chocolate con relleno de ganache y decoración personalizada",
  //           "sizeStock": [
  //             {
  //               "size": 1,
  //               "price": 350,
  //               "availabilityStatus": "available"
  //             },
  //             {
  //               "size": 2,
  //               "price": 600,
  //               "availabilityStatus": "available"
  //             }
  //           ],
  //           "images": [
  //             "https://res.cloudinary.com/dfpdb2cdl/image/upload/v1741150217/productos/pastel_chocolate.jpg"
  //           ]
  //         },
  //         {
  //           "flavor": "Vainilla",
  //           "description": "Bizcocho de vainilla con relleno de frutas o crema",
  //           "sizeStock": [
  //             {
  //               "size": 1,
  //               "price": 320,
  //               "availabilityStatus": "available"
  //             }
  //           ],
  //           "images": [
  //             "https://res.cloudinary.com/dfpdb2cdl/image/upload/v1741150217/productos/pastel_vainilla.jpg"
  //           ]
  //         }
  //       ],
  //       "dateAdded": "2025-03-05T04:46:05.938Z"
  //     }
  //   ];
  // }

  onCategoryFilterChange(category: string, isChecked: boolean): void {
    if (isChecked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }
    this.applyFilters();
  }

  onFlavorFilterChange(flavor: string, isChecked: boolean): void {
    if (isChecked) {
      this.selectedFlavors.push(flavor);
    } else {
      this.selectedFlavors = this.selectedFlavors.filter(f => f !== flavor);
    }
    this.applyFilters();
  }

  onPriceFilterChange(maxPrice: number): void {
    this.maxPrice = maxPrice;
    this.applyFilters();
  }

  onSortChange(sortOption: string): void {
    switch (sortOption) {
      // case 'Precio: Menor a Mayor':
      //   this.filteredProducts.sort((a, b) => {
      //     const priceA = Math.min(...a.variants.map(v => Math.min(...v.sizeStock.map(s => s.price))));
      //     const priceB = Math.min(...b.variants.map(v => Math.min(...v.sizeStock.map(s => s.price))));
      //     return priceA - priceB;
      //   });
      //   break;
      // case 'Precio: Mayor a Menor':
      //   this.filteredProducts.sort((a, b) => {
      //     const priceA = Math.max(...a.variants.map(v => Math.max(...v.sizeStock.map(s => s.price))));
      //     const priceB = Math.max(...b.variants.map(v => Math.max(...v.sizeStock.map(s => s.price))));
      //     return priceB - priceA;
      //   });
      //   break;
      // case 'Destacados':
      //   this.filteredProducts.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      //   break;
      // default:
      //   // Orden por defecto (fecha de añadido)
      //   this.filteredProducts.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    }
  }

  private applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      // Filtro por categoría
      // if (this.selectedCategories.length > 0 && !this.selectedCategories.includes(product.category)) {
      //   return false;
      // }
      
      // // Filtro por sabor
      // if (this.selectedFlavors.length > 0) {
      //   const productFlavors = product.variants.map(v => v.flavor);
      //   if (!this.selectedFlavors.some(f => productFlavors.includes(f))) {
      //     return false;
      //   }
      // }
      
      // // Filtro por precio
      // const minProductPrice = Math.min(...product.variants.flatMap(v => v.sizeStock.map(s => s.price)));
      // if (minProductPrice > this.maxPrice) {
      //   return false;
      // }
      
      return true;
    });
    
    this.currentPage = 1; // Resetear a la primera página al aplicar nuevos filtros
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }
}