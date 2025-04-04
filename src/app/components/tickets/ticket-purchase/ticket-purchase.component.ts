// src/app/components/tickets/ticket-purchase/ticket-purchase.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { TicketService } from '../../../services/ticket.service';
import { AuthService } from '../../../services/auth.service';
import { EventModel } from '../../../models/event';

@Component({
  selector: 'app-ticket-purchase',
  templateUrl: './ticket-purchase.component.html',
  styleUrls: ['./ticket-purchase.component.scss'],
  standalone: true,
  imports: [NgIf]
})
export class TicketPurchaseComponent implements OnInit {
  @Input() event!: EventModel;
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private router: Router,
    private ticketService: TicketService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (!this.event) {
      console.error('L\'événement est requis pour ce composant');
    }
  }

  purchaseTicket(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.loading = true;
    this.ticketService.purchaseTicket(this.event.id)
      .subscribe({
        next: (ticket) => {
          this.successMessage = 'Billet acheté avec succès! Numéro de billet: ' + ticket.ticketNumber;
          this.loading = false;
          
          // Mettre à jour le nombre de billets disponibles
          this.event.availableTickets -= 1;
          
          // Rediriger vers la page des billets après un court délai
          setTimeout(() => {
            this.router.navigate(['/my-tickets']);
          }, 3000);
        },
        error: (error) => {
          this.error = error.error?.message || 'Une erreur est survenue lors de l\'achat du billet';
          this.loading = false;
        }
      });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
}