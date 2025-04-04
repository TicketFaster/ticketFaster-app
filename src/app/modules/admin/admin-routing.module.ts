import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent) },
      { path: 'users', loadComponent: () => import('./components/user-management/user-management.component').then(c => c.UserManagementComponent) },
      { path: 'events', loadComponent: () => import('./components/event-management/event-management.component').then(c => c.EventManagementComponent) },
      { path: 'tickets', loadComponent: () => import('./components/ticket-management/ticket-management.component').then(c => c.TicketManagementComponent) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { } 