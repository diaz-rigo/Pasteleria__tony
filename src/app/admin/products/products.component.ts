import { Component, effect, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../shared/models/product.model';
import { ProductService } from '../../shared/services/product.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  providers: [ProductService],
  templateUrl: './products.component.html',
})
export class ProductsComponentAdmin  implements OnInit{
  public Math = Math;

  // Signals
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  categories = signal<string[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  currentPage = signal(1);
  itemsPerPage = 10;

  searchTerm = signal('');
  selectedCategory = signal('');
  sortOption = signal('name_asc');

  showDeleteModal = signal(false);
  iscrear = signal(false);
  productToDelete = signal<Product | null>(null);

  constructor(private productService: ProductService,private router: Router,private toastService: ToastService) {
    // Reaplicar filtros automáticamente si los productos, categoría o búsqueda cambian
    effect(() => {
      this.applyFilters();
    }, { allowSignalWrites: true });   

  }


  ngOnInit(): void {
    this.iscrear.set(false)
    this.loadProducts();

 
  }

   crear() {
    this.iscrear.set(true)
    this.router.navigate(['/productos/crear']);
  }

  get totalItems() {
    return this.filteredProducts().length;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get paginatedProducts() {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredProducts().slice(startIndex, startIndex + this.itemsPerPage);
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.categories.set(this.extractUniqueCategories(products));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los productos. Por favor, inténtalo de nuevo más tarde.');
        this.loading.set(false);
        console.error('Error loading products:', err);
      },
    });
  }


  extractUniqueCategories(products: Product[]): string[] {
    const categories = new Set<string>();
    products
      .filter((product) => product.category !== undefined)
      .forEach((product) => categories.add(product.category!));
    return Array.from(categories).sort();
  }

  applyFilters(): void {
    let result = [...this.products()];

    const category = this.selectedCategory();

    if (category) {
      result = result.filter((product) => product.category === category);
    }

    result = this.sortProducts(result);
    this.filteredProducts.set(result);
    this.currentPage.set(1);
  }

  sortProducts(products: Product[]): Product[] {
    const [field, direction] = this.sortOption().split('_');

    return [...products].sort((a, b) => {
      if (field === 'price') {
        const priceA = this.getMinPrice(a);
        const priceB = this.getMinPrice(b);
        return direction === 'asc' ? priceA - priceB : priceB - priceA;
      }
      return 0;
    });
  }
  getMinPrice(product: Product): number {
    if (!product.variants) return 0;

    const prices = product.variants.flatMap((v) =>
      (v.sizeStock ?? [])
        .map((s) => s.price)
        .filter((price): price is number => price !== undefined)
    );

    return prices.length > 0 ? Math.min(...prices) : 0;
  }

  getAllProductImages(product: Product): string[] {
    if (!product.variants) return [];
    return product.variants.flatMap((variant) => variant.images || []);
  }

  confirmDelete(product: Product): void {
    this.productToDelete.set(product);
    this.showDeleteModal.set(true);
  }

  onDeleteConfirmed(): void {
    const product = this.productToDelete();
    if (product) {
      console.log("product",product)
      this.productService.deleteProduct(product._id!).subscribe({
        next: () => {
          this.toastService.showSuccess('Producto eliminado correctamente');
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          this.toastService.showError('Error al eliminar el producto');
        }
      });
    }

    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
  }

  onDeleteCancelled(): void {
    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
    }
  }



   shortenId(id : string) {
    if (!id) return '';
    const length = id.length;
    if (length <= 15) return id;
    return `${id.substring(0, 8)}...${id.substring(length - 7)}`;
  }
}
