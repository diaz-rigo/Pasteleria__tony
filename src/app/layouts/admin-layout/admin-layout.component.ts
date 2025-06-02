import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminToolbarComponent } from './components/admin-toolbar/admin-toolbar.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { ProductService } from '../../shared/services/product.service';
// import { ProductsComponentAdmin } from '../../admin/products/products.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet,AdminToolbarComponent,AdminSidebarComponent,CommonModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',  
  // providers:[ProductService,ProductsComponentAdmin]
  // providers:[HttpClientModule]

})
export class AdminLayoutComponent {
sidebarOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.update(prev => !prev);
  }
  isDesktop() {
  return window.innerWidth >= 768; // md breakpoint de Tailwind
}

}
