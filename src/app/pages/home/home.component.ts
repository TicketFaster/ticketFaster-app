import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { EventService } from '../../services/event.service';
import { EventModel } from '../../models/event';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, DatePipe]
})
export class HomeComponent implements OnInit {
  events: EventModel[] = [];
  filteredEvents: EventModel[] = [];
  allEvents: EventModel[] = [];
  loading = false;
  error = '';
  selectedCategory: string | null = null;
  
  // Correspondance entre l'affichage et les valeurs réelles en base de données
  categoryMapping: Record<string, string> = {
    'Concerts': 'concert',
    'Théâtre': 'theatre',
    'Sport': 'sport',
    'Conférences': 'conference',
    'Cinéma': 'cinema',
    'Expositions': 'exposition',
    'Spectacles': 'spectacle',
    'Festivals': 'festival'
  };

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.allEvents = events;
        this.events = events;
        this.filteredEvents = events;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Une erreur est survenue lors du chargement des événements';
        this.loading = false;
      }
    });
  }

  // Filtrer les événements par catégorie
  filterByCategory(displayCategory: string): void {
    this.selectedCategory = displayCategory;
    
    if (displayCategory) {
      const dbCategory = this.categoryMapping[displayCategory];
      this.filteredEvents = this.allEvents.filter(event => 
        event.category.toLowerCase() === dbCategory.toLowerCase()
      );
    } else {
      this.filteredEvents = this.allEvents;
    }
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.selectedCategory = null;
    this.filteredEvents = this.allEvents;
  }
}