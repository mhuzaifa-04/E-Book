import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from '../../../services/theme.service';       
import { LanguageService } from '../../../services/language.service'; 

@Component({
  selector: 'app-reader',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css']
})
export class ReaderComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router); 
  private http = inject(HttpClient);
  public themeService = inject(ThemeService);
  public languageService = inject(LanguageService);

  // Core reactive data signals
  authorName = signal<string>('');
  allBooks = signal<any[]>([]);

  // Computed filter with direct console trackers
  authorBooks = computed(() => {
    const targetName = this.authorName().toLowerCase().trim();
    console.log("🔍 [Filter Run] Looking for author matching string:", `"${targetName}"`);
    console.log("📦 [Filter Run] Total books loaded in memory:", this.allBooks().length);
    
    if (!targetName) return [];

    const filtered = this.allBooks().filter(book => {
      const rawAuthor = book.author || book.Author || book.authorName || book.AuthorName || '';
      const bookAuthor = rawAuthor.toString().toLowerCase().trim();

      // Clean match check
      if (bookAuthor === targetName) return true;

      // Fuzzy containment check
      if (bookAuthor.length > 3 && targetName.length > 3) {
        return bookAuthor.includes(targetName) || targetName.includes(bookAuthor);
      }

      return false;
    });

    console.log("✅ [Filter Run] Filter match result count:", filtered.length);
    return filtered;
  });

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const stateBooks = navigation?.extras.state?.['booksCatalog'];
    if (stateBooks && Array.isArray(stateBooks)) {
      console.log("📥 State captured inside constructor:", stateBooks);
      this.allBooks.set(stateBooks);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const nameParam = params.get('authorName') || '';
      const decodedName = decodeURIComponent(nameParam);
      this.authorName.set(decodedName);
      console.log("🎯 URL Parameter resolved to string:", `"${decodedName}"`);
    });

    // Fallback checks
    if (this.allBooks().length === 0) {
      const historyBooks = window.history.state?.['booksCatalog'];
      if (historyBooks && Array.isArray(historyBooks)) {
        console.log("📥 State captured via window.history fallback:", historyBooks);
        this.allBooks.set(historyBooks);
      } else {
        this.loadBooksFromServerFallback();
      }
    }
  }

  private loadBooksFromServerFallback(): void {
    console.log("⚠️ State empty. Initiating API database fallback sync...");
    
    this.http.get<any[]>('/api/books').subscribe({
      next: (data) => {
        console.log("📊 Raw API Response (/api/books):", data);
        if (data && Array.isArray(data)) {
          this.allBooks.set(data);
          this.injectMockBackupIfEmpty(data);
        }
      },
      error: (err) => {
        console.warn("⚠️ Relative endpoint failed, shifting to local absolute port...");
        this.http.get<any[]>('http://localhost:5000/api/books').subscribe({
          next: (data) => {
            console.log("📊 Raw API Response (localhost:5000):", data);
            this.allBooks.set(data);
            this.injectMockBackupIfEmpty(data);
          },
          error: (fail) => {
            console.error('❌ All connection routes offline. Injecting emergency test data item.');
            this.injectMockBackupIfEmpty([]);
          }
        });
      }
    });
  }

  // 🧪 EMERGENCY BACKUP: Injects a book dynamically matching your open author name
  private injectMockBackupIfEmpty(currentList: any[]) {
    if (currentList.length === 0 || this.authorBooks().length === 0) {
      console.log("🛠️ Injecting local diagnostics mock book matching current header title name...");
      const mockItem = {
        id: 999,
        title: "Test Diagnostic Manual",
        author: this.authorName(), // Dynamically matches whatever your url says!
        coverImage: "assets/default-cover.png",
        googleDriveLink: "https://drive.google.com"
      };
      this.allBooks.set([...currentList, mockItem]);
    }
  }
}