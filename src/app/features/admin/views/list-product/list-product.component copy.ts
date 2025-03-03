// import { Component, OnInit, HostListener } from '@angular/core';
// import { Router } from '@angular/router';
// import { ProductService } from '../../../public/services/product.service';
// import { CommonModule } from '@angular/common';
// import { TableModule } from 'primeng/table';
// import { PanelModule } from 'primeng/panel';
// import { HttpClientModule } from '@angular/common/http';
// import { ProgressSpinnerModule } from 'primeng/progressspinner';
// import { ProgressBarModule } from 'primeng/progressbar';
// import { ButtonModule } from 'primeng/button';
// import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { DialogModule } from 'primeng/dialog';
// import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';
// import { DropdownModule } from 'primeng/dropdown';
// import { DividerModule } from 'primeng/divider';
// import { InputTextModule } from 'primeng/inputtext';
// const PRIMECOMPONENTS = [InputTextModule,
//   DialogModule, ButtonModule, ProgressBarModule, ProgressSpinnerModule,
//   PanelModule, TableModule, ToastModule,DropdownModule,DividerModule
// ];

// @Component({
//   selector: 'app-list-product',
//   standalone: true,
//   imports: [
//     ...PRIMECOMPONENTS,
//     CommonModule,
//     HttpClientModule,ReactiveFormsModule,FormsModule
//   ],
//   providers: [ProductService, MessageService],
//   templateUrl: './list-product.component.html',
//   styleUrls: ['./list-product.component.scss']
// })
// export class ListProductComponent implements OnInit {
//   products: any[] = [];
//   isMobile: boolean = false;
//   loading: boolean = true;
//   displayEditDialog = false;
//   displayCreateDialog = false;
//   selectedProduct: any = null;

//   editForm!: FormGroup;
//   createForm!: FormGroup;
//   value: string="";

//   constructor(
//     private productService: ProductService,
//     private router: Router,
//     private fb: FormBuilder,
//     private messageService: MessageService
//   ) {}
//   availabilityOptions: any[] = [
//     { name: 'Available', value: 'available' },
//     { name: 'Out of Stock', value: 'out_of_stock' },
//     { name: 'Pre-Order', value: 'pre_order' }
//   ];
//   categorys: any[] = [
//     { name: 'Pasteles', value: 'Pasteles' },
//     { name: 'Postres', value: 'Postres' },
//     { name: 'Panaderia', value: 'Panaderia' },
//     { name: 'Galletas', value: 'Galletas' }
//   ];
//   ngOnInit(): void {
//     this.initForms();
//     this.fetchProducts();
//     this.updateDeviceType();
//     window.addEventListener('resize', this.updateDeviceType.bind(this));
//   }

//   private initForms(): void {
//     this.editForm = this.fb.group({
//       name: ['', [Validators.required, Validators.minLength(3)]],
//       ingredientes: ['', [Validators.required, Validators.minLength(3)]],
//       description: ['', [Validators.required, Validators.minLength(3)]],
//       price: [0, [Validators.required, Validators.min(0)]],
//       stock: [0, [Validators.required, Validators.min(0)]],
//       image: ['', [Validators.required]],
//       variants: this.fb.array([]) // Agregamos variantes como un array
//     });

//     this.createForm = this.fb.group({
//       name: ['', [Validators.required, Validators.minLength(3)]],
//       // brand: ['', Validators.required],
//       category: ['', Validators.required],
//       material: ['', Validators.required],
//       description: ['', Validators.maxLength(500)],
//       availabilityStatus: ['available', Validators.required],
//       variants: this.fb.array([])
//     });
//   }
//   loadProductData(product: any): void {
//     console.log("product", product);
  
//     this.editForm.patchValue({
//       name: product.name,
//       category: product.category,
//       ingredientes: product.ingredientes,
//       description: product.description,
//       availabilityStatus: product.availabilityStatus
//     });
  
//     // Obtener el FormArray de variantes y limpiarlo
//     const variantFormArray = this.editForm.get('variants') as FormArray;
//     variantFormArray.clear(); 
  
//     // Agregar variantes solo si existen
//     if (product.variants && product.variants.length > 0) {
//       product.variants.forEach((variant: any) => {
//         variantFormArray.push(this.createVariantForm(variant));
//       });
//     } else {
//       console.warn("No hay variantes disponibles para este producto");
//     }
  
//     this.editForm.setControl('variants', variantFormArray);
//   }
  
//   private createVariantForm(variant: any = {}): FormGroup {
//     return this.fb.group({
//       flavor: [variant.flavor || '', Validators.required],
//       color: [variant.color || '', Validators.required],
//       texture: [variant.texture || '', Validators.required],
//       shape: [variant.shape || '', Validators.required],
//       description: [variant.description || '', Validators.required],
//       sizeStock: this.fb.array(variant.sizeStock ? variant.sizeStock.map((size: any) => this.createSizeStockForm(size)) : [])
//     });
//   }
  
  
//   private createSizeStockForm(size: any = {}): FormGroup {
//     return this.fb.group({
//       size: [size.size || '', Validators.required],
//       stock: [size.stock || 0, [Validators.required, Validators.min(0)]],
//       price: [size.price || 0, [Validators.required, Validators.min(0)]]
//     });
//   }
  
