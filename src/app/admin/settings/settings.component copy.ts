// import { Component, signal, effect } from '@angular/core';
// import { ConfigService, SystemConfig } from '../../shared/services/config.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';

// @Component({
//   selector: 'app-settings',
//   standalone: true,
//   imports: [CommonModule, FormsModule, HttpClientModule],
//   templateUrl: './settings.component.html',
//   styleUrl: './settings.component.css',
//   providers: [ConfigService]
// })
// export class SettingsComponent {
//   config = signal<SystemConfig>({
//     headerBackgroundColor: '',
//     footerBackgroundColor: '',
//     primaryColor: '',
//     logoUrl: '',
//     faviconUrl: '',
//     footerText: '',
//     footerLinks: [],
//     heroTitle: '',
//     heroSubtitle: '',
//     heroImageUrl: '',
//     heroButtonText: '',
//     heroButtonUrl: '',
//     showHeroTitle: true,
//     showHeroSubtitle: true,
//     showHeroImage: true,
//     showheaderImage: true,
//     showHeroButton: true
//   });
//   restablecerPorDefecto(): void {
//     this.editableConfig = {
//       headerBackgroundColor: '#fbeded',
//       footerBackgroundColor: '#212121',
//       primaryColor: '#e4b500',
//       logoUrl: 'https://res.cloudinary.com/dvvhnrvav/image/upload/v1749933866/pasteleria-tony/pngs/htl76bq1jvkr20sn1e9b.png',
//       // logoUrl: '',
//       faviconUrl: 'https://res.cloudinary.com/dvvhnrvav/image/upload/v1749934243/pasteleria-tony/pngs/wmqfdo93tutrk6f5so6n.png',
//       footerText: '© 2025 Pasteleria Tony',
//       footerLinks: [],
//       heroTitle: 'Pasteleria Tony',
//       heroSubtitle: ' Elaboramos pasteles y postres con ingredientes de alta calidad y pasión por la tradición. Cada creación está pensada para deleitar los sentidos.',
//       heroImageUrl: '',
//       heroButtonText: 'Ver productos',
//       heroButtonUrl: '/productos',
//       showHeroTitle: true,
//       showHeroSubtitle: true,
//       showHeroImage: true,
//       showheaderImage: true,
//       showHeroButton: true
//     };
//   }

//   editableConfig: SystemConfig = this.config();
//   loading = signal<boolean>(false);
//   message = signal<string>('');
//   configId = '';

//   constructor(private configService: ConfigService) {}

//   ngOnInit(): void {
//     this.loadConfig();
//   }

//   loadConfig(): void {
//     this.loading.set(true);
//     this.configService.getConfig().subscribe({
//       next: (res) => {
//         this.config.set(res);
//         this.editableConfig = { ...res };
//         this.configId = res._id!;
//         this.loading.set(false);
//       },
//       error: () => {
//         this.message.set('Error al cargar configuración.');
//         this.loading.set(false);
//       },
//     });
//   }

//   guardar(): void {
//     this.loading.set(true);
//     this.configService.updateConfig(this.configId, this.editableConfig).subscribe({
//       next: (res) => {
//         this.config.set(res);
//         this.message.set('Configuración guardada correctamente.');
//         this.loading.set(false);
//       },
//       error: () => {
//         this.message.set('Error al guardar configuración.');
//         this.loading.set(false);
//       },
//     });
//   }
// }
