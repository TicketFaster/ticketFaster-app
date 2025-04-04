// src/app/components/tickets/ticket-detail/ticket-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgClass, DatePipe, CurrencyPipe } from '@angular/common';
import { TicketService } from '../../../services/ticket.service';
import { Ticket } from '../../../models/ticket';
import { EventModel } from '../../../models/event';
@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass, RouterLink, DatePipe, CurrencyPipe]
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService
  ) { }

  ngOnInit(): void {
    this.loadTicket();
  }

  loadTicket(): void {
    this.loading = true;
    // Normalement, nous devrions avoir un endpoint pour récupérer un billet par son ID
    // Comme ce n'est pas explicitement défini dans l'API, nous allons récupérer tous les billets
    // et filtrer celui que nous voulons
    this.ticketService.getUserTickets()
      .subscribe({
        next: (tickets) => {
          const ticketId = Number(this.route.snapshot.paramMap.get('id'));
          this.ticket = tickets.find(t => t.id === ticketId) || null;
          
          if (!this.ticket) {
            this.error = 'Billet non trouvé';
          }
          
          this.loading = false;
        },
        error: (error) => {
          this.error = error.error?.message || 'Une erreur est survenue lors du chargement du billet';
          this.loading = false;
        }
      });
  }

  cancelTicket(): void {
    if (!this.ticket) return;
    
    if (confirm('Êtes-vous sûr de vouloir annuler ce billet?')) {
      this.ticketService.cancelTicket(this.ticket.id)
        .subscribe({
          next: (response) => {
            this.successMessage = response.message;
            // Mettre à jour le statut du billet
            if (this.ticket) {
              this.ticket.status = 'cancelled';
            }
            
            // Rediriger vers la liste des billets après un court délai
            setTimeout(() => {
              this.router.navigate(['/my-tickets']);
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