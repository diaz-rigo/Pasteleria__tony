import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalogo-produc',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ButtonModule,
    DialogModule
  ],
  providers: [ProductService,DialogService],
  templateUrl: './catalogo-produc.component.html',
  styleUrls: ['./catalogo-produc.component.scss','./dialog.scss']
})
export class CatalogoProducComponent implements OnInit {
  categories: string[] = [];
  selectedCategory: string = '';
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedProduct: any = null;
  selectedVariant: any = null;
  displayDialog: boolean = false;
  selectedImage: string = '';

  constructor(private productService: ProductService, private dialogService: DialogService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data: any[]) => {
        this.products = data;
        this.categories = [...new Set(this.products.map(product => product.category))];
        if (this.categories.length > 0) {
          this.selectCategory(this.categories[0]);
        }
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterProducts();
    if (this.filteredProducts.length > 0) {
      this.selectProduct(this.filteredProducts[0]);
    }
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => product.category === this.selectedCategory);
  }

  selectProduct(product: any): void {
    this.selectedProduct = product;
    if (this.selectedProduct.variants && this.selectedProduct.variants.length > 0) {
      this.selectVariant(this.selectedProduct.variants[0]);
    }
  }

  selectVariant(variant: any): void {
    this.selectedVariant = variant;
    console.log('Selected Variant:', this.selectedVariant);
  }

  showImageDetails(image: string): void {
    this.selectedImage = image;
    this.displayDialog = true;
  }
}
