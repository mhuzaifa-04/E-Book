export interface Chapter {
  bookId: string;
  title: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  googleDriveLink: string;
  chapters: Chapter[];
}
