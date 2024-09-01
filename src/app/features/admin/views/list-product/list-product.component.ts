import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../public/services/product.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
import { HttpClientModule } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
const PRIMECOMPONENTS = [ButtonModule,ProgressBarModule,ProgressSpinnerModule,PanelModule, TableModule, PanelMenuModule];
@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [
    ...PRIMECOMPONENTS,
    CommonModule,
    TableModule,
    PanelModule,
    PanelMenuModule,
    HttpClientModule
  ],
  providers: [ProductService],
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {
  products: any[] = [];
  isMobile: boolean = false;
  loading: boolean = true;  // Estado de carga

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProducts();

    // Inicializar el estado del dispositivo
    this.updateDeviceType();

    // Escuchar cambios en el tamaño de la ventana
    window.addEventListener('resize', this.updateDeviceType.bind(this));
  }

  private fetchProducts(): void {
    // Indicar que los datos se están cargando
    this.loading = true;

    // Obtener los productos
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data;
      // Indicar que los datos han sido cargados
      this.loading = false;
    }, () => {
      // En caso de error, dejar de mostrar el loading
      this.loading = false;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateDeviceType();
  }

  private updateDeviceType(): void {
    this.isMobile = window.innerWidth < 768; // Ajusta el ancho según tus necesidades
  }

  editProduct(productId: string) {
    this.router.navigate([`/admin/products/edit/${productId}`]);
  }

  deleteProduct(productId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      // Lógica de eliminación del producto
    }
  }
}
