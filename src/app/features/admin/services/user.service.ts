import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
interface User {
  id: string;
  name: string;
  email: string;
  // Agrega más campos según la estructura de tu usuario
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.api}/user`;
  // private baseUrl = 'http://localhost:3000/user';
// `${environment.api}/product`
  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  // Obtener un usuario por ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  // Eliminar un usuario por ID
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
