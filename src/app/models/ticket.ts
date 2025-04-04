// src/app/models/ticket.ts
import { EventModel } from './event';

export interface Ticket {
  id: number;
  userId: number;
  eventId: number;
  ticketNumber: string;
  purchaseDate: string;
  status: 'valid' | 'used' | 'cancelled';
  event: EventModel;
  createdAt: string;
  updatedAt: string;
}