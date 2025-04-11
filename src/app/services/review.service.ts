import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review';
import { environment } from 'src/environement/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = environment.apiUrl + '/reviews';

  constructor(private http: HttpClient) { }

  getReviewsByEventId(eventId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/event/${eventId}`);
  }

  addReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }
}