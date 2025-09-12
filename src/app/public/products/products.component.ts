import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ProductCardComponent } from './product-card/product-card.component';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/product.model';
import { LoadingOverlayComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, LoadingOverlayComponent, HttpClientModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [ProductService]
})
export class ProductsComponent implements OnInit {
  // Catálogos (categorías fijas; sabores dinámicos desde datos)
  categories: string[] = ['Pays', 'Galletas', 'Postres', 'Flanes', 'Pasteles'];
  flavors: string[] = [];

  // Datos
  products: Product[] = [];
  filteredProducts: Product[] = [];

  // UI state
  loading = true;
  skeletonCount = Array.from({ length: 6 }); // 6 tarjetas de skeleton
  currentPage = 1;
  itemsPerPage = 6;

  // Filtros
  selectedCategories: string[] = [];
  selectedFlavors: string[] = [];
  searchTerm = '';
  sortOption: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest' = 'featured';

  // Precio
  priceBounds = { min: 0, max: 1000 };
  maxPrice = 1000;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }
flavorSelection: { [flavor: string]: boolean } = {};

  private loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products ?? [];
        // Calcular sabores únicos a partir de los datos para no desincronizar
        this.flavors = Array.from(
          new Set(
            this.products
              .flatMap(p => (p.variants ?? []).map(v => v.flavor))
              .filter((flavor): flavor is string => typeof flavor === 'string')
          )
        ).sort();

        // Calcular rango de precios global
        const allPrices = this.products
          .flatMap(p => (p.variants ?? [])
            .flatMap(v => (v.sizeStock ?? []).map(s => s.price)))
          .filter((p): p is number => typeof p === 'number' && !isNaN(p));

        const min = allPrices.length ? Math.min(...allPrices) : 0;
        const max = allPrices.length ? Math.max(...allPrices) : 1000;

        this.priceBounds = { min, max };
        this.maxPrice = max;

        this.filteredProducts = [...this.products];
        this.onSortChange(this.sortOption); // ordenar inicial
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.loading = false;
      }
    });
  }

  // ==== Helpers de precio/sabor ====
  private minProductPrice(p: Product): number {
    const prices = (p.variants ?? []).flatMap(v => (v.sizeStock ?? []).map(s => s.price))
      .filter((price): price is number => typeof price === 'number' && !isNaN(price));
    return prices.length ? Math.min(...prices) : Number.POSITIVE_INFINITY;
  }

  private hasAnyFlavor(p: Product, flavors: string[]): boolean {
    const productFlavors = (p.variants ?? []).map(v => v.flavor);
    return flavors.some(f => productFlavors.includes(f));
  }

  // ==== Filtros ====
  onCategoryFilterChange(category: string, isChecked: boolean): void {
    this.selectedCategories = isChecked
      ? Array.from(new Set([...this.selectedCategories, category]))
      : this.selectedCategories.filter(c => c !== category);

    this.applyFilters();
  }

  onFlavorFilterChange(flavor: string, isChecked: boolean): void {
    this.selectedFlavors = isChecked
      ? Array.from(new Set([...this.selectedFlavors, flavor]))
      : this.selectedFlavors.filter(f => f !== flavor);

    this.applyFilters();
  }

  onPriceFilterChange(maxPrice: number): void {
    this.maxPrice = +maxPrice;
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedCategories = [];
    this.selectedFlavors = [];
    this.searchTerm = '';
    this.maxPrice = this.priceBounds.max;
    this.applyFilters();
  }
