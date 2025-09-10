import { Routes } from '@angular/router';

// Layouts
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { AuthGuard } from './core/directives/auth/auth.guard';
import { AdminGuard } from './core/directives/auth/admin.guard';

export const routes: Routes = [
  // Área Pública
  {
    path: '',
    component: PublicLayoutComponent,
    // canActivate: [PublicGuard], // Solo para usuarios no autenticados
    children: [
      { 
        path: '', 
        title: 'Inicio',
        loadComponent: () => import('./public/home/home.component').then(m => m.HomeComponent) 
      },
      { 
        path: 'productos', 
        title: 'Productos',
        loadComponent: () => import('./public/products/products.component').then(m => m.ProductsComponent) 
      },
      { 
              // path: 'editar-producto/:id',  // Nota el parámetro :id

        path: 'productos-detail/:id', 
        title: 'Producto-detalle',
        loadComponent: () => import('./public/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent) 
      },
      { 
        path: 'nosotros', 
        title: 'Nosotros',
        loadComponent: () => import('./public/about/about.component').then(m => m.AboutComponent) 
      },
      { 
        path: 'login', 
        title: 'Acceso',
        loadComponent: () => import('./public/login/login.component').then(m => m.LoginComponent) 
      },
      { 
        path: 'registro', 
        title: 'Registro',
        loadComponent: () => import('./public/registro/registro.component').then(m => m.RegistroComponent) 
      },
      { 
        path: 'orden/:code', 
        title: 'Mi pedido',
        loadComponent: () => import('./public/order-detail/order-detail.component').then(m => m.OrderDetailComponent) 
      },
      // { 
      //   path: 'contacto', 
      //   title: 'Contacto',
      //   loadComponent: () => import('./public/contact/contact.component').then(m => m.ContactComponent) 
      // },
      // { 
      //   path: 'login', 
      //   title: 'Iniciar Sesión',
      //   loadComponent: () => import('./public/auth/login/login.component').then(m => m.LoginComponent) 
      // },
      // { 
      //   path: 'registro', 
      //   title: 'Registro',
      //   loadComponent: () => import('./public/auth/register/register.component').then(m => m.RegisterComponent) 
      // }
    ]
  },

  // Área de Cliente
  {
    path: 'mi-cuenta',
    component: CustomerLayoutComponent,
    // canActivate: [AuthGuard, CustomerGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        title: 'Mi Panel',
        loadComponent: () => import('./customer/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      // { 
      //   path: 'perfil', 
      //   title: 'Mi Perfil',
      //   loadComponent: () => import('./customer/profile/profile.component').then(m => m.ProfileComponent) 
      // },
      // { 
      //   path: 'pedidos', 
      //   title: 'Mis Pedidos',
      //   loadComponent: () => import('./customer/orders/list/list.component').then(m => m.ListComponent) 
      // },
      // { 
      //   path: 'pedidos/:id', 
      //   title: 'Detalle del Pedido',
      //   loadComponent: () => import('./customer/orders/detail/detail.component').then(m => m.DetailComponent) 
      // },
      // { 
      //   path: 'favoritos', 
      //   title: 'Mis Favoritos',
      //   loadComponent: () => import('./customer/wishlist/wishlist.component').then(m => m.WishlistComponent) 
      // },
      // { 
      //   path: 'direcciones', 
      //   title: 'Mis Direcciones',
      //   loadComponent: () => import('./customer/addresses/addresses.component').then(m => m.AddressesComponent) 
      // }
    ]
  },

  // Área Administrativa
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard,
     AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        title: 'Admin - Panel',
        loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      { 
        path: 'productos', 
        title: 'Admin - Usuarios',
        loadComponent: () => import('./admin/products/products.component').then(m => m.ProductsComponentAdmin) 
      },
      { 
      path: 'crear-producto', 
      title: 'Admin - Crear Producto', // Añadido prefijo "Admin" para consistencia
      
        loadComponent: () => import('./admin/products/create/create.component').then(m => m.CreateProductComponent) 
      },
      { 
      path: 'editar-producto/:id',  // Nota el parámetro :id
      title: 'Admin - editar Producto', // Añadido prefijo "Admin" para consistencia
      
        loadComponent: () => import('./admin/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent) 
      },
      { 
      path: 'configuracion',  // Nota el parámetro :id
      title: 'configuracion del Sistema', // Añadido prefijo "Admin" para consistencia
      
        loadComponent: () => import('./admin/settings/settings.component').then(m => m.SettingsComponent) 
      },
      { 
      path: 'pedidos',  // Nota el parámetro :id
      title: 'pedidos', // Añadido prefijo "Admin" para consistencia
      
        loadComponent: () => import('./admin/admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent) 
      },
      { 
      path: 'crear-pedidos',  // Nota el parámetro :id
      title: 'pedidos', // Añadido prefijo "Admin" para consistencia
      
        loadComponent: () => import('./admin/admin-orders/new-order/new-order.component').then(m => m.NewOrderComponent) 
      },
      // { 
      //   path: 'usuarios', 
      //   title: 'Admin - Usuarios',
      //   loadComponent: () => import('./admin/users/users.component').then(m => m.UsersComponent) 
      // },
      // { 
      //   path: 'pedidos', 
      //   title: 'Admin - Pedidos',
      //   loadComponent: () => import('./admin/orders/orders.component').then(m => m.OrdersComponent) 
      // },
      // { 
      //   path: 'configuracion', 
      //   title: 'Admin - Configuración',
      //   loadComponent: () => import('./admin/settings/settings.component').then(m => m.SettingsComponent) 
      // },
      // { 
      //   path: 'reportes', 
      //   title: 'Admin - Reportes',
      //   loadComponent: () => import('./admin/reports/reports.component').then(m => m.ReportsComponent) 
      // }
    ]
  },

  // Manejo de errores (404)
  { 
    path: 'no-encontrado',
    title: 'Página no encontrada',
    loadComponent: () => import('./shared/components/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent) 
  },
  { path: '**', component: PageNotFoundComponent, title: 'Página no encontrada' },

];