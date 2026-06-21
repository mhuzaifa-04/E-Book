import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitTrackerService, GlobalStats } from '../../../services/visit-tracker.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  private analyticsService = inject(VisitTrackerService);
  private router = inject(Router);

  // Signals for global metrics
  globalStats = signal<GlobalStats | null>(null);
  isLoading = signal<boolean>(true);
    public isSubmitting = signal<boolean>(false);


  ngOnInit(): void {
    this.refreshAnalytics();
  }

  refreshAnalytics(): void {
    this.isLoading.set(true);
    this.analyticsService.getGlobalServerStats().subscribe({
      next: (data) => {
        this.globalStats.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to read database traffic logs:', err);
        this.isLoading.set(false);
      }
    });
  }


  backToHub(): void {
    this.router.navigate(['/admin']);
  }
}