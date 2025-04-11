import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [  
  { path: '', component: HomeComponent },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'events',
    loadComponent: () => import('./components/events/event-list/event-list.component').then(m => m.EventListComponent)
  },
  {
    path: 'events/:id',
    loadComponent: () => import('./components/events/event-detail/event-detail.component').then(m => m.EventDetailComponent)
  },
  {
    path: 'events/new',
    loadComponent: () => import('./components/events/event-form/event-form.component').then(m => m.EventFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'events/edit/:id',
    loadComponent: () => import('./components/events/event-form/event-form.component').then(m => m.EventFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'my-tickets',
    loadComponent: () => import('./components/tickets/ticket-list/ticket-list.component').then(m => m.TicketListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tickets/:id',
    loadComponent: () => import('./components/tickets/ticket-detail/ticket-detail.component').then(m => m.TicketDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./modules/admin/components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'users', loadComponent: () => import('./modules/admin/components/user-management/user-management.component').then(c => c.UserManagementComponent) },
      { path: 'events', loadComponent: () => import('./modules/admin/components/event-management/event-management.component').then(c => c.EventManagementComponent) },
      { path: 'tickets', loadComponent: () => import('./modules/admin/components/ticket-management/ticket-management.component').then(c => c.TicketManagementComponent) },
      { path: 'categories', loadComponent: () => import('./modules/admin/components/category-management/category-management.component').then(c => c.CategoryManagementComponent) },
      { path: 'analytics', loadComponent: () => import('./modules/admin/components/analytics-dashboard/analytics-dashboard.component').then(c => c.AnalyticsDashboardComponent) }
    ]
  }
];