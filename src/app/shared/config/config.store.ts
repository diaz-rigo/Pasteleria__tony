// config.store.ts
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConfigService, SystemConfig } from '../services/config.service';
// import { ConfigService, SystemConfig } from './config.service';

@Injectable({ providedIn: 'root' })
export class ConfigStore {
  config = signal<SystemConfig | null>(null);
  private loaded = false;

  constructor(private api: ConfigService) {}

  async loadOnce(): Promise<void> {
    if (this.loaded) return;
    const cfg = await firstValueFrom(this.api.getConfig());
    this.config.set(cfg);
    this.loaded = true;
  }

  // Si necesitas refrescar manualmente:
  async refresh(): Promise<void> {
    const cfg = await firstValueFrom(this.api.getConfig());
    this.config.set(cfg);
  }
}
