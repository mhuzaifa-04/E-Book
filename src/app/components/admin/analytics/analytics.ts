import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class AnalyticsComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  public themeService = inject(ThemeService);
  public languageService = inject(LanguageService);

  private apiUrl = '/api/diagnostics/server-status';

  // Reactive dashboard signals
  public diagnosticData = signal<any>(null);
  public isLoading = signal<boolean>(true);
  public errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.fetchDiagnostics();
  }

  fetchDiagnostics() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.http.get(this.apiUrl).subscribe({
      next: (data) => {
        this.diagnosticData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Telemetry node connection error:', err);
        this.errorMessage.set('Failed to connect to system diagnostic telemetry nodes.');
        this.isLoading.set(false);
      }
    });
  }

  backToHub() {
    this.router.navigate(['/admin']);
  }
}
