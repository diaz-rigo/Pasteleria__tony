import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
const PRIMECOMPONENTS = [BadgeModule,ButtonModule,SidebarModule]; //

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [    ...PRIMECOMPONENTS,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',

})
export class HeaderComponent {
  isSidebarVisible = false;

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
