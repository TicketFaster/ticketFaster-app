import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './components/auth/register/register.component';
import { EventDetailComponent } from './components/events/event-detail/event-detail.component';
import { EventFormComponent } from './components/events/event-form/event-form.component';
import { EventListComponent } from './components/events/event-list/event-list.component';
import { TicketDetailComponent } from './components/tickets/ticket-detail/ticket-detail.component';
import { TicketListComponent } from './components/tickets/ticket-list/ticket-list.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { Component } from '@angular/core';

// Composant pour afficher le contenu du tableau de bord
@Component({
  template: '',
  standalone: true
})
export class EmptyDashboardComponent {}

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'events', component: EventListComponent },
  { path: 'events/:id', component: EventDetailComponent },
  { 
    path: 'events/new', 
    component: EventFormComponent, 
    canActivate: [authGuard, adminGuard] 
  },
  { 
    path: 'events/edit/:id', 
    component: EventFormComponent, 
    canActivate: [authGuard, adminGuard] 
  },
  { 
    path: 'my-tickets', 
    component: TicketListComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'tickets/:id', 
    component: TicketDetailComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'profile', 
    component: UserProfileComponent, 
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./modules/admin/components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: EmptyDashboardComponent },
      { path: 'users', loadComponent: () => import('./modules/admin/components/user-management/user-management.component').then(c => c.UserManagementComponent) },
      { path: 'events', loadComponent: () => import('./modules/admin/components/event-management/event-management.component').then(c => c.EventManagementComponent) },
      { path: 'tickets', loadComponent: () => import('./modules/admin/components/ticket-management/ticket-management.component').then(c => c.TicketManagementComponent) },
      { path: 'categories', loadComponent: () => import('./modules/admin/components/category-management/category-management.component').then(c => c.CategoryManagementComponent) },
      { path: 'analytics', loadComponent: () => import('./modules/admin/components/analytics-dashboard/analytics-dashboard.component').then(c => c.AnalyticsDashboardComponent) }
    ]
  }
];