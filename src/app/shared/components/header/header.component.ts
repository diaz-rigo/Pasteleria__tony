import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService } from 'primeng/dynamicdialog';

const PRIMECOMPONENTS = [DialogModule,BadgeModule,ButtonModule,SidebarModule,InputTextModule]; //

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [    ...PRIMECOMPONENTS,],
  // providers: [DialogService],

  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss','./log.scss'],

})
export class HeaderComponent {
  isSidebarVisible = false;
  visible= false;

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
  showDialog() {
    console.log("ll")
    this.visible = !this.visible;
  }


}
