
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfigService, SystemConfig } from '../../../../shared/services/config.service';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
   templateUrl: './public-footer.component.html',
  providers:[ConfigService]
,
  styles: []
})
export class PublicFooterComponent {


  
    config = signal<SystemConfig | null>(null);
  
    constructor(private configService: ConfigService) {}
  
    ngOnInit(): void {
      this.configService.getConfig().subscribe({
        next: (res) => this.config.set(res),
        error: () => console.warn('Error cargando configuración del sistema')
      });
    }
}