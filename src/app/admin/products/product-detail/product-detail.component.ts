import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Product } from '../../../shared/models/product.model';
import { Variant } from '../../../shared/models/variant.model';
import { SizeStock } from '../../../shared/models/size-stock.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
// import { UploadService } from '../../../core___/services/upload.service';
import { HttpClientModule } from '@angular/common/http';
// import { ProductService } from '../../../core___/services/product.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UploadService } from '../../../shared/services/upload.service';
import { ProductService } from '../../../shared/services/product.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { ColoresService } from '../../../shared/services/colores.service';
import { ProductsComponentAdmin } from '../products.component';
import { ToastService } from '../../../shared/services/toast.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { finalize } from 'rxjs';
// import { ConfirmDialogService } from '../../../core___/services/confirm-dialog.service';
// import { ProductsComponent } from '../products.component';
// import { ColoresService } from '../../../core___/services/colores.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [UploadService, ProductService, ProductsComponentAdmin]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private uploadService = inject(UploadService);
  private productService = inject(ProductService);
  private confirmDialog = inject(ConfirmDialogService); // Inyectar el servicio
  productlist = inject(ProductsComponentAdmin)
  coloresService = inject(ColoresService)
  toastService = inject(ToastService)
  loading = inject(LoadingService)
  // private loading: LoadingService
  // Estado del componente
  product = signal<Product>({
    _id: '',
    name: '',
    brand: 'pasteleria tony',
    category: '',
    ingredientes: '',
    description: '',
    isFeatured: false,
    availabilityStatus: 'available',
    variants: [this.createEmptyVariant()]
  });

  originalProduct = signal<Product>({ ...this.product() });
  isLoading = signal(false);
  showConfirmDialog = signal(false);
  confirmDialogConfig = signal({
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar'
  });

  // Computed properties
  hasUnsavedChanges = computed(() =>
    JSON.stringify(this.product()) !== JSON.stringify(this.originalProduct())
  );

  ngOnInit(): void {
    const product = history.state.product;
    if (product) {
      this.product.set(JSON.parse(JSON.stringify(product)));
      this.originalProduct.set(JSON.parse(JSON.stringify(product)));
    } else {
      // Redirigir si no hay producto
      this.router.navigate(['/admin/products']);
    }
    this.productlist.iscrear.set(true)
  }

  // ======= MÉTODOS PARA MANEJAR VARIANTES =======
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
      if (variants.length > 1) {
        variants.splice(index, 1);
      }
      return { ...p, variants };
    });
  }

  // ======= MÉTODOS PARA MANEJAR TAMAÑOS =======
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
      const variant = { ...variants[variantIndex] };
      variant.sizeStock = [...(variant.sizeStock ?? []), this.createEmptySize()];
      variants[variantIndex] = variant;
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

  // ======= MÉTODOS PARA MANEJAR IMÁGENES =======
  onFileSelected(event: any, variantIndex: number): void {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    this.product.update(p => {
      const variants = [...(p.variants ?? [])];
      const variant = { ...variants[variantIndex] };
      variant.images = [...variant.images];

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          variant.images.push(e.target.result);
          variants[variantIndex] = variant;
          this.product.update(current => ({ ...current, variants }));
        };
        reader.readAsDataURL(files[i]);
      }

      return { ...p, variants };
    });
  }
  removeImage(variantIndex: number, imageIndex: number): void {
    this.product.update(p => {
      // Garantiza que variants sea un array
      const variants = [...(p.variants ?? [])];

      // Validación de índice válido
      if (!variants[variantIndex]) return p;

      const variant = { ...variants[variantIndex] };

      // Garantiza que images sea un array
      variant.images = [...(variant.images ?? [])];

      // Validación del índice de imagen
      if (imageIndex < 0 || imageIndex >= variant.images.length) return p;

      // Remover imagen por índice
      variant.images = variant.images.filter((_, i) => i !== imageIndex);

      // Actualizar la variante en la lista de variantes
      variants[variantIndex] = variant;

      // Retornar el nuevo estado
      return { ...p, variants };
    });
  }


  // ======= MÉTODOS PARA MANEJAR PRODUCTO DESTACADO =======
  // ======= PRODUCTO DESTACADO =======
  get isFeatured(): boolean {
    return this.product().isFeatured ?? false;
  }

  set isFeatured(value: boolean) {
    this.product.update(p => ({ ...p, isFeatured: value }));
  }
  // ======= MÉTODOS PARA GUARDAR/CANCELAR =======
  // async onSubmit(): Promise<void> {
  //   try {
  //     this.isLoading.set(true);

  //     // 1. Subir imágenes nuevas primero
  //     const productWithUploadedImages = await this.uploadNewImages();

  //     // 2. Actualizar el producto en el backend
  //     this.productService.updateProduct(productWithUploadedImages._id!, productWithUploadedImages)
  //       .subscribe({
  //         next: (updatedProduct) => {
  //           this.product.set(updatedProduct);
  //           this.originalProduct.set(updatedProduct);
  //           this.isLoading.set(false);
  //           // this.router.navigate(['/productos']);
  //           // this.toastService.showSuccess('Producto Actualizado');
  //           this.loading.show({
  //             title: 'Actualizando ..',
  //             // subtitle: 'Preparando la vista',
  //             // message: 'Obteniendo información del servidor',
  //             variant: 'dots',
  //             icon: 'sync'
  //           });


  //           this.toastService.showSuccess('Producto actualizado correctamente 🎉', {
  //             actions: [{ label: 'Ver detalle', value: 'detalle', ariaLabel: 'Ir al detalle del producto' }],
  //             position: 'top-right'
  //           });
  //           this.router.navigate(['/admin/productos']);
  //           this.productlist.ngOnInit()
  //         },
  //         error: (error) => {
  //           this.loading.hide();
  //           console.error('Error al actualizar el producto:', error);
  //           this.isLoading.set(false);
  //         }
  //       }); this.loading.hide();
  //   } catch (error) {
  //     console.error('Error en el proceso de actualización:', error);
  //     this.isLoading.set(false);
  //     // this.router.navigate(['/productos']);
  //     this.router.navigate(['/admin/productos']);
  //     this.productlist.ngOnInit()
  //   }


  // }
