// src/app/components/events/event-detail/event-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgClass, DatePipe, CurrencyPipe } from '@angular/common';
import { EventService } from '../../../services/event.service';
import { TicketService } from '../../../services/ticket.service';
import { AuthService } from '../../../services/auth.service';
import { EventModel } from '../../../models/event';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass, RouterLink, DatePipe, CurrencyPipe]
})
export class EventDetailComponent implements OnInit {
  event: EventModel | null = null;
  loading = true;
  error = '';
  successMessage = '';
  purchaseLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private ticketService: TicketService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadEvent();
  }

  loadEvent(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error.message || 'Une erreur est survenue lors du chargement de l\'événement';
        this.loading = false;
      }
    });
  }

  purchaseTicket(): void {
    if (!this.isLoggedIn) {
      // Rediriger vers la page de connexion
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: `/events/${this.event!.id}` } 
      });
      return;
    }

    if (!this.event) return;

    this.purchaseLoading = true;
    
    this.ticketService.purchaseTicket(this.event.id).subscribe({
      next: () => {
        this.successMessage = 'Votre billet a été acheté avec succès';
        this.purchaseLoading = false;
        
        // Mettre à jour le nombre de billets disponibles
        this.event!.availableTickets--;
        
        // Rediriger vers la page des billets après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/my-tickets']);
        }, 2000);
      },
      error: (error) => {
        this.error = error.error.message || 'Une erreur est survenue lors de l\'achat du billet';
        this.purchaseLoading = false;
      }
    });
  }
  
  deleteEvent(): void {
    if (!this.event) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      this.loading = true;
      
      this.eventService.deleteEvent(this.event.id).subscribe({
        next: () => {
          this.router.navigate(['/events'], { 
            queryParams: { deleted: 'success' } 
          });
        },
        error: (error) => {
          this.error = error.error.message || 'Une erreur est survenue lors de la suppression de l\'événement';
          this.loading = false;
        }
      });
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }
}