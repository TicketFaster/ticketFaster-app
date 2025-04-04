// src/app/components/tickets/ticket-list/ticket-list.component.ts
import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../../services/ticket.service';
import { Ticket } from '../../../models/ticket';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, RouterLink, DatePipe, CurrencyPipe]
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  loading = false;
  error = '';
  successMessage = '';

  constructor(private ticketService: TicketService) { }

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.ticketService.getUserTickets()
      .subscribe({
        next: (tickets) => {
          this.tickets = tickets;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.error?.message || 'Une erreur est survenue lors du chargement des billets';
          this.loading = false;
        }
      });
  }

  cancelTicket(ticketId: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ce billet?')) {
      this.ticketService.cancelTicket(ticketId)
        .subscribe({
          next: (response) => {
            this.successMessage = response.message;
            // Mettre à jour le statut du billet dans la liste locale
            const ticket = this.tickets.find(t => t.id === ticketId);
            if (ticket) {
              ticket.status = 'cancelled';
            }
            // Recharger les billets après un court délai
            setTimeout(() => {
              this.loadTickets();
              this.successMessage = '';
            }, 3000);
          },
          error: (error) => {
            this.error = error.error?.message || 'Une erreur est survenue lors de l\'annulation';
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