export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface ToastAction {
  label: string;                 // Texto del botón
  value?: string;                // Valor opcional a emitir
  ariaLabel?: string;            // Accesibilidad
}

export interface ToastConfig {
  id?: string;
  message: string;
  type?: ToastType;
  icon?: string | false;         // nombre de material symbol o false para ocultar
  dismissible?: boolean;         // X para cerrar
  duration?: number | null;      // ms; null = persistente
  position?: ToastPosition;
  progress?: boolean;            // barra de progreso
  pauseOnHover?: boolean;        // pausa el autoclosed
  actions?: ToastAction[];       // botones opcionales
}
