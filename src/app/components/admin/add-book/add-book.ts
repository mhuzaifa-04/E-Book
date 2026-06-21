import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-book.html',
  styleUrls: ['./add-book.css']
})
export class AddBook implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  public themeService = inject(ThemeService);
  public languageService = inject(LanguageService);

  // Form Binding Fields
  public title = '';
  public author = '';
  public googleDriveLink = '';

  // Track binary files selected by user
  public selectedFile: File | null = null;
  public coverPreviewUrl = signal<string | null>(null);

  // Feedback Notification Signals
  public successMessage = signal<string | null>(null);
  public errorMessage = signal<string | null>(null);
  public isSubmitting = signal<boolean>(false);

  ngOnInit(): void {
    // Category initialization removed
  }

  /**
   * Captures the local computer file picker selection and renders a live preview image
   */
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Generates a local browser object URL to display an instant thumbnail preview canvas
      const reader = new FileReader();
      reader.onload = () => this.coverPreviewUrl.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  /**
   * Pushes file binary down to C# API pipeline, receives hosted cloud link, then saves metadata
   */
  onSaveBook(): void {
    // 🌟 FIXED VALIDATION: Removed the mandatory category field requirement check completely
    if (!this.title || !this.author || !this.selectedFile || !this.googleDriveLink) {
      this.errorMessage.set('All fields, including a cover image file upload, are mandatory.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Step A: Wrap binary image inside a FormData object container
    const uploadPayload = new FormData();
    uploadPayload.append('file', this.selectedFile, this.selectedFile.name);

    // Step B: Stream binary down to C# endpoint (which securely forwards to Cloudinary)
    this.http.post<any>('http://localhost:5091/api/books/upload-cover', uploadPayload).subscribe({
      next: (uploadRes) => {

        // Step C: Build the final book record payload without relational category parameters
        const finalBookPayload = {
          title: this.title,
          author: this.author,
          coverImage: uploadRes.coverImageUrl, // Live cloud link returned from backend
          googleDriveLink: this.googleDriveLink
        };

        // Step D: Post full payload down to write into your backend database pipeline repository
        this.http.post('http://localhost:5091/api/books', finalBookPayload).subscribe({
          next: () => {
            this.successMessage.set('Publication live assets hosted and stored successfully!');
            this.resetForm();
            this.isSubmitting.set(false);
          },
          error: (err) => {
            console.error(err);
            this.errorMessage.set('Failed saving record parameters downstream after cloud host validation.');
            this.isSubmitting.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Upload Error:', err);
        this.errorMessage.set('Media server upload link transmission failed. Check backend endpoint pipelines.');
        this.isSubmitting.set(false);
      }
    });
  }

  resetForm(): void {
    this.title = '';
    this.author = '';
    this.googleDriveLink = '';
    this.selectedFile = null;
    this.coverPreviewUrl.set(null);
  }

  backToHub(): void {
    this.router.navigate(['/admin']);
  }
}
