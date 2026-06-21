import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service'; // Adjust path based on your service folder structure

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  public themeService = inject(ThemeService);
  public currentYear = new Date().getFullYear();
}
