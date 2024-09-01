import { Component } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ERol } from '../../constants/rol.enum';
import { SessionService } from '../../../core/services/session.service';
import { CommonModule } from '@angular/common';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-footer',
  standalone: true,
  providers: [AuthService,MessageService],
  imports:[CommonModule,SpeedDialModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  // providers: [MessageService]

})
export class FooterComponent {
  isAdmin = false;
  items: MenuItem[] ;

  constructor(
    private authService: AuthService,
    private ngxService: NgxUiLoaderService,
    private sessionService: SessionService,
    private messageService: MessageService,
    private router: Router
  ) {
    const userData = this.sessionService.getUserData();
    console.log(userData);
    this.isAdmin = this.sessionService.getRol() === ERol.ADMIN; // Verificación del rol del usuario
    this.items = [
      {
          icon: 'pi pi-pencil',
          command: () => {
              this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
          }
      },
      {
          icon: 'pi pi-refresh',
          command: () => {
              this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
          }
      },
      {
          icon: 'pi pi-trash',
          command: () => {
              this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
          }
      },
      {
          icon: 'pi pi-upload',
          routerLink: ['/fileupload']
      },
      {
          icon: 'pi pi-external-link',
          target:'_blank',
          url: 'http://angular.io'
      }
  ];
  }

  redirectTo_adm(route: string): void {
    // this.sidebarVisible = false;
    this.router.navigate(['/admin', route]) // Utiliza la navegación de Angular
  }
}
