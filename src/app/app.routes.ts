import { Routes } from '@angular/router';
import { HomeComponent } from './features/public/views/home/home.component';
import { DashboardComponent } from './features/admin/views/dashboard/dashboard.component';
import { IsAuthenticatedGuard } from './core/guards/is-authenticated.guard';
import { IsAdminGuard } from './core/guards/is-admin.guard';
import { ListProductComponent } from './features/admin/views/list-product/list-product.component';

// Configuración de las rutas
export const routes: Routes = [
  { path: '', component: HomeComponent },  // Ruta principal

  {
    path: 'public',
    children: [
      { path: '', component: HomeComponent },  // Ruta principal de la sección pública
      // { path: 'about', component: AboutComponent },  // Ruta hija en la sección pública
      // Puedes agregar más rutas hijas aquí
    ]
  },

  {
    path: 'admin',
    canActivate: [IsAuthenticatedGuard, IsAdminGuard],  // Aplicando guards a la ruta admin
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'product', component: ListProductComponent },
      // { path: 'manage-orders', component: ManageOrdersComponent },  // Ejemplo de ruta hija en admin
      // Puedes agregar más rutas hijas aquí
    ]
  },

  // Rutas para manejar páginas no encontradas o errores
  { path: '**', redirectTo: '' }  // Ruta comodín para redirigir a la página principal
];
