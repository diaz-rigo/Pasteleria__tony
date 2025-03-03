// import { ChangeDetectorRef, Component, Input } from '@angular/core';
// import { DialogModule } from 'primeng/dialog';
// import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';
// import { DropdownModule } from 'primeng/dropdown';
// import { DividerModule } from 'primeng/divider';
// import { InputTextModule } from 'primeng/inputtext';
// import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { IconFieldModule } from 'primeng/iconfield';
// import { InputIconModule } from 'primeng/inputicon';
// import { TableModule } from 'primeng/table';
// import { PanelModule } from 'primeng/panel';
// import { ButtonModule } from 'primeng/button';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Product } from '../../../../../shared/models/producto.model';
// import { Router } from '@angular/router';
// import { ProductService } from '../../../../public/services/product.service';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
// import { UploadService } from '../../../../../core/services/upload.service';
// import { ListProductComponent } from '../list-product.component';
// const PRIMECOMPONENTS = [InputIconModule, IconFieldModule, InputTextModule,
//   DialogModule, ButtonModule,
//   PanelModule, TableModule, ToastModule, DropdownModule, DividerModule,DropdownModule
// ];

// @Component({
//   selector: 'app-product-form',
//   standalone: true,
//   imports: [
//     ...PRIMECOMPONENTS,
//     CommonModule,
//     HttpClientModule, ReactiveFormsModule, FormsModule, ProductFormComponent
//   ],
//   templateUrl: './product-form.component.html',
//   // styleUrl: './product-form.component.scss'
//   providers:[UploadService],
//   styleUrls: ['./product-form.component.scss', './file.scss'],

// })
// export class ProductFormComponent {
//   isEditing: boolean = false
//   productForm!: FormGroup
//   @Input() product!: Product
//   fileNames: {
//     [key: number]: {
//       images: { src: string; file: File | null }[];
      
//     }
//   } = {};
//   availabilityOptions: any[];
//   temporaryImages: {
//     [key: number]: {
//       images: { src: string; file: File | null }[];
      
//     }
//   } = {};
//   variantesImages: Array<{ url: string, file: File | null }> = [];

//   get variants(): FormArray {
//     return this.productForm.get('variants') as FormArray
//   }
//   getSizeStockArray(variant: AbstractControl): FormArray {
//     return variant.get('sizeStock') as FormArray;
//   }
//   constructor(
//     private listProductComponent:ListProductComponent,
//     private router: Router,
//     public config: DynamicDialogConfig,
//     private formBuilder: FormBuilder,
//     private dialogRef: DynamicDialogRef,
//     private uploadService: UploadService,
//     private productService: ProductService,
//     private cdr: ChangeDetectorRef, // Add ChangeDetectorRef
//     private ngxService: NgxUiLoaderService, private messageService: MessageService,

//   ) {
//     this.product = this.config.data.product; // Obtener el producto de los datos del diálogo
//     this.availabilityOptions = [
//       { label: 'Disponible', value: 'available' },
//       { label: 'Bajo demanda', value: 'on_demand' },
//       { label: 'Agotado', value: 'out_of_stock' }
//     ];
//   }
//   categorys: any[] = [
//     { name: 'Pasteles', value: 'Pasteles' },
//     { name: 'Postres', value: 'Postres' },
//     { name: 'Panaderia', value: 'Panaderia' },
//     { name: 'Galletas', value: 'Galletas' }
//   ];
//   ngOnInit(): void {
//     this.productForm = this.createProductForm()
//     if (this.product) {
//       this.isEditing = true
//       this.initializeFormWithProductData(this.product)
//     } else {
//       console.warn('No se han proporcionado datos del producto.')
//     }
//   }

  
//   idproducEDIT: string = ''
//   addVariant() {
//     const variantIndex = this.variants.length
//     this.variants.push(this.createVariant())
//     this.fileNames[variantIndex] = { images: [],  } // Initialize fileNames
//     this.productForm.markAsDirty()
//     this.productForm.updateValueAndValidity()
//     this.cdr.detectChanges() // Trigger change detection
//   }

