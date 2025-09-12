import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';
import { LoadingOverlayComponent } from './loading.component';

@Component({
  selector: 'app-loading-overlay-global',
  standalone: true,
  imports: [CommonModule, LoadingOverlayComponent],
  template: `
    <app-loading-overlay
      [visible]="svc.active()"
      [title]="svc.title()"
      [subtitle]="svc.subtitle()"
      [message]="svc.message()"
      [variant]="svc.variant()"
      [iconName]="svc.icon()"
      [progress]="svc.progress()"
      [fullscreen]="true"
      [backdrop]="true"
    />
  `,
})
export class LoadingOverlayGlobalComponent {
  constructor(public svc: LoadingService) {}
}
