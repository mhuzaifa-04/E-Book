import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';

interface Book {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  sequenceOrder?: number;
}

@Component({
  selector: 'app-manage-sequence',
  standalone: true,
  imports: [CommonModule], // 🟢 Pure and standard: No troublesome external dependencies
  templateUrl: './manage-sequence.html',
  styleUrls: ['./manage-sequence.css']
})
export class ManageSequence implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  public themeService = inject(ThemeService);

  public booksList = signal<Book[]>([]);
  public isSaving = signal<boolean>(false);
  public successMessage = signal<string | null>(null);

  // Track the index of the item currently being dragged
  private draggedItemIndex: number | null = null;

  ngOnInit(): void {
    this.loadBooksInSequence();
  }

  loadBooksInSequence(): void {
    this.http.get<Book[]>('http://localhost:5091/api/books').subscribe({
      next: (data) => {
        const sorted = data.sort((a, b) => (a.sequenceOrder ?? 0) - (b.sequenceOrder ?? 0));
        this.booksList.set(sorted);
      },
      error: (err) => console.error('Failed to load catalog sequence:', err)
    });
  }

  // 🟢 Native Drag Event: Fires when user grabs an item
  onDragStart(index: number): void {
    this.draggedItemIndex = index;
  }

  // 🟢 Native Drag Event: Allows item to be dragged over other list rows
  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Essential to allow dropping
  }

  // 🟢 Native Drop Event: Swaps items based on destination row index
  onDrop(targetIndex: number): void {
    if (this.draggedItemIndex === null || this.draggedItemIndex === targetIndex) return;

    const currentArray = [...this.booksList()];
    const itemToMove = currentArray.splice(this.draggedItemIndex, 1)[0];
    currentArray.splice(targetIndex, 0, itemToMove);

    this.booksList.set(currentArray);
    this.draggedItemIndex = null; // Reset tracker
  }

  onSaveSequence(): void {
    this.isSaving.set(true);
    this.successMessage.set(null);

    const updatedSequence = this.booksList().map((book, index) => ({
      ...book,
      sequenceOrder: index + 1
    }));

    this.http.put('http://localhost:5091/api/books/update-sequence', updatedSequence).subscribe({
      next: () => {
        this.successMessage.set('Library sequence optimized successfully!');
        this.isSaving.set(false);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err) => {
        console.error(err);
        this.isSaving.set(false);
      }
    });
  }

  backToHub(): void {
    this.router.navigate(['/admin']);
  }
}
