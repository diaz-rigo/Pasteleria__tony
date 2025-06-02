import { Component, signal, output, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './admin-toolbar.component.html',
  styleUrl: './admin-toolbar.component.css'
})
export class AdminToolbarComponent {
  title = signal('Admin Panel');
  menuToggled = output<void>();

  toggleMenu() {
    this.menuToggled.emit();
  }
}