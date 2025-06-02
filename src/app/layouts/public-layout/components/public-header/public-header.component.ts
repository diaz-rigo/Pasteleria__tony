import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './public-header.component.html',
  styleUrls: ['./public-header.component.css']
})
export class PublicHeaderComponent {
  
  mobileMenuOpen = false;
  cartItems = 3;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  openLogin() {
    // Lógica para abrir login
  }

  openCart() {
    // Lógica para abrir carrito
  }
  
  isActive(path: string): boolean {
    return window.location.pathname === path;
  }
}