import { Component } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ERol } from '../../constants/rol.enum';
import { SessionService } from '../../../core/services/session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  providers: [AuthService],
  imports:[CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private ngxService: NgxUiLoaderService,
    private sessionService: SessionService,
    private router: Router
  ) {
    const userData = this.sessionService.getUserData();
    console.log(userData);
    this.isAdmin = this.sessionService.getRol() === ERol.ADMIN; // Verificación del rol del usuario
  }
}
