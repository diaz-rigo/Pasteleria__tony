// import { Component, inject, signal, WritableSignal } from '@angular/core';
// import { Product } from '../../../shared/models/product.model';
// import { Variant } from '../../../shared/models/variant.model';
// import { SizeStock } from '../../../shared/models/size-stock.model';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { ProductsComponent } from '../products.component';
// import { UploadService } from '../../../core/services/upload.service';
// import { HttpClientModule } from '@angular/common/http';

// @Component({
//   selector: 'app-create',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule,ProductsComponent,HttpClientModule],
//   templateUrl: './create.component.html',
//   styleUrl: './create.component.css',
//   providers:[UploadService]
// })
// export class CreateProductComponent {

//   productlist=inject(ProductsComponent)
//   router=inject(Router)
//   uploadService=inject(UploadService)
//   // Producto como signal
//   product: WritableSignal<Product> = signal<Product>({
//     name: '',
//     brand: '',
//     category: '',
//     ingredientes: '',
//     description: '',
//     isFeatured: false,
//     availabilityStatus: 'available',
//     variants: [this.createEmptyVariant()]
//   });

//   constructor() {
//     console.log("Componente de creación de producto inicializado");
//   }

//   cancelar()
//   {
//         this.router.navigate(['/productos']);

//     this.productlist.ngOnInit()
//   }
//   get value(): Product {
//     return this.product();
//   }

//   // ======= VARIANTES =======
//   createEmptyVariant(): Variant {
//     return {
//       flavor: '',
//       color: '',
//       texture: '',
//       shape: '',
//       description: '',
//       availabilityStatus: 'available',
//       sizeStock: [this.createEmptySize()],
//       images: []
//     };
//   }

//   addVariant(): void {
//     this.product.update(p => ({
//       ...p,
// variants: [...(p.variants ?? []), this.createEmptyVariant()]
//     }));
//   }

// removeVariant(index: number): void {
//   this.product.update(p => {
//     const variants = [...(p.variants ?? [])]; // aseguramos que sea un array

//     if (variants.length > 1 && index >= 0 && index < variants.length) {
//       variants.splice(index, 1); // eliminamos el índice indicado
//     }

//     return { ...p, variants };
//   });
// }


//   // ======= TAMAÑOS Y STOCK =======
//   createEmptySize(): SizeStock {
//     return {
//       size: 1,
//       stock: 0,
//       price: 0,
//       availabilityStatus: 'available'
//     };
//   }

// addSize(variantIndex: number): void {
//   this.product.update(p => {
//     const variants = [...(p.variants ?? [])];

//     if (variantIndex >= 0 && variantIndex < variants.length) {
//       const variant = { ...variants[variantIndex] };
//       variant.sizeStock = [...(variant.sizeStock ?? []), this.createEmptySize()];
//       variants[variantIndex] = variant;
//     }

//     return { ...p, variants };
//   });
// }


// removeSize(variantIndex: number, sizeIndex: number): void {
//   this.product.update(p => {
//     const variants = [...(p.variants ?? [])];

//     if (
//       variantIndex >= 0 &&
//       variantIndex < variants.length &&
//       variants[variantIndex].sizeStock &&
//       variants[variantIndex].sizeStock.length > 1 &&
//       sizeIndex >= 0 &&
//       sizeIndex < variants[variantIndex].sizeStock.length
//     ) {
//       // Clonar el variant y su sizeStock
//       const variant = { ...variants[variantIndex] };
//     variant.sizeStock = [...(variant.sizeStock ?? [])];
      
//       // Remover el size correspondiente
//       variant.sizeStock.splice(sizeIndex, 1);

//       // Reemplazar en la lista de variants
//       variants[variantIndex] = variant;
//     }

//     return { ...p, variants };
//   });
// }


//   // ======= IMÁGENES =======
// onFileSelected(event: any, variantIndex: number): void {
//   const files: FileList = event.target.files;
//   if (!files || files.length === 0) return;

//   const product = this.product();
//   const variants = [...(product.variants ?? [])];

//   // Validación defensiva
//   if (variantIndex < 0 || variantIndex >= variants.length) return;

//   const variant = { ...variants[variantIndex] };

//   // Aseguramos que `images` existe
//   variant.images = [...(variant.images ?? [])];

