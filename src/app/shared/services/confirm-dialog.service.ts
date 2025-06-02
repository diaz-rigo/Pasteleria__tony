// confirm-dialog.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmDialogConfig {
  title: string | ((...args: any[]) => string);
  message: string | ((...args: any[]) => string);
  confirmText?: string | ((...args: any[]) => string);
  cancelText?: string | ((...args: any[]) => string);
  context?: any; // Contexto para interpolación
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private showDialogSubject = new Subject<ConfirmDialogConfig>();
  private userResponseSubject = new Subject<boolean>();

  showDialog$ = this.showDialogSubject.asObservable();
  userResponse$ = this.userResponseSubject.asObservable();

  private defaultConfig: ConfirmDialogConfig = {
    title: 'Confirmación',
    message: '¿Estás seguro de realizar esta acción?',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar'
  };

  /**
   * Muestra un diálogo de confirmación con textos dinámicos
   * @param config Configuración del diálogo
   * @param context (Opcional) Contexto para interpolación
   * @returns Promise<boolean>
   */
  confirm(config: Partial<ConfirmDialogConfig>, context?: any): Promise<boolean> {
    const dialogConfig: ConfirmDialogConfig = {
      ...this.defaultConfig,
      ...config,
      context: context || config.context
    };

    this.showDialogSubject.next(dialogConfig);

    return new Promise<boolean>((resolve) => {
      const subscription = this.userResponse$.subscribe((response) => {
        resolve(response);
        subscription.unsubscribe();
      });
    });
  }

  /**
   * Diálogo específico para cambios sin guardar con parámetros dinámicos
   * @param entityName (Opcional) Nombre de la entidad para personalizar el mensaje
   * @returns Promise<boolean>
   */
  confirmUnsavedChanges(entityName?: string): Promise<boolean> {
    return this.confirm({
      title: 'Cambios sin guardar',
      message: entityName 
        ? `Tienes cambios sin guardar en ${entityName}. ¿Deseas salir sin guardar?`
        : 'Tienes cambios sin guardar. ¿Deseas salir sin guardar?',
      confirmText: 'Salir sin guardar',
      cancelText: 'Permanecer'
    });
  }

  onUserResponse(response: boolean) {
    this.userResponseSubject.next(response);
  }

  // Helper para procesar textos dinámicos
  resolveText(value: string | ((...args: any[]) => string), context?: any): string {
    return typeof value === 'function' ? value(context) : value;
  }
}