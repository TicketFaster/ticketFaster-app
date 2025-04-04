// src/app/pages/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe, CurrencyPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { EventModel } from '../../models/event';
import { Ticket } from '../../models/ticket';

// src/app/pages/admin-dashboard/admin-dashboard.component.ts
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, RouterLink, DatePipe, CurrencyPipe] // Ajout de NgClass ici
})
export class AdminDashboardComponent implements OnInit {
  events: EventModel[] = [];
  recentTickets: Ticket[] = [];
  loading = {
    events: false,
    tickets: false
  };
  error = {
    events: '',
    tickets: ''
  };
  stats = {
    totalEvents: 0,
    totalTickets: 0,
    availableTickets: 0,
    soldTickets: 0,
    revenue: 0
  };

  constructor(
    private eventService: EventService,
    private ticketService: TicketService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadEvents();
    this.loadRecentTickets();
  }

  loadEvents(): void {
    this.loading.events = true;
    this.eventService.getAllEvents()
      .subscribe({
        next: (events) => {
          this.events = events;
          this.calculateStats();
          this.loading.events = false;
        },
        error: (error) => {
          this.error.events = error.error?.message || 'Une erreur est survenue lors du chargement des événements';
          this.loading.events = false;
        }
      });
  }

  loadRecentTickets(): void {
    this.loading.tickets = true;
    // Normalement, nous devrions avoir un endpoint pour récupérer tous les tickets (admin)
    // Pour l'exemple, nous utiliserons l'endpoint utilisateur
    this.ticketService.getUserTickets()
      .subscribe({
        next: (tickets) => {
          this.recentTickets = tickets.slice(0, 5); // 5 derniers tickets seulement
          this.loading.tickets = false;
        },
        error: (error) => {
          this.error.tickets = error.error?.message || 'Une erreur est survenue lors du chargement des billets';
          this.loading.tickets = false;
        }
      });
  }

  calculateStats(): void {
    this.stats.totalEvents = this.events.length;
    
    let totalTickets = 0;
    let availableTickets = 0;
    let revenue = 0;
    
    this.events.forEach(event => {
      totalTickets += event.totalTickets;
      availableTickets += event.availableTickets;
      revenue += (event.totalTickets - event.availableTickets) * event.price;
    });
    
    this.stats.totalTickets = totalTickets;
    this.stats.availableTickets = availableTickets;
    this.stats.soldTickets = totalTickets - availableTickets;
    this.stats.revenue = revenue;
  }

  deleteEvent(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) {
      this.eventService.deleteEvent(id)
        .subscribe({
          next: () => {
            this.events = this.events.filter(event => event.id !== id);
            this.calculateStats();
          },
          error: (error) => {
            this.error.events = error.error?.message || 'Une erreur est survenue lors de la suppression';
          }
        });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'valid':
        return 'bg-success';
      case 'used':
        return 'bg-secondary';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-light';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'valid':
        return 'Valide';
      case 'used':
        return 'Utilisé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  }
}