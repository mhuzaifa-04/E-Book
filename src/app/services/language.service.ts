import { Injectable, signal } from '@angular/core';

export type Language = 'en' | 'ur';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // Using Angular Signals for instant UI reactivity
  currentLang = signal<Language>('en');

  private translations: Record<Language, Record<string, string>> = {
    en: {
      title: 'Al Furqan Library',
      subtitle: 'Click any book cover below to instantly download the PDF from our repository',
      searchPlaceholder: 'Search by book title...',
      allAuthors: 'All Authors',
      downloadBtn: '💾 Download PDF',
      loading: 'Connecting to backend API book repository service...',
      noBooks: 'No books found matching your criteria.',
      navHome: 'Home',
      navAbout: 'About My Mentor'
    },
    ur: {
      title: 'الفرقان لائبریری',
      subtitle: 'ہمارے ذخیرے سے پی ڈی ایف فوری ڈاؤن لوڈ کرنے کے لیے نیچے کسی بھی کتاب کے سرورق پر کلک کریں۔',
      searchPlaceholder: 'کتاب کا عنوان تلاش کریں...',
      allAuthors: 'تمام مصنفین',
      downloadBtn: '💾 پی ڈی ایف ڈاؤن لوڈ کریں',
      loading: 'بیک اینڈ سرور سے رابطہ ہو رہا ہے...',
      noBooks: 'آپ کی تلاش کے مطابق کوئی کتاب نہیں ملی۔',
      navHome: 'ہوم',
      navAbout: 'میرے مرشد کے بارے میں'
    }
  };

  toggleLanguage() {
    const nextLang = this.currentLang() === 'en' ? 'ur' : 'en';
    this.currentLang.set(nextLang);

    // Toggle page direction for RTL text handling (Urdu reads right-to-left)
    document.documentElement.dir = nextLang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  }

  translate(key: string): string {
    return this.translations[this.currentLang()][key] || key;
  }
}
