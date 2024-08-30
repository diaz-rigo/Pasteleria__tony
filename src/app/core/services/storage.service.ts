import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private keyToken: string = 'authToken';

  constructor() {}

  setToken(token: string): void {
    localStorage.setItem(this.keyToken, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.keyToken);
  }
}
