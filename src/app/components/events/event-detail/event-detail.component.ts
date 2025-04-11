// src/app/components/events/event-detail/event-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgClass, DatePipe, CurrencyPipe } from '@angular/common';
import { EventService } from '../../../services/event.service';
import { TicketService } from '../../../services/ticket.service';
import { AuthService } from '../../../services/auth.service';
import { EventModel } from '../../../models/event';
import { ProfileService } from '../../../services/profile.service';
import * as L from 'leaflet';
import { ReviewService } from '../../../services/review.service';
import { Review } from '../../../models/review';

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
  isInWishlist: boolean = false;
  currentUser: any;
  reviews: Review[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private ticketService: TicketService,
    private authService: AuthService
    private profileService: ProfileService,    
    private reviewService: ReviewService
  ) {  }

  ngOnInit(): void {
    this.loadEvent();
  }

  loadEvent(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        this.loading = false;
        if (this.event && this.event.location) {
          const map = L.map('map').setView(
            [this.event.location.latitude, this.event.location.longitude],
            13
          );
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);

          L.marker([this.event.location.latitude, this.event.location.longitude])
            .addTo(map)
            .bindPopup(this.event.title)
            .openPopup();
      },
      error: (error) => {
        this.error = error.error.message || 'Une erreur est survenue lors du chargement de l\'événement';
        this.loading = false;
      },
      }
    });

    // Récupérer l'utilisateur actuel et vérifier si l'événement est dans sa wishlist
    this.profileService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        if (this.event) {
          this.isInWishlist = user.wishlist ? user.wishlist.includes(this.event.id) : false;
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du profil utilisateur', error);
        // Gérer l'erreur si nécessaire, par exemple, afficher un message à l'utilisateur
      }
    });

    this.loadReviews();
  }

  loadReviews(): void {
    if (this.event && this.event.id) {
      this.reviewService.getReviewsByEventId(this.event.id).subscribe({
        next: (reviews) => {
          this.reviews = reviews;
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des commentaires', error);
          // Gérer l'erreur si nécessaire
        }
      });
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

  addToWishlist(): void {
    if (!this.isLoggedIn || !this.event) {
      // Gérer le cas où l'utilisateur n'est pas connecté ou l'événement n'est pas chargé
      return;
    }
  
    this.profileService.addToWishlist(this.event.id).subscribe({
      next: (user) => {
        this.isInWishlist = true;
        this.currentUser = user;
        this.successMessage = 'Événement ajouté à votre wishlist';
      },
      error: (error) => {
        this.error = error.error.message || 'Erreur lors de l\'ajout à la wishlist';
      }
    });
  }
  
  removeFromWishlist(): void {
    if (!this.isLoggedIn || !this.event) {
      return;
    }
  
    this.profileService.removeFromWishlist(this.event.id).subscribe({
      next: (user) => {
        this.isInWishlist = false;
        this.currentUser = user;
        this.successMessage = 'Événement retiré de votre wishlist';
      },
      error: (error) => {
        this.error = error.error.message || 'Erreur lors du retrait de la wishlist';
      }
    });
  }

  // Déterminer le texte du bouton en fonction de l'état de la wishlist
  get wishlistButtonText(): string {
    return this.isInWishlist ? 'Retirer de la wishlist' : 'Ajouter à la wishlist';
  }

  // Déterminer quelle action appeler en fonction de l'état de la wishlist
  toggleWishlist(): void {
    if (this.isInWishlist) {
      this.removeFromWishlist();
    } else {
      this.addToWishlist();
    }
  }

  submitReview(rating: number, comment: string): void {
    if (!this.isLoggedIn || !this.event || !this.currentUser) {
      // Gérer le cas où l'utilisateur n'est pas connecté ou l'événement n'est pas chargé
      return;
    }
  
    // Créer un nouvel objet Review avec les données du formulaire
    const newReview: Review = {
      id: 0, // L'ID sera généré par le backend
      eventId: this.event.id,
      userId: this.currentUser.id,
      rating: rating,
      comment: comment
    };
  
    // Appeler le ReviewService pour ajouter le commentaire
    this.reviewService.addReview(newReview).subscribe({
      next: (review) => {
        // Ajouter le nouveau commentaire à la liste des commentaires
        this.reviews.push(review);
        // Réinitialiser le formulaire
        //this.newReview = { rating: 0, comment: '' };
        // Afficher un message de succès
        this.successMessage = 'Votre commentaire a été ajouté avec succès.';
      },
      error: (error) => {
        this.error = error.error.message || 'Erreur lors de l\'ajout du commentaire.';
      }
    });
  }

}