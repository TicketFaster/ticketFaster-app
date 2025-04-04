import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class EventManagementComponent implements OnInit {
  events: any[] = [];
  loading = true;

  constructor() { }

  ngOnInit(): void {
    // Simuler le chargement des événements
    setTimeout(() => {
      this.events = this.generateMockEvents(15);
      this.loading = false;
    }, 1000);
  }

  generateMockEvents(count: number): any[] {
    const categories = ['Concert', 'Festival', 'Théâtre', 'Sport', 'Conférence'];
    const locations = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Toulouse'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      title: `Événement ${i + 1}`,
      description: `Description de l'événement ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      date: new Date(Date.now() + Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
      price: Math.floor(Math.random() * 100) + 10,
      capacity: Math.floor(Math.random() * 500) + 50,
      ticketsSold: Math.floor(Math.random() * 300),
      createdAt: new Date().toISOString()
    }));
  }
} 