//   createProductForm(): FormGroup {
//     return this.formBuilder.group({
//       name: ['', Validators.required],
//       description: [''],
//       brand: ['', Validators.required],
//       ingredientes: ['', Validators.required],
//       category: ['', Validators.required],
//       availabilityStatus: ['', Validators.required]  // Campo para el estado de disponibilidad
// ,
//       variants: this.formBuilder.array([]),
//     })
//   }
//   initializeFormWithProductData(product: Product): void {
//     this.idproducEDIT = product._id;
//     this.productForm.patchValue({
//       name: product.name,
//       description: product.description,
//       availabilityStatus: product.availabilityStatus,
//       ingredientes: product.ingredientes,
//       category: product.category,
//     });
  
//     this.variants.clear(); // Limpia cualquier variante previamente añadida
  
//     product.variants.forEach((variant, i) => {
//       const variantForm = this.createVariant();
  
//       variantForm.patchValue({
//         flavor: variant.flavor,
//         color: variant.color,
//         shape: variant.shape,
//         texture: variant.texture,
//         description: variant.description,
//       });
  
//       const sizeStockArray = variantForm.get('sizeStock') as FormArray;
//       sizeStockArray.clear();
  
//       // Rellenar el array con los datos del producto
//       variant.sizeStock.forEach((sizeStock) => {
//         const sizeStockGroup = this.createSizeStock();
//         sizeStockGroup.patchValue(sizeStock);
//         sizeStockArray.push(sizeStockGroup);
//       });
  
//       this.variants.push(variantForm);
  
//       // Inicializar imágenes y texturas (verifica que haya imágenes antes de mapear)
//       this.fileNames[i] = {
//         images: variant.images && Array.isArray(variant.images) && variant.images.length > 0 
//           ? variant.images.map((image) => ({ src: image, file: null }))
//           : []  // Si no hay imágenes, asigna un arreglo vacío
//       };
  
//       // Establecer las imágenes en el FormArray de imágenes
//       variantForm.get('images')?.setValue(this.fileNames[i].images.map(img => img.src));
//     });
//   }
//   onFileSelected(event: any, variantIndex: number, field: string): void {
//     const files: FileList = event.target.files

//     if (!files || files.length === 0) {
//       console.error('Error: No se han seleccionado archivos')
//       return
//     }

//     if (field === 'images') {
//       this.fileNames[variantIndex].images = []
//       for (let i = 0; i < files.length; i++) {
//         const file: File = files[i]

//         if (!this.isValidFileType(file)) {
//           console.error(
//             'Error: Tipo de archivo no válido. Solo se permiten imágenes.',
//           )
//           continue
//         }

//         this.fileNames[variantIndex].images.push({
//           src: URL.createObjectURL(file),
//           file: file,
//         })
//       }
//       this.variants
//         .at(variantIndex)
//         .get('images')
//         ?.setValue(
//           this.fileNames[variantIndex].images.map((image) => image.file),
//         )
//     }
//   }

  

  
//   createVariant(): FormGroup {
//     return this.formBuilder.group({
//       images: [null], // Asegúrate de que este campo esté en el formulario si se necesita
//       color: ['', Validators.required],
//       flavor: ['', Validators.required],
//       shape: ['', Validators.required],
//       texture: ['', Validators.required],
//       description: ['', Validators.required],
//       sizeStock: this.formBuilder.array([this.createSizeStock()]),
//     });
//   }
  
  

//   createSizeStock(): FormGroup {
//     return this.formBuilder.group({
//       size: [0, Validators.required],
//       stock: [0, Validators.required],
//       price: [0, Validators.required],
//     })
//   }

  
  
  

  
  
//   isValidFileType(file: File): boolean {
//     const allowedMimeTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//     return allowedMimeTypes.includes(file.type);
//   }






//   agregarProducto() {
//     console.log(this.productForm.value)
//     // if (this.productForm.valid) {
//       const imageFiles: File[] = []
//       this.ngxService.start()
//       // Recopilar archivos de imágenes y texturas para cada variante
//       this.variants.controls.forEach((variantControl) => {
//         const imagesControl = variantControl.get('images')
//         // const textureControl = variantControl.get('texture')

