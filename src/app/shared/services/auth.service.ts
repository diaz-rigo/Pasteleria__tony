import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private key = 'auth_token';
  // userSig = signal<User | null>(null);

  // constructor(private http: HttpClient) {
  //   const token = localStorage.getItem(this.key);
  //   if (token) this.userSig.set(this.decode(token));
  // }

  // login(dto: LoginDto): Observable<User> {
  //   return this.http.post<{ token: string }>('/api/auth/login', dto).pipe(
  //     tap(res => localStorage.setItem(this.key, res.token)),
  //     map(res => this.decode(res.token)),
  //     tap(user => this.userSig.set(user))
  //   );
  // }

  // logout() {
  //   localStorage.removeItem(this.key);
  //   this.userSig.set(null);
  // }

  // isAuthenticated(): boolean {
  //   return !!this.userSig();
  // }

  // getUser(): User | null {
  //   return this.userSig();
  // }

  // private decode(token: string): User {
  //   const payload = JSON.parse(atob(token.split('.')[1]));
  //   return {
  //     id: payload.sub,
  //     name: payload.name,
  //     roles: payload.roles ?? []
  //   };
  // }
}