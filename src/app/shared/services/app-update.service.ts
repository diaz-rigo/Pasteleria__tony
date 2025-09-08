
import { Injectable, inject } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';

@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  private swUpdate = inject(SwUpdate);

  constructor() {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates.subscribe((ev: VersionEvent) => {
      if (ev.type === 'VERSION_READY') {
        const ok = confirm('Hay una actualización disponible. ¿Actualizar ahora?');
        if (ok) location.reload();
      }
    });

    // Comprobar periódicamente (cada 6h)
    setInterval(() => this.swUpdate.checkForUpdate(), 6 * 60 * 60 * 1000);
  }
}
