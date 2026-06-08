import { Routes } from '@angular/router';
import { LibraryComponent } from './components/Library/library.component/library.component';
import { ReaderComponent } from './components/Reader/reader.component/reader.component';
import { LoginComponent } from './components/login.component/login.component';
import { About } from './components/about/about';
import { AdminComponent } from './components/admin/admin';
import { adminGuard } from './guards/admin.guard';
import { RegisterComponent } from './components/register/register';

export const routes: Routes = [
  { path: '', component: LibraryComponent },                       // Main entry route path
  { path: 'reader/:id', component: ReaderComponent },              // Dynamic parameter parameter matching routing path
  { path: 'about', component: About },
  { path: 'register', component: RegisterComponent },                // Static path routing
  { path: "login", component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }                                   // Catch-all wild card routing navigation safety net
];
