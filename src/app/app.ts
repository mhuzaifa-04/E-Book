import { Component,  signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { ThemeService } from './services/theme.service';
import { HttpClient} from '@angular/common/http';
import { About } from "./components/about/about";

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit  {
  protected readonly title = signal('E-Book');
  public themeService = inject(ThemeService);

  private http = inject(HttpClient);

  isSidebarCollapsed = false;
  categories = signal<any[]>([]);

  ngOnInit() {
this.refreshCategoriesSidebarContent();  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

 refreshCategoriesSidebarContent(): void {
    // 🟢 Connects to your successfully compiled C# .NET Backend controller!
    this.http.get<any[]>('http://localhost:5091/api/categories').subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.categories.set(data);
        }
      },
      error: (err) => console.error('Sidebar categorization loop disconnected:', err)
    });
  }

  selectCategory(id: number, name: string): void {
    console.log(`Filtering UI context focus row to profile Category ID: ${id} (${name})`);
    // This context selection hook will be wired up to filter your catalog dashboard grids next!
  }
}

