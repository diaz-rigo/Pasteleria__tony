import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Asegúrate de que esté importado en app.module.ts
import { ProductService } from '../../../public/services/product.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
const PRIMECOMPONENTS = [PanelModule,TableModule,PanelMenuModule];

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,...PRIMECOMPONENTS
  ],
  providers: [ProductService],
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {
  products: any[] = [];
  isMobile: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Obtener los productos
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data;
    });

    // Inicializar el estado del dispositivo
    this.updateDeviceType();

    // Escuchar cambios en el tamaño de la ventana
    window.addEventListener('resize', this.updateDeviceType.bind(this));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateDeviceType();
  }

  private updateDeviceType(): void {
    this.isMobile = window.innerWidth < 768; // Ajusta el ancho según tus necesidades
  }
}