//   getVariants(): FormArray {
//     return this.editForm.get('variants') as FormArray;
//   }
  
  
//   private fetchProducts(): void {
//     this.loading = true;
//     this.productService.getProducts().subscribe({
//       next: (data: any) => {
//         console.log(this.products)        
//         this.products = data;
//         this.loading = false;
//       },
//       error: () => {
//         this.loading = false;
//         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los productos.' });
//       }
//     });
//   }

//   @HostListener('window:resize', ['$event'])
//   onResize(): void {
//     this.updateDeviceType();
//   }

//   private updateDeviceType(): void {
//     this.isMobile = window.innerWidth < 768;
//   }
//   // private initForms(): void {

//   // }
  
//   editProduct(product: any): void {
//     this.selectedProduct = product;
//     console.log(this.selectedProduct)
//     // // Limpiamos variantes antes de agregar nuevas
//     // this.editForm.setControl('variants', this.fb.array([]));
  
//     // // Creamos una lista de variantes con sus tamaños
//     // const variantsArray = this.editForm.get('variants') as FormArray;
//     // product.variants.forEach((variant: any) => {
//     //   const variantGroup = this.fb.group({
//     //     color: [variant.color || '', Validators.required],
//     //     texture: [variant.texture || ''],
//     //     sizeStock: this.fb.array([])
//     //   });
  
//     //   // Añadir los tamaños del producto
//     //   const sizeStockArray = variantGroup.get('sizeStock') as FormArray;
//     //   variant.sizeStock.forEach((sizeStock: any) => {
//     //     sizeStockArray.push(this.fb.group({
//     //       size: [sizeStock.size || '', Validators.required],
//     //       stock: [sizeStock.stock || 0, [Validators.required, Validators.min(0)]],
//     //       price: [sizeStock.price || 0, [Validators.required, Validators.min(0)]]
//     //     }));
//     //   });
  
//     //   // Añadir la variante al array de variantes
//     //   variantsArray.push(variantGroup);
//     // });
  
//     // // Seteamos los valores básicos
//     // this.editForm.patchValue({
//     //   name: product.name,
//     //   ingredientes: product.ingredientes,
//     //   description: product.description,
//     //   price: product.variants[0]?.sizeStock[0]?.price || 0,
//     //   stock: product.variants[0]?.sizeStock[0]?.stock || 0,
//     //   image: product.variants[0]?.images[0] || ''
//     // });
//     this.loadProductData(this.selectedProduct);

//     this.displayEditDialog = true;
//   }
  

//   saveProduct(): void {
//     if (this.editForm.valid) {
//       const updatedProduct = { ...this.selectedProduct, ...this.editForm.value };
//       // this.productService.updateProduct(updatedProduct).subscribe({
//       //   next: () => {
//       //     this.fetchProducts();
//           this.messageService.add({ severity: 'success', summary: 'Producto actualizado', detail: 'El producto se ha actualizado correctamente.' });
//       //   },
//       //   error: () => {
//       //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el producto.' });
//       //   }
//       // });
//       this.displayEditDialog = false;
//     }
//   }

//   openCreateDialog(): void {
//     this.createForm.reset();
//     this.displayCreateDialog = true;
//   }

//   createProduct(): void {
//     if (this.createForm.valid) {
//       const newProduct = this.createForm.value;
//       // this.productService.createProduct(newProduct).subscribe({
//       //   next: () => {
//       //     this.fetchProducts();
//           this.messageService.add({ severity: 'success', summary: 'Producto Creado', detail: 'El producto se ha agregado correctamente.' });
//       //     this.displayCreateDialog = false;
//       //   },
//       //   error: () => {
//       //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el producto.' });
//       //   }
//       // });
//     }
//   }

//   deleteProduct(productId: string): void {
//     if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
//       // this.productService.deleteProduct(productId).subscribe({
//       //   next: () => {
//       //     this.products = this.products.filter(product => product.id !== productId);
//           this.messageService.add({ severity: 'info', summary: 'Producto Eliminado', detail: 'El producto se ha eliminado correctamente.' });
//       //   },
//       //   error: () => {
//       //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el producto.' });
//       //   }
//       // });
//     }
//   }

//   // Obtener variantes como FormArray
//   get variants(): FormArray {
//     return this.createForm.get('variants') as FormArray;
//   }

//   addVariant(): void {
//     this.variants.push(this.fb.group({
//       sizeStock: this.fb.array([]),
//       images: this.fb.array([], Validators.required)
//     }));
//   }

//   removeVariant(index: number): void {
//     this.variants.removeAt(index);
//   }

//   getSizeStockControls(variantIndex: number): FormArray {
//     return this.variants.at(variantIndex).get('sizeStock') as FormArray;
//   }
//     closeDialog() {
//     this.displayEditDialog = false;
//   }

//   addSizeStock(variantIndex: number): void {
//     const sizeStockGroup = this.fb.group({
//       size: [null, [Validators.required, Validators.min(1)]],
//       stock: [null, [Validators.required, Validators.min(0)]],
//       price: [null, [Validators.required, Validators.min(0)]],
//       availabilityStatus: ['available', Validators.required]
//     });
//     this.getSizeStockControls(variantIndex).push(sizeStockGroup);
//   }

//   removeSizeStock(variantIndex: number, sizeIndex: number): void {
//     this.getSizeStockControls(variantIndex).removeAt(sizeIndex);
//   }
// }
