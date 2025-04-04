import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventModel } from '../models/event';
import { environment } from '../../environement/environment';


@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(this.apiUrl);
  }

  getEventById(id: number): Observable<EventModel> {
    return this.http.get<EventModel>(`${this.apiUrl}/${id}`);
  }

  createEvent(event: Partial<EventModel>): Observable<EventModel> {
    return this.http.post<EventModel>(this.apiUrl, event);
  }

  updateEvent(id: number, event: Partial<EventModel>): Observable<EventModel> {
    return this.http.put<EventModel>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
  
  searchEvents(searchTerm: string): Observable<EventModel[]> {
    // Avec une API réelle, on passerait le terme de recherche en paramètre d'URL
    // const params = new HttpParams().set('q', searchTerm);
    // return this.http.get<EventModel[]>(`${this.apiUrl}/search`, { params });
    
    // Pour le moment, on va simuler la recherche côté client
    return new Observable<EventModel[]>(observer => {
      this.getAllEvents().subscribe({
        next: (events) => {
          const filteredEvents = events.filter(event => 
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase())
          );
          observer.next(filteredEvents);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
  
  getSearchSuggestions(searchTerm: string): Observable<string[]> {
    // Dans un environnement réel, nous appellerions une API pour obtenir des suggestions
    // Pour l'instant, simulons cela avec une recherche côté client
    return new Observable<string[]>(observer => {
      if (!searchTerm.trim()) {
        observer.next([]);
        observer.complete();
        return;
      }
      
      this.getAllEvents().subscribe({
        next: (events) => {
          const suggestions = events
            .filter(event => 
              event.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(event => event.title)
            .slice(0, 5);
          observer.next(suggestions);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
}