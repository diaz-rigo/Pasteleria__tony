// import { Component } from '@angular/core';
// import { ButtonModule } from 'primeng/button';
// import { SidebarModule } from 'primeng/sidebar';
// import { BadgeModule } from 'primeng/badge';
// import { DialogModule } from 'primeng/dialog';
// import { InputTextModule } from 'primeng/inputtext';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
// import { HttpClientModule } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../core/services/auth.service';
// import { SessionService } from '../../../core/services/session.service';

// const PRIMECOMPONENTS = [DialogModule, BadgeModule, ButtonModule, SidebarModule, InputTextModule];

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [...PRIMECOMPONENTS, HttpClientModule, FormsModule],
//   providers: [AuthService],
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.scss', './log.scss'],
// })
// export class HeaderComponent {
//   isSidebarVisible = false;
//   visible = false;
//   email = '';
//   password = '';

//   constructor(private authService: AuthService, private ngxService: NgxUiLoaderService,private sessionService:SessionService,
//     private router: Router // Inyecta Router

//   ) {
//     const userData = this.sessionService.getUserData()
//     console.log(userData)
//   }

//   toggleSidebar() {
//     this.isSidebarVisible = !this.isSidebarVisible;
//   }

//   showDialog() {
//     this.visible = true;
//   }

//   closeDialog() {
//     this.visible = false;
//   }

//   handleLogin() {
//     this.ngxService.start();
//     if (this.email && this.password) {
//       this.authService.signIn(this.email, this.password).subscribe(response => {
//         if (response) {
//           // Maneja la respuesta después de un inicio de sesión exitoso
//           console.log('Inicio de sesión exitoso', response);
//           this.closeDialog();
//           this.router.navigate(['/admin/dashboard']); // Redirige al dashboard

//         } else {
//           // Maneja el error si el inicio de sesión falla
//           console.error('Error de inicio de sesión');
//         }
//         this.ngxService.stop();
//       }, error => {
//         // Maneja errores de la solicitud
//         console.error('Error al realizar la solicitud', error);
//         this.ngxService.stop();
//       });
//     } else {
//       this.ngxService.stop();
//       // Mensaje de error para campos vacíos
//       console.error('Por favor, complete todos los campos');
//     }
//   }
// }
