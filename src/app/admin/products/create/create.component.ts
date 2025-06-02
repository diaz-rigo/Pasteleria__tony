import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Product } from '../../../shared/models/product.model';
import { Variant } from '../../../shared/models/variant.model';
import { SizeStock } from '../../../shared/models/size-stock.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
// import { ProductsComponent } from '../products.component';
// import { UploadService } from '../../../core___/services/upload.service';

import { HttpClientModule } from '@angular/common/http';
import { ProductsComponentAdmin } from '../products.component';
import { UploadService } from '../../../shared/services/upload.service';
import { ProductService } from '../../../shared/services/product.service';
import { ColoresService } from '../../../shared/services/colores.service';

// import { ProductService } from '../../../core___/services/product.service';
// import { ColoresService } from '../../../core___/services/colores.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductsComponentAdmin, HttpClientModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
  providers: [UploadService,ProductsComponentAdmin,ProductService]
})
export class CreateProductComponent {

  productlist = inject(ProductsComponentAdmin)
  router = inject(Router)
  uploadService = inject(UploadService)
  productService = inject(ProductService)
  coloresService= inject(ColoresService)
  // Producto como signal
  product: WritableSignal<Product> = signal<Product>({
    name: '',
    brand: 'pasteleria tony',
    category: '',
    ingredientes: '',
    description: '',
    isFeatured: false,
    availabilityStatus: 'available',
    variants: [this.createEmptyVariant()]
  });

  constructor() {
    console.log("Componente de creación de producto inicializado");
  }

  cancelar() {
    this.router.navigate(['/productos']);

    this.productlist.ngOnInit()
  }
  get value(): Product {
    return this.product();
  }

  // ======= VARIANTES =======
  createEmptyVariant(): Variant {
    return {
      flavor: '',
      color: '',
      texture: '',
      shape: '',
      description: '',
      availabilityStatus: 'available',
      sizeStock: [this.createEmptySize()],
      images: []
    };
  }
updateVariantColor(event: Event, index: number) {
  this.product.update(currentProduct => {
    // Ensure variants exists (though it should always exist based on your model)
    const variants = currentProduct.variants || [];
    
    return {
      ...currentProduct,
      variants: variants.map((v, i) => 
        i === index 
          ? { ...v, color: (event.target as HTMLInputElement).value } 
          : v
      )
    };
  });
}



  addVariant(): void {
    this.product.update(p => ({
      ...p,
      variants: [...(p.variants ?? []), this.createEmptyVariant()]
    }));
  }

  removeVariant(index: number): void {
    this.product.update(p => {
      const variants = [...(p.variants ?? [])];

      if (variants.length > 1 && index >= 0 && index < variants.length) {
        variants.splice(index, 1); // eliminamos el índice indicado
      }

      return { ...p, variants };
    });
  }


  // ======= TAMAÑOS Y STOCK =======
  createEmptySize(): SizeStock {
    return {
      size: 1,
      stock: 0,
      price: 0,
      availabilityStatus: 'available'
    };
  }

  addSize(variantIndex: number): void {
    this.product.update(p => {
      const variants = [...(p.variants ?? [])];

      if (variantIndex >= 0 && variantIndex < variants.length) {
        const variant = { ...variants[variantIndex] };
        variant.sizeStock = [...(variant.sizeStock ?? []), this.createEmptySize()];
        variants[variantIndex] = variant;
      }

      return { ...p, variants };
    });
  }


  removeSize(variantIndex: number, sizeIndex: number): void {
    this.product.update(p => {
      const variants = [...(p.variants ?? [])];

      if (
        variantIndex >= 0 &&
        variantIndex < variants.length &&
        variants[variantIndex].sizeStock &&
        variants[variantIndex].sizeStock.length > 1 &&
        sizeIndex >= 0 &&
        sizeIndex < variants[variantIndex].sizeStock.length
      ) {
        // Clonar el variant y su sizeStock
        const variant = { ...variants[variantIndex] };
        variant.sizeStock = [...(variant.sizeStock ?? [])];

        // Remover el size correspondiente
        variant.sizeStock.splice(sizeIndex, 1);

        // Reemplazar en la lista de variants
        variants[variantIndex] = variant;
      }

      return { ...p, variants };
    });
  }