//         if (imagesControl && imagesControl.value) {
//           imageFiles.push(...imagesControl.value)
//         }
//       })

//       if (imageFiles.length > 0) {
//         this.uploadService.uploadImages(imageFiles).subscribe(
//           (imageData: string[] | { images: string[] }) => {
//             imageData = Array.isArray(imageData) ? imageData : imageData.images
//             this.assignUrlsToVariants(imageData, 'images')
//             console.log(imageData)


//               const productData = this.getFilteredProductData()
//               console.log(productData)
//               this.ngxService.stop()

//               this.createProductWithUrls(productData)
//             // }
//           },
//           (error) => {
//             console.error('Error al subir imágenes:', error)
//           },
//         )
//       } else {
//         console.error('No se encontraron imágenes para subir.')
//       }
//     // } else {
//     //   this.ngxService.stop()
//     //   console.error('Formulario no válido.')
//     // }
//   }
//   private createProductWithUrls(productData: any) {
//     console.log(productData)
//     // Enviar los datos del producto al servicio para su creación
//     this.productService.createProduct(productData).subscribe(
//       (response) => {
//         console.log('Producto creado exitosamente:', response)
//         this.router.navigate(['/admin/product'])
//         this.dialogRef.close()
//         this.listProductComponent.loadProducts()
//       },
//       (error) => {
//         console.error('Error al crear el producto:', error)
//       },
      
//     )
//     this.ngxService.stop()

//   }
//   private assignUrlsToVariants(urls: string[], field: string) {
//     let urlIndex = 0

//     this.variants.controls.forEach((variantControl) => {
//       const variant = variantControl.value

//       if (field === 'images') {
//         const numImages = variantControl.get('images')?.value.length
//         // Reemplazar los archivos con las URLs de las imágenes subidas
//         variant.images = urls.slice(urlIndex, urlIndex + numImages)
//         urlIndex += numImages
//       } 
//     })
//   }
//   EDITARProducto() {
//     this.ngxService.start();
//     const productData: Product = this.productForm.value;
//     console.log(productData);
//     let imageFiles: File[] = [];
//     let variantsWithFiles: any[] = [];
    
//     // Recorrer todas las variantes y almacenar las imágenes que se deben subir
//     this.variants.controls.forEach((variantControl, index) => {
//       const imagesControl = variantControl.get('images') as FormArray;
//       console.log(imagesControl);
      
//       if (imagesControl && imagesControl.value && imagesControl.value.length > 0) {
//         let newImages: any[] = [];
        
//         // Recorrer las imágenes y añadirlas a los archivos a subir
//         imagesControl.value.forEach((img: any) => {
//           if (img instanceof File) {  // ✅ Asegurar que se detectan archivos
//             imageFiles.push(img);
//             newImages.push(img);
//           }
//         });
  
//         // Si hay nuevas imágenes, las asociamos con la variante
//         if (newImages.length > 0) {
//           variantsWithFiles.push({ index, newImages });
//         }
//       }
//     });
  
//     console.log('🔹 Imágenes detectadas para subir:', imageFiles);
  
//     // Si hay imágenes para subir, hacer la llamada al servicio de subida
//     if (imageFiles.length > 0) {
//       this.uploadService.uploadImages(imageFiles).subscribe(
//         (uploadedUrls: string[] | { images: string[] }) => {
//           uploadedUrls = Array.isArray(uploadedUrls) ? uploadedUrls : uploadedUrls.images;
  
//           console.log('✅ Imágenes subidas con éxito:', uploadedUrls);
  
//           // Asignar las URLs subidas a las variantes
//           this.assignUploadedUrlsToVariants(variantsWithFiles, uploadedUrls);
  
