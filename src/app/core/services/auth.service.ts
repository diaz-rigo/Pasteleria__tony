import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient) {}

  signIn(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.api}/auth/sign-in`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          // Almacena el token en el almacenamiento local o en el estado de tu aplicación
          localStorage.setItem('authToken', response.token);
        }
      }),
      catchError(error => {
        console.error('Error de inicio de sesión', error);
        return of(null); // Maneja errores y devuelve un observable vacío
      })
    );
  }
}
