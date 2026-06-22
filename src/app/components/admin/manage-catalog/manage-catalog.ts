import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-manage-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-catalog.html',
  styleUrls: ['./manage-catalog.css']
})
export class ManageCatalog implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  public themeService = inject(ThemeService);
  public languageService = inject(LanguageService);

  private apiUrl = '/api/books';

  // Reactive Data State Tracking
  public books = signal<any[]>([]);
  public activeMenuBookId = signal<string | null>(null);
  public successMessage = signal<string | null>(null);
  public errorMessage = signal<string | null>(null);
  public isSavingSequence = signal<boolean>(false); // 🟢 Tracks state of backend layout save actions

  // Inline Editing Form State Controllers
  public isEditingMode = signal<boolean>(false);
  public targetEditingId = '';
  public title = '';
  public author = '';
  public coverImage = '';
  public googleDriveLink = '';

  // 🟢 Native Drag Tracker Index
  private draggedItemIndex: number | null = null;

  ngOnInit() {
    this.fetchCatalog();

    // Global listener to close floating contextual windows when clicking outside row scopes
    window.addEventListener('click', () => {
      this.activeMenuBookId.set(null);
    });
  }

  fetchCatalog() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        // 🟢 Automatically displays list elements ordered precisely by their sequenceOrder property
        const sortedData = data.sort((a, b) => {
          const orderA = a.sequenceOrder ?? a.SequenceOrder ?? 0;
          const orderB = b.sequenceOrder ?? b.SequenceOrder ?? 0;
          return orderA - orderB;
        });
        this.books.set(sortedData);
      },
      error: (err) => this.errorMessage.set('Could not fetch storage repository data array nodes.')
    });
  }

  // 🟢 NATIVE DRAG: Triggered when admin holds a row item down
  onDragStart(index: number): void {
    this.draggedItemIndex = index;
  }

  // 🟢 NATIVE DRAG: Signals validation checks to the browser engine to allow element swapping
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  // 🟢 NATIVE DROP: Rearranges elements reactively in local memory arrays instantly
  onDrop(targetIndex: number): void {
    if (this.draggedItemIndex === null || this.draggedItemIndex === targetIndex) return;

    const currentList = [...this.books()];
    const itemToMove = currentList.splice(this.draggedItemIndex, 1)[0];
    currentList.splice(targetIndex, 0, itemToMove);

    this.books.set(currentList);
    this.draggedItemIndex = null; // Clear index reference anchor
  }

  // 🟢 SAVE TO CLOUD STORAGE: Commits custom arranged positions directly to the books.json backend
  onSaveSequence(): void {
  this.isSavingSequence.set(true);
  this.successMessage.set(null);
  this.errorMessage.set(null);

  const updatedPayload = this.books().map((book, index) => {
    // 🟢 Safety fallback check to capture both casing conventions flawlessly
    return {
     id: String(book.id !== undefined ? book.id : book.Id),
     title: book.title !== undefined ? book.title : book.Title,
      author: book.author !== undefined ? book.author : book.Author,
      coverImage: book.coverImage !== undefined ? book.coverImage : book.CoverImage,
      googleDriveLink: book.googleDriveLink !== undefined ? book.googleDriveLink : book.GoogleDriveLink,
      sequenceOrder: index + 1
    };
  });

  this.http.put(`${this.apiUrl}/update-sequence`, updatedPayload).subscribe({
    next: () => {
      this.successMessage.set('Catalog visual display sequence updated cleanly!');
      this.isSavingSequence.set(false);
      this.fetchCatalog(); // Re-sync storage arrays natively
      setTimeout(() => this.successMessage.set(null), 4000);
    },
    error: () => {
      this.errorMessage.set('Failed saving newly assigned sequence layout configurations down to database.');
      this.isSavingSequence.set(false);
    }
  });
}

  toggleActionMenu(event: Event, bookId: string) {
    event.stopPropagation(); // Stops the event from hitting our global window click listener
    this.activeMenuBookId.set(this.activeMenuBookId() === bookId ? null : bookId);
  }

  onTriggerEditMode(book: any) {
    this.isEditingMode.set(true);
    this.targetEditingId = book.id !== undefined ? book.id : book.Id;
    this.title = book.title || book.Title;
    this.author = book.author || book.Author;
    this.coverImage = book.coverImage || book.CoverImage;
    this.googleDriveLink = book.googleDriveLink || book.GoogleDriveLink;
  }

  onUpdateBook() {
    const payload = {
      title: this.title,
      author: this.author,
      coverImage: this.coverImage,
      googleDriveLink: this.googleDriveLink
    };

    this.http.put(`${this.apiUrl}/${this.targetEditingId}`, payload).subscribe({
      next: () => {
        this.successMessage.set('Book details updated smoothly!');
        this.isEditingMode.set(false);
        this.fetchCatalog(); // Refresh current display states
      },
      error: () => this.errorMessage.set('Failed to write updates downstream to persistent json arrays.')
    });
  }

  onDeleteBook(bookId: any) {
    if (confirm('Are you absolutely sure you want to drop this catalog publication row permanently?')) {
      this.http.delete(`${this.apiUrl}/${bookId}`).subscribe({
        next: () => {
          this.successMessage.set('Publication deleted successfully!');
          this.fetchCatalog();
        },
        error: () => this.errorMessage.set('Failed dropping record entry from storage streams.')
      });
    }
  }

  cancelEdit() {
    this.isEditingMode.set(false);
  }

  backToHub() {
    this.router.navigate(['/admin']);
  }
}
