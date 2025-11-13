import { Routes } from '@angular/router';
import { AdminGuard } from './services/admin-guard.guard';

export const routes: Routes = [
  {
  path: 'login',
  loadComponent: () =>
    import('./pages/login/login.component').then(m => m.LoginComponent),
},

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
  path: 'admin/users',
  canActivate: [AdminGuard],
  loadComponent: () =>
    import('./pages/users-list/users-list.component').then(m => m.UsersListComponent),
},
{
  path: 'admin/users/new',
  canActivate: [AdminGuard],
  loadComponent: () =>
    import('./pages/users/user-form/user-form.component').then(m => m.UserFormComponent),
},
{
  path: 'admin/users/:id/edit',
  loadComponent: () =>
    import('./pages/users/user-form/user-form.component').then(m => m.UserFormComponent),
},



  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
