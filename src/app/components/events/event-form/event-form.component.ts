// src/app/components/events/event-form/event-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { EventService } from '../../../services/event.service';
import { EventModel } from '../../../models/event';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink]
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  event: EventModel | null = null;
  isEditMode = false;
  eventId?: number;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {
    this.eventForm = this.createForm();
  }

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !isNaN(this.eventId);

    if (this.isEditMode && this.eventId) {
      this.loadEvent(this.eventId);
    }
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', Validators.required],
      location: ['', Validators.required],
      totalTickets: [100, [Validators.required, Validators.min(1)]],
      price: [10, [Validators.required, Validators.min(0)]],
      imageUrl: ['']
    });
  }

  loadEvent(id: number): void {
    this.loading = true;
    this.eventService.getEventById(id)
      .subscribe({
        next: (event) => {
          this.event = event;
          // Formater la date pour le champ datetime-local
          const eventDate = new Date(event.date);
          const formattedDate = eventDate.toISOString().slice(0, 16);
          
          this.eventForm.patchValue({
            title: event.title,
            description: event.description,
            date: formattedDate,
            location: event.location,
            totalTickets: event.totalTickets,
            price: event.price,
            imageUrl: event.imageUrl || ''
          });
          
          this.loading = false;
        },
        error: (error) => {
          this.error = error.error?.message || 'Une erreur est survenue lors du chargement de l\'événement';
          this.loading = false;
        }
      });
  }

  // Getter pour un accès facile aux champs du formulaire
  get f() { return this.eventForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Arrêter ici si le formulaire est invalide
    if (this.eventForm.invalid) {
      return;
    }

    this.loading = true;
    
    if (this.isEditMode && this.eventId) {
      this.updateEvent(this.eventId);
    } else {
      this.createEvent();
    }
  }

  createEvent(): void {
    this.eventService.createEvent(this.eventForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['/events']);
        },
        error: (error) => {
          this.error = error.error?.message || 'Une erreur est survenue lors de la création de l\'événement';
          this.loading = false;
        }
      });
  }

  updateEvent(id: number): void {
    this.eventService.updateEvent(id, this.eventForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['/events', id]);
        },
        error: (error) => {
          this.error = error.error?.message || 'Une erreur est survenue lors de la mise à jour de l\'événement';
          this.loading = false;
        }
      });
  }
}