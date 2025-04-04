import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket';
import { environment } from '../../environement/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient) { }

  getUserTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/my-tickets`);
  }

  purchaseTicket(eventId: number): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/purchase`, { eventId });
  }

  cancelTicket(ticketId: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/cancel/${ticketId}`, {});
  }

  validateTicket(ticketNumber: string): Observable<{ message: string, ticket: Ticket }> {
    return this.http.put<{ message: string, ticket: Ticket }>(`${this.apiUrl}/validate/${ticketNumber}`, {});
  }
}