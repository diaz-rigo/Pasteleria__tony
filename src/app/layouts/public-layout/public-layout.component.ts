import { Component } from '@angular/core';
import { PublicFooterComponent } from './components/public-footer/public-footer.component';
import { PublicHeaderComponent } from './components/public-header/public-header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [PublicFooterComponent,PublicHeaderComponent,RouterOutlet],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css'
})
export class PublicLayoutComponent {

}
