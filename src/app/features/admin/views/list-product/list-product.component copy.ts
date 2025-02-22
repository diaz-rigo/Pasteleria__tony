// import { Component, OnInit, HostListener } from '@angular/core';
// import { Router } from '@angular/router';
// import { ProductService } from '../../../public/services/product.service';
// import { CommonModule } from '@angular/common';
// import { TableModule } from 'primeng/table';
// import { PanelMenuModule } from 'primeng/panelmenu';
// import { PanelModule } from 'primeng/panel';
// import { HttpClientModule } from '@angular/common/http';
// import { ProgressSpinnerModule } from 'primeng/progressspinner';
// import { ProgressBarModule } from 'primeng/progressbar';
// import { ButtonModule } from 'primeng/button';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { DialogModule } from 'primeng/dialog';
// const PRIMECOMPONENTS = [DialogModule,ButtonModule,ProgressBarModule,ProgressSpinnerModule,PanelModule, TableModule, PanelMenuModule];
// @Component({
//   selector: 'app-list-product',
//   standalone: true,
//   imports: [
//     ...PRIMECOMPONENTS,
//     CommonModule,
//     TableModule,
//     PanelModule,
//     PanelMenuModule,
//     HttpClientModule,ReactiveFormsModule,
//   ],
//   providers: [ProductService],
//   templateUrl: './list-product.component.html',
//   styleUrls: ['./list-product.component.scss']
// })
// export class ListProductComponent implements OnInit {
//   products: any[] = [];
//   isMobile: boolean = false;
//   loading: boolean = true;  // Estado de carga
//   editForm!: FormGroup;
//   displayEditDialog = false;
//   selectedProduct: any = null;

//   constructor(
//     private productService: ProductService,
//     private router: Router,private fb: FormBuilder){
//   // ) {}
//   // constructor(private fb: FormBuilder) {
//     this.editForm = this.fb.group({
//       name: ['', Validators.required],
//       price: [0, [Validators.required, Validators.min(0)]],
//       stock: [0, [Validators.required, Validators.min(0)]],
//       image: ['']
//     });
//   }

//   ngOnInit(): void {
//     this.fetchProducts();

//     // Inicializar el estado del dispositivo
//     this.updateDeviceType();

//     // Escuchar cambios en el tamaño de la ventana
//     window.addEventListener('resize', this.updateDeviceType.bind(this));
//   }

//   private fetchProducts(): void {
//     // Indicar que los datos se están cargando
//     this.loading = true;

//     // Obtener los productos
//     this.productService.getProducts().subscribe((data: any) => {
//       this.products = data;
//       // Indicar que los datos han sido cargados
//       this.loading = false;
//     }, () => {
//       // En caso de error, dejar de mostrar el loading
//       this.loading = false;
//     });
//   }

//   @HostListener('window:resize', ['$event'])
//   onResize(event: Event) {
//     this.updateDeviceType();
//   }

//   private updateDeviceType(): void {
//     this.isMobile = window.innerWidth < 768; // Ajusta el ancho según tus necesidades
//   }

//   editProduct(product: any) {
//     this.selectedProduct = product;
//     this.editForm.patchValue({
//       name: product.name,
//       price: product.variants[0]?.sizeStock[0]?.price || 0,
//       stock: product.variants[0]?.sizeStock[0]?.stock || 0,
//       image: product.variants[0]?.images[0] || ''
//     });
//     this.displayEditDialog = true;
//   }
//   saveProduct() {
//     if (this.selectedProduct) {
//       const index = this.products.findIndex(p => p.id === this.selectedProduct.id);
//       if (index !== -1) {
//         this.products[index].name = this.editForm.value.name;
//         this.products[index].variants[0].sizeStock[0].price = this.editForm.value.price;
//         this.products[index].variants[0].sizeStock[0].stock = this.editForm.value.stock;
//         this.products[index].variants[0].images[0] = this.editForm.value.image;
//       }
//     }
//     this.displayEditDialog = false;
//   }
//   closeDialog() {
//     this.displayEditDialog = false;
//   }
//   deleteProduct(productId: string) {
//     if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
//       // Lógica de eliminación del producto
//     }
//   }
// }
