import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type LoadingVariant = 'spinner' | 'dots' | 'bar';
type Accent = 'rose' | 'pink' | 'amber' | 'orange' | 'lime';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="show()"
      class="inset-0 z-[1000]"
      [class.fixed]="fullscreen"
      [class.absolute]="!fullscreen"
      [ngClass]="{ 'pointer-events-auto': backdrop, 'pointer-events-none': !backdrop }"
      aria-live="polite"
      aria-busy="true"
    >
      <!-- Backdrop CLARO (pastel) -->
      <div
        class="inset-0 transition-opacity"
        [class.fixed]="fullscreen"
        [class.absolute]="!fullscreen"
        [ngClass]="backdrop ? (backdropSoft ? 'bg-white/60 backdrop-blur-[1px]' : 'bg-white/80 backdrop-blur-[2px]') : 'bg-transparent'"
      ></div>

      <!-- Card -->
      <div class="absolute inset-0 flex items-center justify-center p-4" role="status">
        <div
          class="w-full max-w-[22rem] rounded-2xl border bg-white shadow-xl"
          [ngClass]="[
            palette().cardBorder,
            'shadow-[0_10px_30px_rgba(253,164,175,0.15)]' 
          ]"
        >
          <div class="p-5 sm:p-6">
            <div class="flex items-center gap-4">
              <div class="shrink-0">
                <!-- Icono principal -->
                <span
                  class="material-symbols-rounded text-3xl sm:text-4xl align-middle"
                  [ngClass]="palette().icon"
                  *ngIf="iconName; else defaultIcon"
                >{{ iconName }}</span>
                <ng-template #defaultIcon>
                  <span class="material-symbols-rounded text-3xl sm:text-4xl" [ngClass]="palette().icon">hourglass</span>
                </ng-template>
              </div>

              <div class="min-w-0">
                <p class="text-sm" [ngClass]="palette().subtitle">{{ subtitle }}</p>
                <h3 class="mt-0.5 text-base sm:text-lg font-semibold" [ngClass]="palette().title">
                  {{ title }}
                </h3>
              </div>
            </div>

            <!-- Variantes visuales -->
            <div class="mt-5">
              <!-- Spinner -->
              <div *ngIf="variant === 'spinner'" class="flex items-center gap-3">
                <div class="h-5 w-5 sm:h-6 sm:w-6 animate-spin rounded-full border-[3px] border-slate-200"
                     [ngClass]="palette().spinnerTop"></div>
                <p class="text-sm" [ngClass]="palette().message">{{ message }}</p>
              </div>

              <!-- Dots -->
              <div *ngIf="variant === 'dots'" class="flex items-center gap-3">
                <div class="flex items-center gap-1.5">
                  <span class="h-2 w-2 rounded-full animate-bounce [animation-delay:-0.15s]" [ngClass]="palette().dot"></span>
                  <span class="h-2 w-2 rounded-full animate-bounce" [ngClass]="palette().dot"></span>
                  <span class="h-2 w-2 rounded-full animate-bounce [animation-delay:0.15s]" [ngClass]="palette().dot"></span>
                </div>
                <p class="text-sm" [ngClass]="palette().message">{{ message }}</p>
              </div>

              <!-- Bar -->
              <div *ngIf="variant === 'bar'" class="space-y-2">
                <div class="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    class="h-full transition-all"
                    [ngClass]="palette().bar"
                    [style.width.%]="progressClamped()"
                  ></div>
                </div>
                <div class="flex items-center justify-between text-xs" [ngClass]="palette().subtitle">
                  <span>{{ message }}</span>
                  <span *ngIf="showProgressPercentage">{{ progressClamped() }}%</span>
                </div>
              </div>
            </div>

            <!-- Acciones (opcional) -->
            <div *ngIf="showCancel" class="mt-4 flex justify-end">
              <button
                type="button"
                (click)="onCancel?.()"
                class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-rose-50 active:scale-[.98] transition"
                [ngClass]="[palette().cardBorder, palette().btnText]"
              >
                <span class="material-symbols-rounded text-base">close</span>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoadingOverlayComponent {
  // Control básico
  @Input({ transform: (v: any) => !!v }) set visible(v: boolean) { this._show.set(!!v); }
  private _show = signal(false);
  show = computed(() => this._show());

  // Apariencia / layout
  @Input() fullscreen = true;     // true: pantalla completa; false: relativo al contenedor
  @Input() backdrop = true;       // mostrar velo de fondo
  @Input() backdropSoft = true;   // velo más suave (true) o un poco más marcado (false)
  @Input() variant: LoadingVariant = 'spinner';
  @Input() accent: Accent = 'rose'; // paleta pastel

  // Contenido
  @Input() title = 'Preparando tu pedido...';
  @Input() subtitle = 'Un momento, estamos batiendo la mezcla';
  @Input() message = 'Horneando resultados';
  @Input() iconName: string | null = null; // p.ej. "cloud_upload", "hourglass", "sync"

  // Barra de progreso
  @Input() progress = 0; // 0-100
  @Input() showProgressPercentage = true;

  // Acción opcional
  @Input() showCancel = false;
  @Input() onCancel?: () => void;

  progressClamped = computed(() => {
    const p = Number(this.progress);
    if (Number.isNaN(p)) return 0;
    return Math.min(100, Math.max(0, Math.round(p)));
  });

  palette = computed(() => {
    // Paletas claras con toques “bakery”
    switch (this.accent) {
      case 'pink':
        return {
          icon: 'text-pink-600',
          spinnerTop: 'border-t-pink-600',
          dot: 'bg-pink-600',
          bar: 'bg-pink-500',
          title: 'text-stone-800',
          subtitle: 'text-stone-500',
          message: 'text-stone-700',
          cardBorder: 'border-pink-100',
          btnText: 'text-stone-700'
        };
      case 'amber':
        return {
          icon: 'text-amber-600',
          spinnerTop: 'border-t-amber-600',
          dot: 'bg-amber-600',
          bar: 'bg-amber-500',
          title: 'text-stone-800',
          subtitle: 'text-stone-500',
          message: 'text-stone-700',
          cardBorder: 'border-amber-100',
          btnText: 'text-stone-700'
        };
      case 'orange':
        return {
          icon: 'text-orange-600',
          spinnerTop: 'border-t-orange-600',
          dot: 'bg-orange-600',
          bar: 'bg-orange-500',
          title: 'text-stone-800',
          subtitle: 'text-stone-500',
          message: 'text-stone-700',
          cardBorder: 'border-orange-100',
          btnText: 'text-stone-700'
        };
      case 'lime':
        return {
          icon: 'text-lime-700',
          spinnerTop: 'border-t-lime-700',
          dot: 'bg-lime-700',
          bar: 'bg-lime-600',
          title: 'text-stone-800',
          subtitle: 'text-stone-500',
          message: 'text-stone-700',
          cardBorder: 'border-lime-100',
          btnText: 'text-stone-700'
        };
      case 'rose':
      default:
        return {
          icon: 'text-rose-600',
          spinnerTop: 'border-t-rose-600',
          dot: 'bg-rose-600',
          bar: 'bg-rose-500',
          title: 'text-stone-800',
          subtitle: 'text-stone-500',
          message: 'text-stone-700',
          cardBorder: 'border-rose-100',
          btnText: 'text-stone-700'
        };
    }
  });
}
