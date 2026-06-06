import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // 1. Grab the secure JWT token from the browser's localStorage
  const token = localStorage.getItem('auth_token');

  // 2. If a token exists, clone the request and stitch the Authorization Header onto it
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Send the stamped request down the network pipeline
    return next(clonedRequest);
  }

  // If no token exists (like during a login request), let the request pass through un-stamped
  return next(req);
};
