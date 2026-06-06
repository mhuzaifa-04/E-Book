export interface Book {
  id: string;
  title: string;          // Book Name
  author: string;         // Author Name
  coverImage: string;     // Book Cover Image Path
  googleDriveLink: string; // 🔗 Google Drive Download Link
  chapters: Chapter[];    // Parts of the book
}

export interface Chapter {
  id: number;
  title: string;          // Part/Chapter Title
  content: string;        // Light text reading content
}
