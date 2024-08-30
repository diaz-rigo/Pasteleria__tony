import { Component } from '@angular/core';
import { HomeContentComponent } from '../../components/home-content/home-content.component';
import { CatalogoProducComponent } from '../../components/catalogo-produc/catalogo-produc.component';
import { AboutComponent } from '../../components/about/about.component';
import { ContactComponent } from '../../components/contact/contact.component';
const COMPONENTS = [ContactComponent,HomeContentComponent,AboutComponent,CatalogoProducComponent]; //

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [...COMPONENTS],

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
