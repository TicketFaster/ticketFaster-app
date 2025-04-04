import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { EventService } from '../../../../services/event.service';
import { AuthService } from '../../../../services/auth.service';
import { CategoryService } from '../../../../services/category.service';
import { User } from '../../../../models/user';
import { Category } from '../../../../models/category';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { StatsComponent } from '../stats/stats.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminSidebarComponent,
    StatsComponent
  ]
})
export class AdminDashboardComponent implements OnInit {
  currentAdmin: User | null = null;
  stats = {
    totalEvents: 0,
    totalUsers: 0,
    totalTickets: 0,
    upcomingEvents: 0,
    ticketsSold: 0,
    revenue: 0,
    totalCategories: 0
  };
  recentActivity: any[] = [];
  loading = true;
  categories: Category[] = [];
  topCategories: {name: string, percentage: number}[] = [];

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private categoryService: CategoryService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getAdminInfo();
    this.loadDashboardStats();
    this.loadRecentActivity();
    this.loadCategories();
  }

  private getAdminInfo(): void {
    // Récupérer les informations de l'administrateur
    this.authService.currentUser$.subscribe(user => {
      this.currentAdmin = user;
    });
  }

  private loadDashboardStats(): void {
    // Ici vous feriez un appel à votre API pour récupérer les statistiques
    // Pour cet exemple, je vais simuler des données
    setTimeout(() => {
      this.stats = {
        totalEvents: 78,
        totalUsers: 652,
        totalTickets: 2417,
        upcomingEvents: 23,
        ticketsSold: 1897,
        revenue: 54280,
        totalCategories: 8
      };
      this.loading = false;
    }, 1000);
  }

  private loadRecentActivity(): void {
    // Ici vous feriez un appel à votre API pour récupérer l'activité récente
    // Pour cet exemple, je vais simuler des données
    setTimeout(() => {
      this.recentActivity = [
        { type: 'user', action: 'inscription', user: 'Sophie Martin', date: new Date().toISOString() },
        { type: 'ticket', action: 'achat', user: 'Thomas Dubois', event: 'Concert de Jazz', quantity: 2, date: new Date().toISOString() },
        { type: 'event', action: 'création', event: 'Festival de Rock', admin: 'Admin', date: new Date().toISOString() },
        { type: 'category', action: 'création', category: 'Festival', admin: 'Admin', date: new Date().toISOString() },
        { type: 'ticket', action: 'annulation', user: 'Marie Leroy', event: 'Théâtre classique', date: new Date().toISOString() },
        { type: 'user', action: 'connexion', user: 'Lucas Bernard', date: new Date().toISOString() }
      ];
    }, 1500);
  }
  
  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.calculateTopCategories();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    });
  }
  
  private calculateTopCategories(): void {
    // Calculer le nombre total d'événements
    const totalEvents = this.categories.reduce((total, category) => total + (category.eventCount || 0), 0);
    
    // Calculer le pourcentage pour chaque catégorie et trier par ordre décroissant
    this.topCategories = this.categories
      .map(category => ({
        name: category.name,
        percentage: totalEvents > 0 ? Math.round((category.eventCount || 0) * 100 / totalEvents) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3); // Garder seulement les 3 premières
  }
} 