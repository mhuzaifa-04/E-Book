import { Routes } from '@angular/router';
import { LibraryComponent } from './components/Library/library.component/library.component';
import { ReaderComponent } from './components/Reader/reader.component/reader.component';
import { LoginComponent } from './components/login.component/login.component';


export const routes: Routes = [
  { path: '', component: LibraryComponent },                       // Main entry route path
  { path: 'reader/:id', component: ReaderComponent },              // Dynamic parameter parameter matching routing path
  { path: "login", component: LoginComponent },
  { path: '**', redirectTo: '' }                                   // Catch-all wild card routing navigation safety net
];
