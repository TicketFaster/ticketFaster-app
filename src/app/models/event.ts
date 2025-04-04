// src/app/models/event.ts
export interface EventModel {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  totalTickets: number;
  availableTickets: number;
  price: number;
  imageUrl?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}