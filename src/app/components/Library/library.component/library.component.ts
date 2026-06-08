import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 🟢 Required for search [(ngModel)] binding
import { BookService } from '../../../services/book.service';
import { ThemeService } from '../../../services/theme.service';
import { LanguageService } from '../../../services/language.service';
import { VisitTrackerService } from '../../../services/visit-tracker.service';
import { Book } from '../../../models/book.model';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  // Injecting our core framework services
  public bookService = inject(BookService);
  public themeService = inject(ThemeService);
  public languageService = inject(LanguageService);
  public visitTrackerService = inject(VisitTrackerService);

  // Core Data Tracking Streams
  books$!: Observable<Book[]>;
  allBooksRaw = signal<Book[]>([]);

  // Search & Filtering State Flags
  searchQuery = signal<string>('');
  selectedAuthor = signal<string>('All');

  // 🔍 Dynamic Calculation: Grabs list of unique authors from whatever books load up
  authorsList = computed(() => {
    const books = this.allBooksRaw();
    const authors = books.map(b => b.author || 'Unknown Author');
    return ['All', ...Array.from(new Set(authors))];
  });

  // 🎯 Dynamic Filter Pipeline: Instantly filters your view on keystroke or dropdown click
  filteredBooks = computed(() => {
    let list = this.allBooksRaw();
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
    if (!path) return 'assets/default-cover.webp'; // Optional fallback image if empty

    // Clean up any double slashes or leading slashes to keep the path relative
    let cleanPath = path.trim();
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }

    return cleanPath;
  }

  ngOnInit() {
    // Fetch books from C# Backend API and pipe them directly into our local reactive signals
    this.books$ = this.bookService.getBooks().pipe(
      tap(books => this.allBooksRaw.set(books))
    );
    // Track the visit when the component initializes
    this.visitTrackerService.trackVisit();
  }
}
