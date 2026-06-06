import { Component, OnInit, inject } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { Book, Chapter } from '../../../models/book.model';
import { ThemeService } from "../../../services/theme.service";
import { CommonModule } from '@angular/common'; // 🟢 Added to ensure async/structural pipelines work cleanly

@Component({
  selector: 'app-reader',
  standalone: true,
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css'],
  imports: [CommonModule] // 🟢 Included CommonModule for clean rendering
})
export class ReaderComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookService: BookService = inject(BookService);
  
  // Expose global ThemeService safely to the template
  public themeService: ThemeService = inject(ThemeService);

  currentBook: Book | undefined; 
  activeChapter: Chapter | undefined;
  activeChapterIndex: number = 0;
  fontSize: number = 18;

  constructor() {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.bookService.getBookById(bookId).subscribe({
        next: (bookData: Book) => {
          this.currentBook = bookData;

          if (this.currentBook && this.currentBook.chapters.length > 0) {
            const savedProgressKey = `book_progress_${bookId}`;
            const savedChapterIndex = localStorage.getItem(savedProgressKey);

            if (savedChapterIndex !== null) {
              this.selectChapter(parseInt(savedChapterIndex, 10));
            } else {
              this.selectChapter(0);
            }
          }
        },
        error: (err) => console.error('Failed to load book from backend API:', err)
      });
    }
  }

  selectChapter(index: number): void {
    if (this.currentBook && index >= 0 && index < this.currentBook.chapters.length) {
      this.activeChapterIndex = index;
      this.activeChapter = this.currentBook.chapters[index];
      
      // Save your progress safely to localstorage context
      const bookId = this.route.snapshot.paramMap.get('id');
      if (bookId) {
        localStorage.setItem(`book_progress_${bookId}`, index.toString());
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  changeFontSize(amount: number): void {
    const targetSize = this.fontSize + amount;
    if (targetSize >= 14 && targetSize <= 28) {
      this.fontSize = targetSize;
    }
  }

  // 🟢 FIXED: Updates the global core engine state so layouts don't crash
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  goBackToLibrary(): void {
    this.router.navigate(['/']);
  }
}