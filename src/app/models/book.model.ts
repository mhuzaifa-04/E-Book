export interface Chapter {
  id: number;
  title: string;
  content: string; // The actual story text for this chapter
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string; // URL or path to the asset image
  chapters: Chapter[];
}
