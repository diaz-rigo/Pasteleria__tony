import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _active = signal(false);
  private _message = signal('Cargando...');
  private _title = signal('Procesando');
  private _subtitle = signal('Un momento por favor');
  private _variant = signal<'spinner'|'dots'|'bar'>('spinner');
  private _icon = signal<string | null>(null);
  private _progress = signal(0);

  // Expuestos (sólo lectura desde fuera)
  active = this._active.asReadonly();
  message = this._message.asReadonly();
  title = this._title.asReadonly();
  subtitle = this._subtitle.asReadonly();
  variant = this._variant.asReadonly();
  icon = this._icon.asReadonly();
  progress = this._progress.asReadonly();

  show(opts?: {
    message?: string; title?: string; subtitle?: string;
    variant?: 'spinner'|'dots'|'bar'; icon?: string | null; progress?: number;
  }) {
    if (opts?.message) this._message.set(opts.message);
    if (opts?.title) this._title.set(opts.title);
    if (opts?.subtitle) this._subtitle.set(opts.subtitle);
    if (opts?.variant) this._variant.set(opts.variant);
    if (opts?.icon !== undefined) this._icon.set(opts.icon);
    if (typeof opts?.progress === 'number') this._progress.set(opts.progress);
    this._active.set(true);
  }

  setProgress(p: number) { this._progress.set(Math.max(0, Math.min(100, Math.round(p)))); }
  hide() { this._active.set(false); }
}
