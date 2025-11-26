// app.config.ts (fragmento relevante)
import { ApplicationConfig, provideZoneChangeDetection, isDevMode, inject, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { ConfigStore } from './shared/config/config.store';
import { Meta } from '@angular/platform-browser';

function initTheme() {
  const store = inject(ConfigStore);
  const meta = inject(Meta);

  // Retornamos una función que hace trabajo sincrónico (no promise) para no bloquear la app.
  return () => {
    const cfg = store.config();
    const color = cfg?.headerBackgroundColor ?? '#fff7f9';
    meta.updateTag({ name: 'theme-color', content: color });
    document.documentElement.style.setProperty('--header-bg', color);

    // Lanzamos la carga en background (si no se ha hecho)
    // loadOnce() internamente no bloquea (según el cambio anterior)
    void store.loadOnce();
    // NOTA: no devolvemos Promise => Angular no espera
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    { provide: APP_INITIALIZER, useFactory: initTheme, multi: true },
    // ELIMINA el APP_INITIALIZER que hacía await a loadOnce(). 
    // Si quieres mantener otro initializer, que no retorne Promise bloqueante.
  ]
};
