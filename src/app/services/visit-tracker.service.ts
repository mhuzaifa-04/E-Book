import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

export interface GlobalStats {
  totalVisits: number;
  uniqueVisitors: number;
}

@Injectable({
  providedIn: 'root'
})
export class VisitTrackerService {
  private router = inject(Router);
  private http = inject(HttpClient);

  // 🟢 Updated to match your actual working backend server port
  private apiUrl = 'http://localhost:5091/api/analytics';

  trackVisit() {
    // 🌟 FIX: If they have a token OR have ever logged in on this machine before, skip the registration wall!
    if (localStorage.getItem('auth_token') || localStorage.getItem('is_returning_user') === 'true') {
      return;
    }

    let visits = parseInt(localStorage.getItem('site_visits') || '0', 10);
    let isBrandNewUser = false;

    if (!localStorage.getItem('site_visits')) {
      isBrandNewUser = true;
    }

    if (!sessionStorage.getItem('session_active')) {
      visits += 1;
      localStorage.setItem('site_visits', visits.toString());
      sessionStorage.setItem('session_active', 'true');

      this.http.post(`${this.apiUrl}/track`, { isUniqueUser: isBrandNewUser }).subscribe();
    }

    if (visits > 1) {
      this.router.navigate(['/register']);
    }
  }

  getGlobalServerStats(): Observable<GlobalStats> {
    return this.http.get<GlobalStats>(`${this.apiUrl}/stats`);
  }
}
