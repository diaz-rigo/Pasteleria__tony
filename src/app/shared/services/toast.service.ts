import {
  Injectable, ApplicationRef, EnvironmentInjector, ComponentRef, createComponent
} from '@angular/core';
import { ToastConfig, ToastPosition } from '../types/toast-types';
import { ToastComponent } from '../components/toast/toast.component';
// import { ToastComponent } from './toast.component';
// import { ToastConfig, ToastPosition } from './toast-types';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts: ComponentRef<ToastComponent>[] = [];
  private maxVisible = 4;

  private defaults: Required<Pick<ToastConfig,
    'type' | 'dismissible' | 'duration' | 'position' | 'progress' | 'pauseOnHover'>> = {
    type: 'info',
    dismissible: true,
    duration: 5000,
    position: 'top-right',
    progress: true,
    pauseOnHover: true,
  };

  constructor(
    private appRef: ApplicationRef,
    private envInjector: EnvironmentInjector
  ) {}

  show(cfg: ToastConfig) {
    const config: ToastConfig = { ...this.defaults, ...cfg, id: cfg.id ?? crypto.randomUUID() };

    // Limitar visibles (cola simple)
    const samePos = this.toasts.filter(t => this.getContainerId((t.instance as any).config.position!) === this.getContainerId(config.position!));
    if (samePos.length >= this.maxVisible) {
      // Destruye el más antiguo de esa posición
      this.destroyToast(samePos[0]);
    }

    const ref = createComponent(ToastComponent, { environmentInjector: this.envInjector });
    ref.instance.config = config;

    ref.instance.dismissed.subscribe(() => this.destroyToast(ref));
    ref.instance.action.subscribe((val) => {
      // Puedes propagar eventos globales si quieres
      // console.debug('Toast action:', val);
      this.destroyToast(ref);
    });

    this.appRef.attachView(ref.hostView);
    const elem = (ref.hostView as any).rootNodes[0] as HTMLElement;

    const container = this.ensureContainer(config.position!);
    container.appendChild(elem);

    this.toasts.push(ref);
    return config.id!;
  }

  showSuccess(message: string, extra?: Partial<ToastConfig>) {
    return this.show({ message, type: 'success', ...extra });
  }
  showError(message: string, extra?: Partial<ToastConfig>) {
    return this.show({ message, type: 'error', ...extra });
  }
  showWarning(message: string, extra?: Partial<ToastConfig>) {
    return this.show({ message, type: 'warning', ...extra });
  }
  showInfo(message: string, extra?: Partial<ToastConfig>) {
    return this.show({ message, type: 'info', ...extra });
  }

  dismiss(id?: string) {
    if (!id) {
      // Dismiss all
      [...this.toasts].forEach(r => this.destroyToast(r));
      return;
    }
    const ref = this.toasts.find(r => r.instance.config?.id === id);
    if (ref) this.destroyToast(ref);
  }

  // Helpers
  private getContainerId(position: ToastPosition) {
    return `toast-container-${position}`;
  }

  private ensureContainer(position: ToastPosition) {
    const id = this.getContainerId(position);
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      el.className = this.containerClasses(position);
      document.body.appendChild(el);
    }
    return el;
  }

  private containerClasses(position: ToastPosition) {
    const base = 'fixed z-[9999] pointer-events-none p-4 w-[22rem] max-w-full space-y-3';
    switch (position) {
      case 'top-right':     return `${base} top-4 right-4`;
      case 'top-left':      return `${base} top-4 left-4`;
      case 'bottom-right':  return `${base} bottom-4 right-4`;
      case 'bottom-left':   return `${base} bottom-4 left-4`;
      case 'top-center':    return `${base} top-4 left-1/2 -translate-x-1/2`;
      case 'bottom-center': return `${base} bottom-4 left-1/2 -translate-x-1/2`;
    }
  }

  private destroyToast(ref: ComponentRef<ToastComponent>) {
    const el = (ref.hostView as any).rootNodes[0] as HTMLElement;
    el.style.opacity = '0';
    el.style.transform = 'translateY(-4px)';
    el.style.transition = 'opacity 200ms ease, transform 200ms ease';
    setTimeout(() => {
      this.appRef.detachView(ref.hostView);
      ref.destroy();
      this.toasts = this.toasts.filter(r => r !== ref);
    }, 200);
  }
}
