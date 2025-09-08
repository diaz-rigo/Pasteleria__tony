import { ApplicationConfig, provideZoneChangeDetection, isDevMode, inject, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // ⬅️ IMPORTANTE

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { ConfigService } from './shared/services/config.service';
import { firstValueFrom } from 'rxjs';
import { Meta } from '@angular/platform-browser';
function initTheme() {
  const configService = inject(ConfigService);
  const meta = inject(Meta);

  return () => firstValueFrom(configService.getConfig()).then(cfg => {
    const color = cfg.headerBackgroundColor ?? '#fff7f9';
    meta.updateTag({ name: 'theme-color', content: color });
    document.documentElement.style.setProperty('--header-bg', color);
  }).catch(() => {
    // fallback si no hay red
    meta.updateTag({ name: 'theme-color', content: '#fff7f9' });
  });
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
        provideHttpClient(), // ⬅️ SIN ESTO, DI NO ENCUENTRA HttpClient

  provideServiceWorker('ngsw-worker.js',
    {
      
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),    { provide: APP_INITIALIZER, useFactory: initTheme, multi: true }
]
};
