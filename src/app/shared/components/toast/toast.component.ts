import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastConfig } from '../../types/toast-types';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  host: {
    class: 'block pointer-events-auto',
    tabindex: '0',
    role: 'alert',
    '[attr.aria-live]': '"polite"'
  },
  template: `
  <div
    class="relative flex w-80 max-w-full items-start gap-3 rounded-xl border bg-white p-4 shadow-xl ring-1 transition
           motion-safe:data-[enter=true]:animate-in motion-safe:data-[enter=true]:fade-in motion-safe:data-[enter=true]:slide-in-from-right-4"
    [ngClass]="wrapperClasses(config.type)"
    [attr.data-enter]="true">

    <!-- Acento izquierdo -->
    <div class="absolute left-0 top-0 h-full w-1 rounded-l-xl" [ngClass]="accentBar(config.type)"></div>

    <!-- Icono -->
    <div class="mt-0.5">
      <ng-container *ngIf="showIcon()">
        <span class="inline-flex items-center justify-center rounded-lg p-1.5">
          <span class="material-symbols-rounded text-[20px]" [ngClass]="iconColor(config.type)">
            {{ resolveIcon(config.icon, config.type) }}
          </span>
        </span>
      </ng-container>
    </div>

    <!-- Mensaje + acciones -->
    <div class="min-w-0 flex-1">
      <p class="text-sm leading-5 text-neutral-800 break-words">
        {{ config.message }}
      </p>

      
    </div>

    <!-- Cerrar -->
    <button
      *ngIf="config?.dismissible !== false"
      type="button"
      (click)="dismiss()"
      class="ml-auto -mr-1.5 rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50
             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-300 transition"
      aria-label="Cerrar">
      <span class="material-symbols-rounded text-[18px]">close</span>
    </button>

    <!-- Barra de progreso -->
    <div *ngIf="config?.progress && autoCloseMs"
         class="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden rounded-b-xl bg-neutral-100">
      <div class="h-full transition-[width] duration-100 ease-linear" [ngClass]="progressBar(config.type)"
           [style.width.%]="progressPercent"></div>
    </div>
  </div>
  `,
})
export class ToastComponent {
  @Input() config!: ToastConfig;
  @Output() dismissed = new EventEmitter<void>();
  @Output() action = new EventEmitter<string>();

  autoCloseMs: number | null = null;
  progressPercent = 0;
  private startTs = 0;
  private rafId: number | null = null;
  private paused = false;
  private elapsed = 0;

  ngOnInit() {
    this.autoCloseMs = (this.config?.duration ?? 5000) || null;
    if (this.autoCloseMs) this.startTimer();
  }

  // ====== UI helpers (claros / profesionales) ======
  wrapperClasses(type: ToastConfig['type']) {
    const ring = {
      success: 'ring-emerald-200/70 border-neutral-200',
      error:   'ring-rose-200/70 border-neutral-200',
      warning: 'ring-amber-200/70 border-neutral-200',
      info:    'ring-sky-200/70 border-neutral-200',
      neutral: 'ring-neutral-200/70 border-neutral-200'
    }[type || 'neutral'];
    return ring;
  }

  accentBar(type: ToastConfig['type']) {
    return {
      success: 'bg-emerald-500',
      error:   'bg-rose-500',
      warning: 'bg-amber-500',
      info:    'bg-sky-500',
      neutral: 'bg-neutral-300'
    }[type || 'neutral'];
  }

  iconColor(type: ToastConfig['type']) {
    return {
      success: 'text-emerald-600',
      error:   'text-rose-600',
      warning: 'text-amber-600',
      info:    'text-sky-600',
      neutral: 'text-neutral-600'
    }[type || 'neutral'];
  }

  progressBar(type: ToastConfig['type']) {
    return {
      success: 'bg-emerald-500',
      error:   'bg-rose-500',
      warning: 'bg-amber-500',
      info:    'bg-sky-500',
      neutral: 'bg-neutral-400'
    }[type || 'neutral'];
  }

  // ====== Lógica ======
  showIcon() { return this.config?.icon !== false; }

  resolveIcon(icon: string | false | undefined, type: ToastConfig['type']) {
    if (typeof icon === 'string') return icon;
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'notifications';
    }
  }

  dismiss() {
    this.stopTimer();
    this.dismissed.emit();
  }

  onAction(val: string) {
    this.action.emit(val);
  }

  // Accesibilidad: Esc para cerrar
  @HostListener('document:keydown.escape')
  onEsc() { if (this.config?.dismissible !== false) this.dismiss(); }

  // Pausa en hover si aplica
  @HostListener('mouseenter') onEnter() {
    if (this.config?.pauseOnHover && this.autoCloseMs) this.pauseTimer();
  }
  @HostListener('mouseleave') onLeave() {
    if (this.config?.pauseOnHover && this.autoCloseMs) this.resumeTimer();
  }

  // Timer + progreso
  private tick = (ts: number) => {
    if (!this.startTs) this.startTs = ts;
    const elapsedNow = ts - this.startTs + this.elapsed;
    this.progressPercent = Math.min(100, (elapsedNow / (this.autoCloseMs ?? 1)) * 100);

    if (this.autoCloseMs && elapsedNow >= this.autoCloseMs) {
      this.dismiss();
      return;
    }
    this.rafId = requestAnimationFrame(this.tick);
  };

  private startTimer() {
    this.paused = false; this.startTs = 0; this.elapsed = 0;
    this.rafId = requestAnimationFrame(this.tick);
  }
  private pauseTimer() {
    if (this.paused) return;
    this.paused = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.startTs) this.elapsed += performance.now() - this.startTs;
    this.startTs = 0; this.rafId = null;
  }
  private resumeTimer() {
    if (!this.paused) return;
    this.paused = false;
    this.rafId = requestAnimationFrame(this.tick);
  }
  private stopTimer() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }
}
