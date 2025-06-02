import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef, ComponentRef, Type } from '@angular/core';
import { ToastConfig, ToastPosition } from '../types/toast-types';
import { ToastComponent } from '../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: ComponentRef<ToastComponent>[] = [];
  private defaultConfig: Partial<ToastConfig> = {
    duration: 5000,
    position: 'top-right',
    dismissible: true,
    type: 'info'
  };

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  show(config: ToastConfig): void {
    const mergedConfig = { ...this.defaultConfig, ...config };
    const toastRef = this.createToast(mergedConfig);
    
    this.toasts.push(toastRef);
    toastRef.instance.dismissed.subscribe(() => this.destroyToast(toastRef));
    
    if (mergedConfig.duration) {
      setTimeout(() => this.destroyToast(toastRef), mergedConfig.duration);
    }
  }

  showSuccess(message: string, config?: Partial<ToastConfig>): void {
    this.show({
      ...config,
      message,
      type: 'success'
    });
  }

  showError(message: string, config?: Partial<ToastConfig>): void {
    this.show({
      ...config,
      message,
      type: 'error'
    });
  }

  showWarning(message: string, config?: Partial<ToastConfig>): void {
    this.show({
      ...config,
      message,
      type: 'warning'
    });
  }

  showInfo(message: string, config?: Partial<ToastConfig>): void {
    this.show({
      ...config,
      message,
      type: 'info'
    });
  }

  private createToast(config: ToastConfig): ComponentRef<ToastComponent> {
    // Create component
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(ToastComponent)
      .create(this.injector);
    
    // Set config
    componentRef.instance.config = config;
    
    // Attach to view
    this.appRef.attachView(componentRef.hostView);
    
    // Get DOM element
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    
    // Create container if needed
    const containerId = `toast-container-${config.position}`;
    let container = document.getElementById(containerId);
    
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.className = this.getContainerClasses(config.position!);
      document.body.appendChild(container);
    }
    
    // Append toast to container
    container.appendChild(domElem);
    
    return componentRef;
  }

  private getContainerClasses(position: ToastPosition): string {
    const baseClasses = 'fixed z-50 p-4 max-w-full w-80 space-y-2';
    
    switch (position) {
      case 'top-right':
        return `${baseClasses} top-4 right-4`;
      case 'top-left':
        return `${baseClasses} top-4 left-4`;
      case 'bottom-right':
        return `${baseClasses} bottom-4 right-4`;
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4`;
      case 'top-center':
        return `${baseClasses} top-4 left-1/2 transform -translate-x-1/2`;
      case 'bottom-center':
        return `${baseClasses} bottom-4 left-1/2 transform -translate-x-1/2`;
      default:
        return `${baseClasses} top-4 right-4`;
    }
  }

  private destroyToast(toastRef: ComponentRef<ToastComponent>): void {
    const index = this.toasts.indexOf(toastRef);
    if (index === -1) return;
    
    // Remove from array
    this.toasts.splice(index, 1);
    
    // Animate out
    toastRef.location.nativeElement.style.opacity = '0';
    toastRef.location.nativeElement.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      this.appRef.detachView(toastRef.hostView);
      toastRef.destroy();
    }, 300);
  }
}