onSubmit(): void {
  this.loading.show({
    title: 'Actualizando…',
    subtitle: 'Guardando cambios',
    message: 'Un momento, por favor',
    variant: 'dots',
    icon: 'sync'
  });

  this.uploadNewImages()
    .then(product => this.productService.updateProduct(product._id!, product))
    .then(obs => obs.pipe(
      finalize(() => this.loading.hide()) // siempre oculta
    ).subscribe({
      next: updatedProduct => {
        this.product.set(updatedProduct);
        this.originalProduct.set(updatedProduct);

        this.toastService.showSuccess('Producto actualizado correctamente 🎉', {
          actions: [{ label: 'Ver detalle', value: 'detalle', ariaLabel: 'Ir al detalle del producto' }],
          position: 'top-right'
        });

        this.router.navigate(['/admin/productos']);
        this.productlist.ngOnInit();
      },
      error: err => {
        console.error('Error al actualizar el producto:', err);
      }
    }))
    .catch(err => {
      console.error('Error subiendo imágenes:', err);
      this.loading.hide(); // por si el error ocurre antes del pipe
    });
}
  private async uploadNewImages(): Promise<Product> {
    const productCopy = JSON.parse(JSON.stringify(this.product()));

    for (let variantIndex = 0; variantIndex < productCopy.variants.length; variantIndex++) {
      const variant = productCopy.variants[variantIndex];
      const newImages = variant.images.filter((img: string) => img.startsWith('data:'));

      if (newImages.length > 0) {
        const files = await this.dataUrlsToFiles(newImages, variantIndex);
        const uploadResponse = await this.uploadService.uploadImages(files).toPromise();

        // Reemplazar data URLs por las URLs de Cloudinary
        let uploadedIndex = 0;
        variant.images = variant.images.map((img: string) =>
          img.startsWith('data:') ? (uploadResponse?.images[uploadedIndex++] || img) : img
        );
      }
    }

    return productCopy;
  }

  private async dataUrlsToFiles(dataUrls: string[], variantIndex: number): Promise<File[]> {
    const files: File[] = [];
    for (let i = 0; i < dataUrls.length; i++) {
      const dataUrl = dataUrls[i];
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `variant-${variantIndex}-image-${i}`, { type: blob.type });
      files.push(file);
    }
    return files;
  }

  async cancel(): Promise<void> {
    if (!this.hasUnsavedChanges()) {
      this.router.navigate(['/admin/productos']);
      // this.router.navigate(['/productos']);

      this.productlist.ngOnInit()
      return;
    }

    const confirmed = await this.confirmDialog.confirm({
      title: 'Descartar cambios',
      message: '¿Estás seguro de que deseas descartar los cambios?',
      confirmText: 'Descartar',
      cancelText: 'Continuar editando'
    });

    if (confirmed) {
      this.router.navigate(['/admin/products']);
    }
  }

  handleDialogResponse(confirmed: boolean): void {
    this.showConfirmDialog.set(false);
    if (confirmed) {
      this.router.navigate(['/admin/products']);
    }
  }

  async canDeactivate(): Promise<boolean> {
    if (!this.hasUnsavedChanges()) return true;

    return await this.confirmDialog.confirmUnsavedChanges('el producto actual');
  }
  cancelar() {
    this.router.navigate(['/admin/productos']);
    // this.router.navigate(['/productos']);

    this.productlist.ngOnInit()
  }



  // Función para aclarar el color (para el fondo del contenido)
  lightenColor(color: string, percent: number): string {
    return this.coloresService.lightenColor(color, percent);
  }

  // Función para oscurecer el color (para bordes)
  darkenColor(color: string, percent: number): string {
    // Implementación de la función para oscurecer colores
    return this.coloresService.darkenColor(color, percent);
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