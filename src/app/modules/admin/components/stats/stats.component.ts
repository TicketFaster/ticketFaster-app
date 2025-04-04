import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class StatsComponent implements OnChanges {
  @Input() stats: any = {
    totalEvents: 0,
    totalUsers: 0,
    totalTickets: 0,
    upcomingEvents: 0,
    ticketsSold: 0,
    revenue: 0,
    totalCategories: 0
  };

  @Input() loading: boolean = true;
  
  statCards: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stats']) {
      this.initializeStatCards();
    }
  }

  private initializeStatCards(): void {
    this.statCards = [
      {
        title: 'Événements',
        value: this.stats.totalEvents,
        icon: 'fas fa-calendar-alt',
        iconBg: '#5540af',
        description: `${this.stats.upcomingEvents} à venir`,
        trend: 5, // Pourcentage d'augmentation
        color: '#5540af'
      },
      {
        title: 'Utilisateurs',
        value: this.stats.totalUsers,
        icon: 'fas fa-users',
        iconBg: '#ff5e8a',
        description: `${Math.floor(this.stats.totalUsers * 0.6)} actifs`,
        trend: 12,
        color: '#ff5e8a'
      },
      {
        title: 'Billets vendus',
        value: this.stats.ticketsSold,
        icon: 'fas fa-ticket-alt',
        iconBg: '#3498db',
        description: `${Math.round((this.stats.ticketsSold / this.stats.totalTickets) * 100)}% de disponibilité`,
        trend: 8,
        color: '#3498db'
      },
      {
        title: 'Revenus',
        value: `${this.stats.revenue} €`,
        icon: 'fas fa-euro-sign',
        iconBg: '#2ecc71',
        description: `${Math.floor(this.stats.revenue / 30)} € / jour en moyenne`,
        trend: 15,
        color: '#2ecc71'
      },
      {
        title: 'Catégories',
        value: this.stats.totalCategories,
        icon: 'fas fa-tags',
        iconBg: '#e67e22',
        description: `Organisation des événements`,
        trend: 7,
        color: '#e67e22'
      }
    ];
  }
} 