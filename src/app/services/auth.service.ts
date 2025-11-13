import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  username: string;
  roles: string[]; // ej: ['ADMIN'] o ['USER']
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authenticated = false;
  private current: User | null = null;

  // Dummy credentials para pruebas
  private readonly dummyAdmin = {
    username: 'admin',
    password: 'Admin1234',
    roles: ['ADMIN']
  };

  private readonly dummyUser = {
    username: 'demo',
    password: 'Demo1234',
    roles: ['USER']
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  currentUser(): User | null {
    if (this.current) return this.current;

    // localStorage only exists in the browser. If we're running on the server,
    // don't try to access it.
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const stored = localStorage.getItem('user');
    if (stored) {
      this.current = JSON.parse(stored);
      return this.current;
    }
    return null;
  }

  async login(username: string, password: string): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (username === this.dummyAdmin.username && password === this.dummyAdmin.password) {
          this.authenticated = true;
          this.current = { username, roles: this.dummyAdmin.roles };
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('user', JSON.stringify(this.current)); // persistir solo en browser
          }
          resolve(true);
        } else if (username === this.dummyUser.username && password === this.dummyUser.password) {
          this.authenticated = true;
          this.current = { username, roles: this.dummyUser.roles };
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('user', JSON.stringify(this.current));
          }
          resolve(true);
        } else {
          this.authenticated = false;
          this.current = null;
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('user');
          }
          resolve(false);
        }
      }, 800);
    });
  }

  logout() {
    this.authenticated = false;
    this.current = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
    }
  }


  isAuthenticated(): boolean {
    return this.authenticated;
  }

 
}
