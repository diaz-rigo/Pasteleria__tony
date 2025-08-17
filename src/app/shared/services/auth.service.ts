import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

interface LoginDto {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private key = 'auth_token';
    private apiUrl = `${environment.api}/auth`; // Usa la URL base del environment
  
  
  // private apiUrl = 'http://localhost:3000/auth'; // Ajusta si tienes proxy
  userSig = signal<User | null>(null);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem(this.key);
    if (token) {
      this.userSig.set(this.decode(token));
    }
  }

  // Login
  login(dto: LoginDto): Observable<User> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/sign-in/`, dto).pipe(
      tap(res => localStorage.setItem(this.key, res.token)),
      map(res => this.decode(res.token)),
      tap(user => this.userSig.set(user))
    );
  }

  // Logout
  logout() {
    localStorage.removeItem(this.key);
    this.userSig.set(null);
  }

  // Saber si está autenticado
  isAuthenticated(): boolean {
    return !!this.userSig();
  }

  // Obtener usuario actual
  getUser(): User | null {
    return this.userSig();
  }

  // Decodificar el token JWT
  private decode(token: string): User {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      rol: payload.rol
    };
  }
}
