import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SessionService } from '../../../core/services/session.service';
import { CommonModule } from '@angular/common';
import { ERol } from '../../constants/rol.enum';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

const PRIMECOMPONENTS = [ToastModule,DialogModule, BadgeModule, ButtonModule, SidebarModule, InputTextModule];

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    ...PRIMECOMPONENTS,
    HttpClientModule,
    FormsModule
  ],
  providers: [AuthService, MessageService],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', './log.scss'],
})
export class HeaderComponent {
  isSidebarVisible = false;
  visible = false;
  email = '';
  password = '';
  isAdmin = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private ngxService: NgxUiLoaderService,
    public sessionService: SessionService,
    private router: Router,
    private messageService: MessageService,
  ) {
    const userData = this.sessionService.getUserData();
    this.isAdmin = this.sessionService.getRol() === ERol.ADMIN;
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  handleLogin() {
    this.ngxService.start();
    if (this.email && this.password) {
      this.authService.signIn(this.email, this.password).subscribe(
        (response) => {
          this.ngxService.stop();
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Inicio de sesión exitoso',
              detail: '¡Bienvenido de nuevo!'
            });
            this.closeDialog();
            this.router.navigate(['/admin/dashboard']).then(() => {
              // Una vez completada la navegación, recarga la página
              window.location.reload();
            });
          } else {
            this.messageService.add({
              severity: 'info',
              summary: 'Aviso',
              detail: 'No se pudo completar la solicitud.'
            });
          }
        },
        (error) => {
          this.ngxService.stop();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Error en la solicitud'
          });
        }
      );
    } else {
      this.ngxService.stop();
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, complete todos los campos'
      });
    }
  }

  logout() {
    this.sessionService.clearSession();
    this.messageService.add({
      severity: 'info',
      summary: 'Sesión cerrada',
      detail: 'Has cerrado sesión con éxito.'
    });

    // Navega a la página de inicio
    this.router.navigate(['/']).then(() => {
      // Una vez completada la navegación, recarga la página
      window.location.reload();
    });
  }

}
