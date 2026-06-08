import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VisitTrackerService {
  private router = inject(Router);

  trackVisit() {
    // 1. If the user is already logged in, skip tracking entirely
    if (localStorage.getItem('token')) {
      return;
    }

    // 2. Retrieve existing visit count, or start at 0
    let visits = parseInt(localStorage.getItem('site_visits') || '0', 10);
    
    // 3. Increment the count on a new session load
    if (!sessionStorage.getItem('session_active')) {
      visits += 1;
      localStorage.setItem('site_visits', visits.toString());
      sessionStorage.setItem('session_active', 'true'); // Prevents increments on simple page refreshes
    }

    // 4. If they have visited more than 4 times, lock them out!
    if (visits > 4) {
      this.router.navigate(['/register']);
    }
  }

  getVisitCount(): number {
    return parseInt(localStorage.getItem('site_visits') || '0', 10);
  }
}