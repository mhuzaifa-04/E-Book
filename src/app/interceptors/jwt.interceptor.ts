import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // 🟢 CRUCIAL FIX: Ensure we only attempt to read tokens inside the physical browser instance
  if (isPlatformBrowser(platformId)) {
    // 🟢 Double-check what exact key name you saved your token under!
    // Try reading both common keys to be completely bulletproof:
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token.trim()}`
        }
      });
    }
  }

  return next(req);
};
