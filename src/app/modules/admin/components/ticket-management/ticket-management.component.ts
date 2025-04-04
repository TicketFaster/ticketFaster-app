import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-management',
  templateUrl: './ticket-management.component.html',
  styleUrls: ['./ticket-management.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TicketManagementComponent implements OnInit {
  tickets: any[] = [];
  filteredTickets: any[] = [];
  loading = true;
  filterStatus = 'all';
  searchTerm = '';
  
  // Nombre de billets par statut
  validTicketsCount = 0;
  usedTicketsCount = 0;
  refundedTicketsCount = 0;
  cancelledTicketsCount = 0;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.tickets = this.generateMockTickets(25);
      this.applyFilters();
      this.calculateTicketCounts();
      this.loading = false;
    }, 1200);
  }

  calculateTicketCounts(): void {
    this.validTicketsCount = this.tickets.filter(t => t.status === 'valid').length;
    this.usedTicketsCount = this.tickets.filter(t => t.status === 'used').length;
    this.refundedTicketsCount = this.tickets.filter(t => t.status === 'refunded').length;
    this.cancelledTicketsCount = this.tickets.filter(t => t.status === 'cancelled').length;
  }

  generateMockTickets(count: number): any[] {
    const statuses = ['valid', 'used', 'refunded', 'cancelled'];
    const events = [
      'Concert de Jazz à Paris',
      'Festival Rock en Scène',
      'Match de Football PSG-OM',
      'Théâtre: Le Malade Imaginaire',
      'Salon du Livre 2023'
    ];
    const names = [
      'Sophie Martin',
      'Thomas Dubois',
      'Emma Bernard',
      'Lucas Petit',
      'Léa Durand',
      'Hugo Moreau'
    ];

    return Array.from({ length: count }, (_, i) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const eventId = Math.floor(Math.random() * 5) + 1;
      const userId = Math.floor(Math.random() * 10) + 1;
      const purchaseDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
      const useDate = status === 'used' 
        ? new Date(purchaseDate.getTime() + Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000)
        : null;

      return {
        id: i + 1,
        code: `TIX-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        status,
        price: Math.floor(Math.random() * 100) + 20,
        purchaseDate: purchaseDate.toISOString(),
        useDate: useDate?.toISOString(),
        event: {
          id: eventId,
          name: events[eventId % events.length],
          date: new Date(Date.now() + Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString()
        },
        user: {
          id: userId,
          name: names[userId % names.length],
          email: `user${userId}@example.com`
        }
      };
    });
  }

  applyFilters(): void {
    let filtered = [...this.tickets];

    // Filtrer par statut
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === this.filterStatus);
    }

    // Filtrer par recherche
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.code.toLowerCase().includes(searchLower) ||
        ticket.event.name.toLowerCase().includes(searchLower) ||
        ticket.user.name.toLowerCase().includes(searchLower) ||
        ticket.user.email.toLowerCase().includes(searchLower)
      );
    }

    this.filteredTickets = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'valid': return 'status-valid';
      case 'used': return 'status-used';
      case 'refunded': return 'status-refunded';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch(status) {
      case 'valid': return 'Valide';
      case 'used': return 'Utilisé';
      case 'refunded': return 'Remboursé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  }
} 