import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book.model';
import { CommonModule } from '@angular/common'; // Needed for the async pipe!
import { Observable } from 'rxjs';
import {ThemeService} from '../../../services/theme.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule], // <-- Keep this to provide the 'async' pipe utility
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  private bookService = inject(BookService);
  private router = inject(Router);
  public themeService = inject(ThemeService);

  
  // Change this variable type to hold an active async query stream reference instead of a static array
  books$!: Observable<Book[]>;

  ngOnInit(): void {
    // Fire off the API call stream immediately upon load initialization
    this.books$ = this.bookService.getBooks();
  }

  openBook(bookId: string): void {
    this.router.navigate(['/reader', bookId]);
  }
}
