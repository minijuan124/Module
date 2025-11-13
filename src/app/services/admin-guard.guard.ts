import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard {
  constructor(private auth: AuthService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(): boolean {
    const user = this.auth.currentUser();
    if (user && user.roles.includes('ADMIN')) {
      return true;
    }

    // If we're on the browser, navigate to login. On the server we can't
    // perform navigation, just deny activation (the server render should
    // return a page without client-only redirects).
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/login']);
    }

    return false;
  }
}
