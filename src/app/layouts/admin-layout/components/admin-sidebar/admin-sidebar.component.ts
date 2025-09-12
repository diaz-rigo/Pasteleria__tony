import { Component, EventEmitter, inject, input, Input, output, Output } from '@angular/core';
import { ProductsComponentAdmin } from '../../../../admin/products/products.component';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../../shared/services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
  , providers: [ProductsComponentAdmin, ProductService]
})
export class AdminSidebarComponent {
  // @Input() open = false;
  // @Output() close = new EventEmitter<void>();


  open = input<boolean>(false);
  close = output<void>();
  isMobile = false;
  productlist = inject(ProductsComponentAdmin)
  router = inject(Router)

  ngOnInit(): void {
    this.checkViewport();
    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobile = window.innerWidth < 768; // Tailwind's md breakpoint
    // Si no es móvil, forzar el sidebar abierto
    if (!this.isMobile) {
      this.close.emit(); // Esto permite que el padre sincronice el estado
    }
  }

  onLinkClick() {
    if (this.isMobile) {
      this.close.emit();
    }
  }
  onLogout() {
    if (this.isMobile) {
      this.close.emit();
    }
    this.router.navigateByUrl('/');

  }


  navigateTo(route: string) {
    this.router.navigate([route]);
    this.onLinkClick();
  }
}
