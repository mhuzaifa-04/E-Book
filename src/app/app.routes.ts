import { Routes } from '@angular/router';
import { LibraryComponent } from './components/Library/library.component/library.component';
import { ReaderComponent } from './components/Reader/reader.component/reader.component';
import { LoginComponent } from './components/login.component/login.component';
import {  About } from './components/about/about';
import { AdminComponent } from './components/admin/admin';
import { adminGuard } from './guards/admin.guard';
import { RegisterComponent } from './components/register/register';
import { AnalyticsComponent } from './components/admin/analytics/analytics';
import { AddBook } from './components/admin/add-book/add-book';
import { ManageCatalog } from './components/admin/manage-catalog/manage-catalog';
import { ManageSequence } from './components/admin/manage-sequence/manage-sequence';
import { AdminDashboard } from './components/admin/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: LibraryComponent },                       // Main entry route path
{ path: 'reader/:authorName', component: ReaderComponent }, // 🟢 Matches your folder lookup loop!  { path: 'about', component: About },
  { path: 'register', component: RegisterComponent },                // Static path routing
  { path: "login", component: LoginComponent },
  { path: 'about', component: About },
  { path: 'admin',
    children: [
      {
        path: '',
        component: AdminComponent // This is your new Central Menu Hub launcher page
      },
      {
        path: 'add-book',
        component: AddBook // The isolated creation form component
      },
      {
        path: 'manage-sequence',
        component: ManageSequence // The vertical row stack list
      },
      {
        path: 'manage-catalog',
        component: ManageCatalog // Alternative 3: The vertical row stack list
      },      {
        path: 'analytics',
        component: AnalyticsComponent // Server Status & Memory Diagnostics dashboard
      },
      {
        path: 'admin-dashboard',
        component: AdminDashboard // The new Admin Dashboard component
      }
    ], canActivate: [adminGuard] },

  { path: '**', redirectTo: 'library', pathMatch: 'full' }                                   // Catch-all wild card routing navigation safety net
];
