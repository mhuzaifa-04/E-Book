import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  // 1. Use the modern inject token pattern to load the HTTP client
  private http = inject(HttpClient);

  // 2. Define the exact address string matching your running .NET API server port
  private apiUrl = 'http://localhost:5091/api/books';

  constructor() {}

  // 3. Query: Fetch all books as an asynchronous data stream
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  // 4. Query: Fetch a single book profile by appending its unique ID route extension
  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }
}
