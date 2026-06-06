import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  
  // Track dark mode globally with an Angular Signal
  isDarkMode = signal<boolean>(this.getInitialTheme());

  constructor() {
    // Automatically apply or remove the .dark-mode class from the <body> tag whenever the signal changes
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const darkActive = this.isDarkMode();
        if (darkActive) {
          document.body.classList.add('dark-mode');
          localStorage.setItem('theme', 'dark');
        } else {
          document.body.classList.remove('dark-mode');
          localStorage.setItem('theme', 'light');
        }
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update(dark => !dark);
  }

  private getInitialTheme(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  }
}