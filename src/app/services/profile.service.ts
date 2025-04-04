import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from '../../environement/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/users/profile`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Met à jour les informations de profil de l'utilisateur
   */
  updateProfile(profileData: Partial<User>): Observable<User> {
    return this.http.put<User>(this.apiUrl, profileData).pipe(
      tap(user => {
        // Mettre à jour l'utilisateur dans le service d'authentification
        // On utilise getUserProfile() de AuthService pour mettre à jour correctement les données
        this.authService.getUserProfile().subscribe();
      })
    );
  }

  /**
   * Upload une nouvelle photo de profil
   */
  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    return this.http.post<any>(`${this.apiUrl}/picture`, formData).pipe(
      tap(_ => {
        // Rafraîchir les informations de l'utilisateur
        this.authService.getUserProfile().subscribe();
      })
    );
  }

  /**
   * Supprime la photo de profil
   */
  deleteProfilePicture(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/picture`).pipe(
      tap(_ => {
        // Rafraîchir les informations de l'utilisateur
        this.authService.getUserProfile().subscribe();
      })
    );
  }

  /**
   * Construit l'URL complète pour l'image de profil
   */
  getProfilePictureUrl(profilePicture: string | undefined): string {
    if (!profilePicture) {
      return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
    }
    return `${environment.apiUrl}/${profilePicture}`;
  }
} 