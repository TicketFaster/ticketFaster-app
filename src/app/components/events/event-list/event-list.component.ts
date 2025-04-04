// src/app/components/events/event-list/event-list.component.ts
import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { EventModel } from '../../../models/event';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, RouterLink, DatePipe, CurrencyPipe]
})
export class EventListComponent implements OnInit {
  events: EventModel[] = [];
  loading = false;
  error = '';
  searchTerm = '';

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Écouter les changements de query params pour la recherche
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
        this.searchEvents(this.searchTerm);
      } else {
        this.searchTerm = '';
        this.loadEvents();
      }
    });
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getAllEvents()
      .subscribe({
        next: (events) => {
          this.events = events;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.error?.message || 'Une erreur est survenue lors du chargement des événements';
          this.loading = false;
        }
      });
  }
  
  searchEvents(term: string): void {
    this.loading = true;
    this.eventService.searchEvents(term)
      .subscribe({
        next: (events) => {
          this.events = events;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.error?.message || 'Une erreur est survenue lors de la recherche';
          this.loading = false;
        }
      });
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  deleteEvent(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) {
      this.eventService.deleteEvent(id)
        .subscribe({
          next: () => {
            this.events = this.events.filter(event => event.id !== id);
          },
          error: (error) => {
            this.error = error.error?.message || 'Une erreur est survenue lors de la suppression';
          }
        });
    }
  }
}