import { Component, OnInit } from '@angular/core';
import { Event } from '../../models/event';
import { EventService } from '../../services/event.service';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {
  wishlistEvents: Event[] = [];
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe(user => {
      this.currentUser = user;
      if (user && user.wishlist) {
        user.wishlist.forEach(eventId => {
          this.eventService.getEventById(eventId).subscribe(event => {
            this.wishlistEvents.push(event);
          });
        });
      }
    });
  }
}
