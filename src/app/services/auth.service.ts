import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private router = inject(Router);

  isLoggedIn = signal<boolean>(this.hasToken());
  currentUser = signal<string | null>(this.getStoredItem('username'));
  currentUserRole = signal<string | null>(this.getStoredItem('role'));

  register(user: any) : Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap(() => {
        if (isPlatformBrowser(this.platformId)) {
          // 🌟 ADDED: If registration is successful, flag them as a returning user right away
          localStorage.setItem('is_returning_user', 'true');
        }
      })
    );
  }

  login(credentials: { email: string; passwordHash: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('username', response.username);
          localStorage.setItem('role', response.role);

          // 🌟 ADDED: Flag this device permanently so they bypass the anonymous visitor restriction wall
          localStorage.setItem('is_returning_user', 'true');

          this.isLoggedIn.set(true);
          this.currentUser.set(response.username);
          this.currentUserRole.set(response.role);

          // Reset visit counter since they cleared the threshold restriction
          localStorage.setItem('site_visits', '0');
        }
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      // 🌟 OPTIMIZED: Use removeItem instead of clear()
      // This prevents wiping out 'is_returning_user' so they aren't forced to register again after logging out!
      localStorage.removeItem('auth_token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
    }
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    this.currentUserRole.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.getStoredItem('auth_token');
  }

  isAdmin(): boolean {
    return this.currentUserRole() === 'Admin';
  }

  private hasToken(): boolean {
    return !!this.getStoredItem('auth_token');
  }

  private getStoredItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }
}
