import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../services/book.service';
import { ThemeService } from '../../../services/theme.service';
import { LanguageService } from '../../../services/language.service';
import { VisitTrackerService } from '../../../services/visit-tracker.service';
import { Book } from '../../../models/book.model';
import { HttpClient } from "@angular/common/http";
import { RouterLinkActive } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router'; // Ensure this is imported at the top

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  // Injecting framework and business logic services
  public bookService = inject(BookService);
  public themeService = inject(ThemeService);
  public languageService = inject(LanguageService);
  public visitTrackerService = inject(VisitTrackerService);
  private http = inject(HttpClient);
  private router = inject(Router);

// Inject the router service into your class:

  private apiUrl = '/api/books';

  // Core Reactive Data Tracking Signals
  public books = signal<Book[]>([]);
  public searchQuery = signal<string>('');
  public selectedAuthor = signal<string>('All');

    // 1. Inside your component class, add this state tracker:
currentView: 'books' | 'authors' = 'books';

  // 🟢 UNIFIED NOGONINIT ROUTINE: Handles tracking activations and stream downloads together
  ngOnInit(): void {
  // 🟢 1. First, fetch your library data natively
  this.fetchPublicLibrary();
  this.visitTrackerService.trackVisit();

  // 🟢 2. FIX: Reset filter signals/variables so your book grid doesn't hide on load
  this.currentView = 'books'; // Forces view to display the main book grid first

  // Reset search properties if they are Angular Signals:
  if (typeof this.searchQuery === 'function' && 'set' in this.searchQuery) {
    this.searchQuery.set('');
  }
  if (typeof this.selectedAuthor === 'function' && 'set' in this.selectedAuthor) {
    this.selectedAuthor.set('All');
  }
}

  // 🟢 FIXED CLOSING BRACKETS: Pulls catalog from backend, sorts it by sequence rank, and updates signal
  fetchPublicLibrary(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        const sortedData = data.sort((a, b) => {
          const orderA = a.sequenceOrder ?? a.SequenceOrder ?? 0;
          const orderB = b.sequenceOrder ?? b.SequenceOrder ?? 0;
          return orderA - orderB;
        });
        this.books.set(sortedData);
      },
      error: (err) => console.error('Failed loading public library collection:', err)
    });
  }

  // 🔍 Dynamic Calculation: Automatically aggregates unique authors from loaded books catalog
  authorsList = computed(() => {
    const booksList = this.books();
    const authors = booksList.map(b => b.author || 'Unknown Author');
    return ['All', ...Array.from(new Set(authors))];
  });

  // 🎯 Dynamic Filter Pipeline: Instantly filters view grid on keypress or select input change
  filteredBooks = computed(() => {
    let list = this.books();
    const query = this.searchQuery().toLowerCase().trim();
    const author = this.selectedAuthor();

    if (author !== 'All') {
      list = list.filter(b => b.author === author);
    }

    if (query) {
      list = list.filter(b => b.title?.toLowerCase().includes(query));
    }

    return list;
  });

  formatAssetPath(path: string): string {
    if (!path) return 'assets/default-cover.png';

    let cleanPath = path.trim();
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }

    return cleanPath;
  }



// 2. Add this helper function to dynamically pull author names from your existing books signal/list:
getUniqueAuthors(): string[] {
  // 🟢 Extract the raw array list from your books signal
  const allBooks = this.books() || [];

  const authors = allBooks.map(book => {
    // 🔍 Check every possible casing variation coming from your C# JSON serialization
    const authorName = book.author || book.author;

    // If it's a number or missing, skip it to prevent displaying "1"
    if (!authorName || typeof authorName === 'number') {
      return null;
    }

    return authorName.trim();
  }).filter(Boolean) as string[];

  // 🌟 Set returns unique values only, ensuring duplicate folders are removed
  return [...new Set(authors)];
}

openAuthorFolder(authorName: string) {
  if (!authorName) return;

  // 🟢 Navigates explicitly using root-relative path segments to pass validation checks
  this.router.navigate(['/reader', authorName.trim()], {
    state: { booksCatalog: this.books() }
  });
}

// 🟢 Add this helper method inside your Component Class
getOptimizedCover(url: string): string {
  if (!url) return 'assets/default-cover.png';

  // Check if the image is coming from your Cloudinary account
  if (url.includes('cloudinary.com')) {
    // Injects width=300px scaling right after the /upload/ folder path segment
    return url.replace('/upload/', '/upload/w_300,c_scale,q_auto,f_auto/');
  }

  return url;
}
}
