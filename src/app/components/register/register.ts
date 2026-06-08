import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // 🟢 SYNCED: Property renamed from passwordHash to password
  user = {
    username: '',
    email: '',
    passwordHash: ''
  };

  errorMessage = '';
  successMessage = '';
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.user.username || !this.user.email || !this.user.passwordHash) {
      this.errorMessage = 'Please fill out all fields completely.';
      return;
    }

    this.authService.register(this.user).subscribe({
      next: () => {
        this.successMessage = 'Account created successfully! Redirecting...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed. Try again.';
      }
    });
  }
}