applyFilters(): void {
  const term = this.searchTerm.trim().toLowerCase();

  this.filteredProducts = this.products.filter(p => {
    // Categorías
    if (this.selectedCategories.length && !this.selectedCategories.includes(p.category ?? '')) {
      return false;
    }

    // Sabores (sobre variants[].flavor)
    if (this.selectedFlavors.length && !this.hasAnyFlavor(p, this.selectedFlavors)) {
      return false;
    }

    // Precio mínimo del producto vs. maxPrice
    const minPrice = this.minProductPrice(p);
    if (minPrice > this.maxPrice) {
      return false;
    }

    // 🔍 Búsqueda (producto + variantes)
    if (term) {
      const hayEnProducto = [
        p.name ?? '',
        p.description ?? '',
        p.ingredientes ?? ''
      ].some(txt => txt.toLowerCase().includes(term));

      const hayEnVariante = (p.variants ?? []).some(v =>
        [
          v.flavor ?? '',
          v.description ?? '',
          v.texture ?? '',
          v.shape ?? '',
          v.color ?? ''
        ].some(txt => txt.toLowerCase().includes(term))
      );

      if (!hayEnProducto && !hayEnVariante) return false;
    }

    return true;
  });

  // Reiniciar página al aplicar filtros
  this.currentPage = 1;
  this.onSortChange(this.sortOption);
}

  // applyFilters(): void {
  //   const term = this.searchTerm.trim().toLowerCase();

  //   this.filteredProducts = this.products.filter(p => {
  //     // Categorías
  //     if (this.selectedCategories.length && !this.selectedCategories.includes(p.category ?? '')) {
  //       return false;
  //     }

  //     // Sabores (sobre variants[].flavor)
  //     if (this.selectedFlavors.length && !this.hasAnyFlavor(p, this.selectedFlavors)) {
  //       return false;
  //     }

  //     // Precio mínimo del producto vs. maxPrice
  //     const minPrice = this.minProductPrice(p);
  //     if (minPrice > this.maxPrice) {
  //       return false;
  //     }

  //     // Búsqueda por nombre/description/ingredientes
  //     if (term) {
  //       const hay = [
  //         p.name ?? '',
  //         p.description ?? '',
  //         p.ingredientes ?? ''
  //       ].some(txt => txt.toLowerCase().includes(term));
  //       if (!hay) return false;
  //     }

  //     return true;
  //   });

  //   // Reiniciar página y reordenar
  //   this.currentPage = 1;
  //   this.onSortChange(this.sortOption);
  // }

  // ==== Ordenamiento ====
  onSortChange(sortOption: string): void {
    this.sortOption = sortOption as any;

    const byMinPrice = (a: Product, b: Product) =>
      this.minProductPrice(a) - this.minProductPrice(b);

    switch (this.sortOption) {
      case 'price-asc':
        this.filteredProducts = [...this.filteredProducts].sort(byMinPrice);
        break;

      case 'price-desc':
        this.filteredProducts = [...this.filteredProducts].sort((a, b) => byMinPrice(b, a));
        break;

      case 'rating':
        this.filteredProducts = [...this.filteredProducts].sort((a, b) => {
          const ra = a.ratings?.average ?? 0;
          const rb = b.ratings?.average ?? 0;
          return rb - ra;
        });
        break;

      case 'newest':
        this.filteredProducts = [...this.filteredProducts].sort((a, b) => {
          const da = new Date(a.dateAdded ?? 0).getTime();
          const db = new Date(b.dateAdded ?? 0).getTime();
          return db - da;
        });
        break;

      case 'featured':
      default:
        this.filteredProducts = [...this.filteredProducts].sort((a, b) => {
          const fa = a.isFeatured ? 1 : 0;
          const fb = b.isFeatured ? 1 : 0;
          // Destacados primero; como tiebreaker, más nuevos
          if (fb !== fa) return fb - fa;
          const da = new Date(a.dateAdded ?? 0).getTime();
          const db = new Date(b.dateAdded ?? 0).getTime();
          return db - da;
        });
        break;
    }
  }

  // ==== Paginación ====
  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    // opcional: scroll al top
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.itemsPerPage));
  }

  // trackBy
  trackById(_: number, item: Product) {
    return (item as any)._id ?? item.name;
  }
  getCheckedState(event: Event): boolean {
  return (event.target as HTMLInputElement).checked;
}
}
