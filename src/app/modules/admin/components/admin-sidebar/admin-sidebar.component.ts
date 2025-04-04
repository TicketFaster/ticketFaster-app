import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AdminSidebarComponent {
  menuItems = [
    { 
      label: 'Tableau de bord', 
      icon: 'fas fa-tachometer-alt', 
      route: '/admin/dashboard',
      active: true
    },
    { 
      label: 'Utilisateurs', 
      icon: 'fas fa-users', 
      route: '/admin/users',
      active: false
    },
    { 
      label: 'Événements', 
      icon: 'fas fa-calendar-alt', 
      route: '/admin/events',
      active: false
    },
    { 
      label: 'Catégories', 
      icon: 'fas fa-tags', 
      route: '/admin/categories',
      active: false
    },
    { 
      label: 'Billets', 
      icon: 'fas fa-ticket-alt', 
      route: '/admin/tickets',
      active: false
    },
    { 
      label: 'Analytiques', 
      icon: 'fas fa-chart-line', 
      route: '/admin/analytics',
      active: false
    },
    { 
      label: 'Statistiques', 
      icon: 'fas fa-chart-bar', 
      route: '/admin/stats',
      active: false
    },
    { 
      label: 'Paramètres', 
      icon: 'fas fa-cog', 
      route: '/admin/settings',
      active: false
    }
  ];
  
  isSidebarCollapsed = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  setActive(item: any): void {
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 