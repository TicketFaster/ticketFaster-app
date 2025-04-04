import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Category } from '../models/category';
import { environment } from '../../environement/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;
  
  // Données de test pour la démo
  private mockCategories: Category[] = [
    {
      id: 1,
      name: 'Concert',
      description: 'Événements musicaux et performances live',
      color: '#3f51b5',
      icon: 'music_note',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eventCount: 14
    },
    {
      id: 2,
      name: 'Théâtre',
      description: 'Pièces de théâtre et performances artistiques',
      color: '#e91e63',
      icon: 'theater_comedy',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eventCount: 8
    },
    {
      id: 3,
      name: 'Sport',
      description: 'Événements sportifs et compétitions',
      color: '#4caf50',
      icon: 'sports_soccer',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eventCount: 12
    },
    {
      id: 4,
      name: 'Festival',
      description: 'Festivals de musique et autres célébrations',
      color: '#ff9800',
      icon: 'festival',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eventCount: 5
    },
    {
      id: 5,
      name: 'Conférence',
      description: 'Conférences, séminaires et ateliers',
      color: '#607d8b',
      icon: 'event_note',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eventCount: 7
    }
  ];

  constructor(private http: HttpClient) { }

  /**
   * Récupère toutes les catégories
   */
  getCategories(): Observable<Category[]> {
    // Pour la démo, nous utilisons des données mockées
    // En production, décommentez la ligne suivante:
    // return this.http.get<Category[]>(this.apiUrl)
    return of(this.mockCategories).pipe(
      tap(_ => console.log('Catégories récupérées')),
      catchError(this.handleError<Category[]>('getCategories', []))
    );
  }

  /**
   * Récupère une catégorie par son ID
   */
  getCategory(id: number): Observable<Category> {
    // Pour la démo, nous utilisons des données mockées
    // En production, décommentez la ligne suivante:
    // return this.http.get<Category>(`${this.apiUrl}/${id}`)
    return of(this.mockCategories.find(category => category.id === id)!).pipe(
      tap(_ => console.log(`Catégorie récupérée id=${id}`)),
      catchError(this.handleError<Category>('getCategory'))
    );
  }

  /**
   * Crée une nouvelle catégorie
   */
  createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Observable<Category> {
    // Pour la démo, nous utilisons des données mockées
    // En production, décommentez la ligne suivante:
    // return this.http.post<Category>(this.apiUrl, category)
    
    const newCategory: Category = {
      ...category,
      id: this.getNextId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eventCount: 0
    };
    
    this.mockCategories.push(newCategory);
    
    return of(newCategory).pipe(
      tap((cat: Category) => console.log(`Catégorie créée id=${cat.id}`)),
      catchError(this.handleError<Category>('createCategory'))
    );
  }

  /**
   * Met à jour une catégorie existante
   */
  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    // Pour la démo, nous utilisons des données mockées
    // En production, décommentez la ligne suivante:
    // return this.http.put<Category>(`${this.apiUrl}/${id}`, category)
    
    const index = this.mockCategories.findIndex(cat => cat.id === id);
    
    if (index !== -1) {
      this.mockCategories[index] = {
        ...this.mockCategories[index],
        ...category,
        updatedAt: new Date().toISOString()
      };
      
      return of(this.mockCategories[index]).pipe(
        tap(_ => console.log(`Catégorie mise à jour id=${id}`)),
        catchError(this.handleError<Category>('updateCategory'))
      );
    }
    
    return this.handleError<Category>('updateCategory')('Catégorie non trouvée');
  }

  /**
   * Supprime une catégorie
   */
  deleteCategory(id: number): Observable<void> {
    // Pour la démo, nous utilisons des données mockées
    // En production, décommentez la ligne suivante:
    // return this.http.delete<void>(`${this.apiUrl}/${id}`)
    
    const index = this.mockCategories.findIndex(cat => cat.id === id);
    
    if (index !== -1) {
      this.mockCategories.splice(index, 1);
      
      return of(void 0).pipe(
        tap(_ => console.log(`Catégorie supprimée id=${id}`)),
        catchError(this.handleError<void>('deleteCategory'))
      );
    }
    
    return this.handleError<void>('deleteCategory')('Catégorie non trouvée');
  }

  /**
   * Récupère le prochain ID disponible pour les données mockées
   */
  private getNextId(): number {
    return Math.max(...this.mockCategories.map(cat => cat.id)) + 1;
  }

  /**
   * Gestion d'erreur pour les appels HTTP
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} a échoué:`, error);
      
      // Renvoie un résultat vide pour continuer l'exécution
      return of(result as T);
    };
  }
} 