import { Routes } from '@angular/router';
import { HomeComponent } from './features/public/views/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Ruta principal
  // { path: 'about', component: AboutComponent },
  // { path: 'contact', component: ContactComponent },
  // { path: 'admin', children: [
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'manage-orders', component: ManageOrdersComponent },
  //   ]
  // },
  // { path: '**', redirectTo: '' }  // Redirigir a la ruta principal en caso de no coincidir
];
