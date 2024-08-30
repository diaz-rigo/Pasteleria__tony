import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

import { FooterComponent } from './shared/components/footer/footer.component';
import * as AOS from 'aos'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,FooterComponent,NgxUiLoaderModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pasteleria-tony';

  ngOnInit(): void {
    AOS.init()
    window.addEventListener('load', AOS.refresh)

    // Realizar la primera recarga solo si no se ha hecho antes
    // if (!this.initialReloadDone) {
    //   this.reloadPage();
    //   this.initialReloadDone = true;
    // }
  }
}
