import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, computed, effect, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { HomeComponent } from './public/home/home.component';
import { AppUpdateService } from './shared/services/app-update.service';
import { LoadingOverlayGlobalComponent } from './shared/components/loading/loading-overlay-global.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,HomeComponent,LoadingOverlayGlobalComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private appUpdate: AppUpdateService) {
  
  }
}