//           // Enviar los datos actualizados del producto a la API
//           const productData = this.getFilteredProductData_();
//           console.log('📌 Datos del producto a actualizar:', productData);
//           this.updateProduct(productData);
//         },
//         (error) => {
//           console.error('❌ Error al subir imágenes:', error);
//           this.ngxService.stop();
//         }
//       );
//     } else {
//       console.warn('⚠️ No hay imágenes nuevas para subir.');
//       const productData = this.getFilteredProductData_();
//       console.log('📌 Datos del producto a actualizar:', productData);
//       this.updateProduct(productData);
//     }
//   }
  
  
//   assignUploadedUrlsToVariants(variantsWithFiles: any[], uploadedUrls: string[]) {
//     variantsWithFiles.forEach((variantWithFile, index) => {
//       const variantIndex = variantWithFile.index;
//       const newImages = variantWithFile.newImages;
  
//       // Asignar las URLs a las imágenes de la variante
//       newImages.forEach((image: any, i: number) => {
//         image.src = uploadedUrls[i]; // Asignamos la URL subida a cada imagen
//       });
  
//       // Actualizamos el FormArray de la variante
//       const imagesControl = this.variants.controls[variantIndex].get('images') as FormArray;
//       imagesControl.setValue(newImages);
//     });
//   }
  
  
  
  
  
//   getFilteredProductData_() {
//     const productData = this.productForm.value;
  
//     productData.variants = productData.variants.map((variant: any) => ({
//       ...variant,
//       images: Array.isArray(variant.images) 
//         ? variant.images.filter((img: any) => typeof img === 'string') 
//         : [], // 🔹 Si no es un array, asigna un array vacío
//     }));
  
//     return productData;
//   }
  

//   /**
//    * Función para quitar imagen correctamente
//    */
//   removeImage(variantIndex: number, imageIndex: number, field: string, event: Event) {
//     event.preventDefault();
  
//     if (this.fileNames[variantIndex] && this.fileNames[variantIndex].images) {
//       this.fileNames[variantIndex].images.splice(imageIndex, 1);
//     }
  
//     // Eliminar también del formulario reactivo
//     const variantControl = this.variants.at(variantIndex);
//     const imagesControl = variantControl.get(field);
  
//     if (imagesControl && imagesControl.value) {
//       const updatedImages = [...imagesControl.value];
//       updatedImages.splice(imageIndex, 1);
//       imagesControl.setValue(updatedImages);
//       imagesControl.markAsTouched();
//     }
  
//     console.log(`Imagen eliminada en la variante ${variantIndex}, índice ${imageIndex}`);
//   }
  
//   removeVariant(index: number): void {
//     this.variants.removeAt(index)
//     this.productForm.markAsDirty()
//     this.productForm.updateValueAndValidity()
//   }
//   private getFilteredProductData() {
//     // Filtrar y devolver los datos del producto desde el formulario
//     const productData = this.productForm.value
//     console.log("productData")
//     console.log(productData)
//     // Eliminar cualquier propiedad que no sea necesaria
//     productData.variants.forEach(
//       (variant: { imagesControl: any; }) => {
//         delete variant.imagesControl
//         // delete variant.textureControl
//       },
//     )
//     return productData
//   }
  
//   addSizeStock(variantIndex: number) {
//     const sizeStockArray = this.variants
//       .at(variantIndex)
//       .get('sizeStock') as FormArray
//     sizeStockArray.push(this.createSizeStock())
//     this.productForm.markAsDirty()
//     this.productForm.updateValueAndValidity()
//     this.cdr.detectChanges() // Trigger change detection
//   }
   
// updateProduct(productData: any) {
//   console.log("-----<<<<<>>>", productData);
//   this.productService.updateProduct(this.idproducEDIT, productData).subscribe(
//     (response) => {
//       this.ngxService.stop();
//       this.messageService.add({
//         severity: 'info',
//         summary: 'Confirmado',
//         detail: 'Producto actualizado exitosamente',
//       });

//       setTimeout(() => {
//         this.dialogRef.close();
//         this.listProductComponent.loadProducts();
//       }, 2000);  // Retraso opcional para asegurar que el mensaje se muestre antes de cerrar el modal
//     },
//     (error) => {
//       this.ngxService.stop();
//       console.log(error);
//       // console.log(error);
//       this.messageService.add({
//         severity: 'error',
//         summary: 'Rechazado',
//         detail: 'Error al actualizar el producto: ' + error,
//       });
//     }
//   );
// }

// }
