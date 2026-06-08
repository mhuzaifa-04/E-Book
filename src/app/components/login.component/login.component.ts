import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router'; // 🟢 Added RouterLink for registration link redirects

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // 🟢 Ensures template can parse routerLink
  templateUrl: './login.component.html',             // 🟢 Aligned file name path target
  styleUrls: ['./login.component.css']               // 🟢 Aligned stylesheet path target
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = { email: '', passwordHash: '' };
  errorMessage = '';

  // 🟢 Password visibility toggle variable tracking
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.errorMessage = '';
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid email or password credentials.';
      }
    });
  }
}
