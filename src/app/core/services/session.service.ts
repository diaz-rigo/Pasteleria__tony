import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from './storage.service';
import { Iuser } from '../../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private helper = new JwtHelperService();

  constructor(private storageService: StorageService) {}

  get token(): string | null {
    return this.storageService.getToken();
  }

  getUserData(): Iuser | undefined {
    const token = this.token;
    if (token) {
      const decodedData = this.helper.decodeToken(token);
      return decodedData;
    }
    return undefined;
  }

  getRol(): string {
    const userData = this.getUserData();
    return userData ? userData.rol : 'invitado';
  }

  isAuthenticated(): boolean {
    const token = this.token;
    return !!token && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const token = this.token;
    return token ? this.helper.isTokenExpired(token) : true;
  }

  // Método para eliminar el token de autenticación del almacenamiento local
  removeToken(): void {
    this.storageService.setToken(''); // Se establece un token vacío para "eliminar" el token
  }
    // Método para limpiar la sesión
    clearSession(): void {
      localStorage.removeItem('authToken');
    }
}