  // ======= IMÁGENES =======
  onFileSelected(event: any, variantIndex: number): void {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    const product = this.product();
    const variants = [...(product.variants ?? [])];

    // Validación defensiva
    if (variantIndex < 0 || variantIndex >= variants.length) return;

    const variant = { ...variants[variantIndex] };

    // Aseguramos que `images` existe
    variant.images = [...(variant.images ?? [])];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        variant.images!.push(e.target.result);

        // Actualizamos la copia de variants con el nuevo variant modificado
        variants[variantIndex] = variant;

        this.product.update(p => ({
          ...p,
          variants
        }));
      };
      reader.readAsDataURL(files[i]);
    }
  }


  removeImage(variantIndex: number, imageIndex: number): void {
    const product = this.product();
    const variants = [...(product.variants ?? [])];

    if (variantIndex < 0 || variantIndex >= variants.length) return;

    // Hacemos copia profunda solo del variant que toca para no mutar original
    const variant = { ...variants[variantIndex] };

    // Asegurar que images exista
    variant.images = [...(variant.images ?? [])];

    if (imageIndex < 0 || imageIndex >= variant.images.length) return;

    variant.images.splice(imageIndex, 1);

    // Actualizamos la variante en la copia del array
    variants[variantIndex] = variant;

    // Actualizamos el signal
    this.product.update(p => ({
      ...p,
      variants
    }));
  }


  // ======= PRODUCTO DESTACADO =======
  get isFeatured(): boolean {
    return this.product().isFeatured ?? false;
  }

  set isFeatured(value: boolean) {
    this.product.update(p => ({ ...p, isFeatured: value }));
  }

  // ======= SUBMIT =======

async onSubmit(): Promise<void> {
  try {

    // 1. Subir imágenes primero
    const productWithUploadedImages = await this.uploadAllImages();
console.log("productWithUploadedImages",productWithUploadedImages)
    // 2. Enviar el producto completo al backend
    this.productService.createProduct(productWithUploadedImages)
      .subscribe({
        next: (createdProduct) => {
          console.log('Producto creado exitosamente:', createdProduct);
          this.router.navigate(['/productos']);
          // Opcional: resetear el formulario o mostrar mensaje de éxito
        },
        error: (error) => {
          console.error('Error al crear el producto:', error);
          // Manejar el error (mostrar mensaje al usuario)
        }
      });

  } catch (error) {
    console.error('Error en el proceso de submit:', error);
    // Manejar el error (mostrar mensaje al usuario)
  }
}

private async uploadAllImages(): Promise<Product> {
  const productCopy = JSON.parse(JSON.stringify(this.product()));
  
  for (let variantIndex = 0; variantIndex < productCopy.variants.length; variantIndex++) {
    const variant = productCopy.variants[variantIndex];
    
    if (variant.images && variant.images.length > 0) {
      const imagesToUpload = variant.images.filter((img: string) => img.startsWith('data:'));
      
      if (imagesToUpload.length > 0) {
        try {
          const files = await this.dataUrlsToFiles(imagesToUpload, variantIndex);
          const uploadResponse = await this.uploadService.uploadImages(files).toPromise();
          
          // Reemplazar data URLs por las URLs de Cloudinary
          let uploadedIndex = 0;
          variant.images = variant.images.map((img: string) => 
            img.startsWith('data:') ? (uploadResponse?.images[uploadedIndex++] || img) : img
          );
        } catch (error) {
          console.error(`Error subiendo imágenes para variante ${variantIndex}:`, error);
          throw error;
        }
      }
    }
  }
  
  return productCopy;
}

  // Método para convertir data URLs a archivos (Files)
  private async dataUrlsToFiles(dataUrls: string[], variantIndex: number): Promise<File[]> {
    const files: File[] = [];

    for (let i = 0; i < dataUrls.length; i++) {
      const dataUrl = dataUrls[i];

      // Verificar si es una data URL (previa a la subida)
      if (dataUrl.startsWith('data:')) {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `variant-${variantIndex}-image-${i}`, { type: blob.type });
        files.push(file);
      }
    }

    return files;
  }


  // Función para aclarar el color (para el fondo del contenido)
lightenColor(color: string, percent: number): string {
return this.coloresService.lightenColor(color,percent);
}

// Función para oscurecer el color (para bordes)
darkenColor(color: string, percent: number): string {
  // Implementación de la función para oscurecer colores
  return this.coloresService.darkenColor(color,percent);
  // return this.coloresService.darkenColor(color,percent);
  // ...
}

// Función para obtener color de contraste adecuado (para texto)
getContrastColor(hexColor: string): string {
  return this.coloresService.getContrastColor(hexColor);
  // Implementación para determinar si usar texto blanco o negro
  // ...
}


}
