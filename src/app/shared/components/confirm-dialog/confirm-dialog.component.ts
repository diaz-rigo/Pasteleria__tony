// confirm-dialog.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
    standalone: true,  // Add this
imports:[CommonModule],
  selector: 'app-confirm-dialog',
  template: `
    <div *ngIf="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  {{ title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ message }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button 
              type="button" 
              (click)="onConfirm()"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            >
              {{ confirmText }}
            </button>
            <button 
              type="button" 
              (click)="onCancel()"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              {{ cancelText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  show = false;
  title = '';
  message = '';
  confirmText = 'Confirmar';
  cancelText = 'Cancelar';

  constructor(private confirmDialogService: ConfirmDialogService) {
    this.confirmDialogService.showDialog$.subscribe(config => {
      this.title = this.resolveText(config.title, config.context);
      this.message = this.resolveText(config.message, config.context);
      this.confirmText = config.confirmText 
        ? this.resolveText(config.confirmText, config.context) 
        : 'Confirmar';
      this.cancelText = config.cancelText 
        ? this.resolveText(config.cancelText, config.context) 
        : 'Cancelar';
      this.show = true;
    });
  }

  private resolveText(value: string | ((...args: any[]) => string), context?: any): string {
    return typeof value === 'function' ? value(context) : value;
  }

  onConfirm() {
    this.confirmDialogService.onUserResponse(true);
    this.show = false;
  }

  onCancel() {
    this.confirmDialogService.onUserResponse(false);
    this.show = false;
  }
}