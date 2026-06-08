import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  public authService = inject(AuthService);

  private apiUrl = 'http://localhost:5091/api/books';

  // 🟢 Live Table state container signal
  books = signal<any[]>([]);

  // Form Value Model States
  title = '';
  author = '';
  coverImage = '';
  googleDriveLink = '';

  // UI State Handlers
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  // 🟢 Edit state variables tracker
  isEditingMode = false;
  activeEditingBookId: number | null = null;

  // 🟢 Runs automatically when admin route loads up
  ngOnInit() {
    this.refreshCatalogList();
  }

  // 🟢 Fetches active rows directly from your database backend
  refreshCatalogList() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => this.books.set(data),
      error: (err) => console.error('Error listing backend books schema rows', err)
    });
  }

  // 🟢 Unified Dynamic save handler (Handles both additions and modifications)
  onSaveBook() {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    if (!this.title || !this.author || !this.coverImage || !this.googleDriveLink) {
      this.errorMessage.set('All form fields are strictly mandatory to process a book object.');
      return;
    }

    const bookPayload = {
      title: this.title,
      author: this.author,
      coverImage: this.coverImage,
      googleDriveLink: this.googleDriveLink,
      chapters: []
    };

    if (this.isEditingMode && this.activeEditingBookId !== null) {
      // 🟢 Dispatch PUT request for editing mode
      this.http.put(`${this.apiUrl}/${this.activeEditingBookId}`, bookPayload).subscribe({
        next: () => {
          this.successMessage.set(`✨ Success: "${this.title}" fields updated successfully!`);
          this.resetForm();
          this.refreshCatalogList();
        },
        error: (err) => this.errorMessage.set(err.error?.message || 'Unauthorized action or payload schema failure.')
      });
    } else {
      // 🟢 Dispatch original POST request for adding a fresh book
      this.http.post(this.apiUrl, bookPayload).subscribe({
        next: () => {
          this.successMessage.set(`✨ Success: "${this.title}" added smoothly to database catalog!`);
          this.resetForm();
          this.refreshCatalogList();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Unauthorized admin token. Check authorization role privileges.');
        }
      });
    }
  }

  // 🟢 Triggers when an admin clicks an "Edit" button row item
  onTriggerEditMode(book: any) {
    this.isEditingMode = true;
    this.activeEditingBookId = book.id || book.Id;
    this.title = book.title || book.Title;
    this.author = book.author || book.Author;
    this.coverImage = book.coverImage || book.CoverImage;
    this.googleDriveLink = book.googleDriveLink || book.GoogleDriveLink;
  }

  // 🟢 Triggers when an admin clicks a "Delete" button row item
  onDeleteBook(bookId: number) {
    if (!confirm('Are you absolutely sure you want to drop this book entry row permanently?')) return;

    this.http.delete(`${this.apiUrl}/${bookId}`).subscribe({
      next: () => {
        this.successMessage.set('🗑️ Book object cleanly purged from storage schemas.');
        this.refreshCatalogList();
        if (this.activeEditingBookId === bookId) this.resetForm();
      },
      error: (err) => this.errorMessage.set(err.error?.message || 'Could not drop row context.')
    });
  }

  // 🟢 Resets state cleanly back to blank insertion mode configuration
  public resetForm() {
    this.title = '';
    this.author = '';
    this.coverImage = '';
    this.googleDriveLink = '';
    this.isEditingMode = false;
    this.activeEditingBookId = null;
  }

  goToLibrary() {
    this.router.navigate(['/']);
  }
}
