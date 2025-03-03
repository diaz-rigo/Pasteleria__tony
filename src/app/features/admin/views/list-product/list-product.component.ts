import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../public/services/product.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { HttpClientModule } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { Product } from '../../../../shared/models/producto.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProductFormComponent } from './product-form/product-form.component';
const PRIMECOMPONENTS = [InputIconModule,IconFieldModule,InputTextModule,
  DialogModule, ButtonModule, ProgressBarModule, ProgressSpinnerModule,
  PanelModule, TableModule, ToastModule,DropdownModule,DividerModule
];

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [
    ...PRIMECOMPONENTS,
    CommonModule,
    HttpClientModule,ReactiveFormsModule,FormsModule,ProductFormComponent
  ],
  providers: [ProductService, MessageService,DialogService],
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {
  agregar: boolean = false
  productos: Product[] = []
  searchForm: FormGroup;
  isWebMode: boolean = window.innerWidth >= 768 // Define la condición inicial para el modo web
  // ref: DynamicDialogRef | undefined
  isMobile: boolean = window.innerWidth < 768; // Inicializar basado en el tamaño de la ventana
  pageSizeOptions: number[] = [3, 10, 25];
  pageIndex: number = 0;
  pageSize: number = 3;
  totalProducts: number = 0;
  // // New properties
  displayVariantModal: boolean = false;
  selectedVariants: any[] = [];
  // filters: any = {}; // Agregar una propiedad para los filtros
  ref: DynamicDialogRef | undefined

  constructor(
    private messageService: MessageService,
    private productService: ProductService,
    private dialogService: DialogService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.searchForm = this.fb.group({
      query: [''],
    });

    // this.searchForm.valueChanges
    //   .pipe(debounceTime(300), distinctUntilChanged())
    //   .subscribe(() => {
    //     this.pageIndex = 0;
    //     this.searchProducts();
    //   });
  }

  ngOnInit(): void {
    this.loadProducts();
  }
  createprod() {
    this.openProductDialog(false, null);
  }
  editprod(product: Product) {
    this.openProductDialog(true, product);
  }
  onPageChange(event: any): void {
    this.pageIndex = event.first / event.rows;  // Calcula pageIndex
    this.pageSize = event.rows;  // Asigna pageSize
    this.loadProducts();
  }

  
  private openProductDialog(isEditing: boolean, product: Product | null) {
    const isMobile = window.innerWidth < 480;

    this.ref = this.dialogService.open(ProductFormComponent, {
      header: isEditing ? 'Editar Producto' : 'Nuevo Producto',
      height: isMobile ? 'auto' : 'auto',
      style: {
        'max-width': isMobile ? '110vw' : 'auto',
        'max-height': isMobile ? 'auto' : '100vh',
        padding: '0', // Aquí estableces el padding a 0
      },
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '100vw',
      },
      data: { product: product }, // Pasando el objeto product dentro de un objeto con la propiedad 'product'
    });
  }
  searchProducts(): void {
    // this.pageIndex = 0;
    this.loadProducts();
  }
  loadProducts(): void {
    const skip = this.pageIndex * this.pageSize;
    const limit = this.pageSize;
  
    const filters = {
      name: this.searchForm.value.query,
      // Otros campos de filtrado que recolectes de la vista
      priceMin: this.searchForm.value.priceMin,
      priceMax: this.searchForm.value.priceMax,
      category: this.searchForm.value.category,
      maker: this.searchForm.value.maker,
    };
  
    this.productService
      .getProducts()
      .subscribe((data: Product[]) => {
        this.productos = data;
      });
  }

  
  showVariantDetails(variants: any[]) {
    console.log("Variant Details:", variants);
    this.selectedVariants = variants;
    this.displayVariantModal = true; // Assuming you have a modal bound to this variable.
  }

}