//   for (let i = 0; i < files.length; i++) {
//     const reader = new FileReader();
//     reader.onload = (e: any) => {
//       variant.images!.push(e.target.result);

//       // Actualizamos la copia de variants con el nuevo variant modificado
//       variants[variantIndex] = variant;

//       this.product.update(p => ({
//         ...p,
//         variants
//       }));
//     };
//     reader.readAsDataURL(files[i]);
//   }
// }


// removeImage(variantIndex: number, imageIndex: number): void {
//   const product = this.product();
//   const variants = [...(product.variants ?? [])];

//   if (variantIndex < 0 || variantIndex >= variants.length) return;

//   // Hacemos copia profunda solo del variant que toca para no mutar original
//   const variant = { ...variants[variantIndex] };

//   // Asegurar que images exista
//   variant.images = [...(variant.images ?? [])];

//   if (imageIndex < 0 || imageIndex >= variant.images.length) return;

//   variant.images.splice(imageIndex, 1);

//   // Actualizamos la variante en la copia del array
//   variants[variantIndex] = variant;

//   // Actualizamos el signal
//   this.product.update(p => ({
//     ...p,
//     variants
//   }));
// }


//   // ======= PRODUCTO DESTACADO =======
//   get isFeatured(): boolean {
//     return this.product().isFeatured ?? false;
//   }

//   set isFeatured(value: boolean) {
//     this.product.update(p => ({ ...p, isFeatured: value }));
//   }

//   // ======= SUBMIT =======

// async onSubmit(): Promise<void> {
//   try {
//     // 1. Preparar todas las promesas de subida de imágenes
//     const uploadPromises: Promise<void>[] = [];
    
//     // Creamos una copia del producto para no modificar el estado directamente
//     const productCopy = JSON.parse(JSON.stringify(this.product()));

//     // Procesar cada variante
//     for (let variantIndex = 0; variantIndex < productCopy.variants.length; variantIndex++) {
//       const variant = productCopy.variants[variantIndex];
      
//       if (variant.images && variant.images.length > 0) {
//         // Filtrar solo las imágenes que son data URLs (las nuevas por subir)
//         const imagesToUpload = variant.images.filter((img: string) => img.startsWith('data:'));
        
//         if (imagesToUpload.length > 0) {
//           // Convertir data URLs a archivos
//           const files = await this.dataUrlsToFiles(imagesToUpload, variantIndex);
          
//           // Crear promesa para subir estas imágenes
//           const uploadPromise = this.uploadService.uploadImages(files)
//             .toPromise()
//             .then(response => {
//               // Reemplazar solo las imágenes que se subieron (mantener las que ya eran URLs)
//               const uploadedImages = variant.images.map((img: string) => 
//                 img.startsWith('data:') ? (response?.images.shift() || img) : img
//               );
              
//               // Actualizar la copia del producto
//               productCopy.variants[variantIndex].images = uploadedImages;
//             })
//             .catch(error => {
//               console.error(`Error subiendo imágenes para variante ${variantIndex}:`, error);
//               throw error; // Propagar el error
//             });
          
//           uploadPromises.push(uploadPromise);
//         }
//       }
//     }

//     // 2. Esperar que todas las subidas terminen
//     if (uploadPromises.length > 0) {
//       await Promise.all(uploadPromises);
//     }

//     // 3. Actualizar el producto con las nuevas URLs de imágenes
//     this.product.set(productCopy);

//     // 4. Ahora enviar el producto completo al backend
//     console.log('Producto listo para guardar:', productCopy);
//     // Ejemplo: await this.productService.createProduct(productCopy).toPromise();

//   } catch (error) {
//     console.error('Error en el proceso de submit:', error);
//     // Aquí puedes mostrar un mensaje de error al usuario
//   }
// }

// // Método para convertir data URLs a archivos (Files)
// private async dataUrlsToFiles(dataUrls: string[], variantIndex: number): Promise<File[]> {
//   const files: File[] = [];
  
//   for (let i = 0; i < dataUrls.length; i++) {
//     const dataUrl = dataUrls[i];
    
//     // Verificar si es una data URL (previa a la subida)
//     if (dataUrl.startsWith('data:')) {
//       const response = await fetch(dataUrl);
//       const blob = await response.blob();
//       const file = new File([blob], `variant-${variantIndex}-image-${i}`, { type: blob.type });
//       files.push(file);
//     }
//   }
  
//   return files;
// }
// }
