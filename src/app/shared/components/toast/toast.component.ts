import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastConfig } from '../../../shared/types/toast-types';

@Component({
  selector: 'app-toast',
  standalone: true,  // If you're using standalone components
  imports: [CommonModule],  // Add CommonModule here
  template: `
    <div class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-lg border border-gray-200"
         [class]="getTypeClasses()"
         role="alert">
      <div *ngIf="showIcon" class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
        <ng-container *ngIf="config" [ngSwitch]="config.type">
          <svg *ngSwitchCase="'success'" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <svg *ngSwitchCase="'error'" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
          <svg *ngSwitchCase="'warning'" class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <svg *ngSwitchCase="'info'" class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd"></path>
          </svg>
        </ng-container>
      </div>
      <div *ngIf="config?.message" class="ml-3 text-sm font-normal">{{ config?.message }}</div>
      <button *ngIf="config?.dismissible" type="button" 
              class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
              [class]="getCloseButtonClasses()"
              (click)="dismiss()">
        <span class="sr-only">Close</span>
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  `,
})
export class ToastComponent {
  @Input() config?: ToastConfig;
  @Output() dismissed = new EventEmitter<void>();

  get showIcon(): boolean {
    return this.config?.icon !== false && (!!this.config?.icon || !!this.config?.type);
  }

  getTypeClasses(): string {
    const baseClasses = 'flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow';
    
    switch (this.config?.type) {
      case 'success':
        return `${baseClasses} text-green-700 bg-green-100 border border-green-300`;
      case 'error':
        return `${baseClasses} text-red-700 bg-red-100 border border-red-300`;
      case 'warning':
        return `${baseClasses} text-yellow-700 bg-yellow-100 border border-yellow-300`;
      case 'info':
        return `${baseClasses} text-blue-700 bg-blue-100 border border-blue-300`;
      default:
        return `${baseClasses} text-gray-700 bg-white border border-gray-200`;
    }
  }

  getCloseButtonClasses(): string {
    switch (this.config?.type) {
      case 'success':
        return 'text-green-400 hover:text-green-700 hover:bg-green-50';
      case 'error':
        return 'text-red-400 hover:text-red-700 hover:bg-red-50';
      case 'warning':
        return 'text-yellow-400 hover:text-yellow-700 hover:bg-yellow-50';
      case 'info':
        return 'text-blue-400 hover:text-blue-700 hover:bg-blue-50';
      default:
        return 'text-gray-400 hover:text-gray-700 hover:bg-gray-50';
    }
  }

  dismiss(): void {
    this.dismissed.emit();
  }
}