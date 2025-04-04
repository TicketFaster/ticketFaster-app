import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkMode.asObservable();
  
  private readonly STORAGE_KEY = 'darkMode';

  constructor() {
    // Récupérer la préférence de l'utilisateur du localStorage au démarrage
    this.initTheme();
  }

  private initTheme(): void {
    // Vérifier d'abord les préférences système
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Ensuite vérifier si l'utilisateur a déjà choisi un thème
    const storedPreference = localStorage.getItem(this.STORAGE_KEY);
    
    // Définir le mode initial
    const initialDarkMode = storedPreference !== null 
      ? storedPreference === 'true' 
      : prefersDark;
    
    // Appliquer le thème
    this.setDarkMode(initialDarkMode);
  }
  
  public toggleDarkMode(): void {
    this.setDarkMode(!this.darkMode.value);
  }
  
  public setDarkMode(isDark: boolean): void {
    // Stocker la préférence de l'utilisateur
    localStorage.setItem(this.STORAGE_KEY, String(isDark));
    
    // Mettre à jour le BehaviorSubject
    this.darkMode.next(isDark);
    
    // Appliquer la classe au body
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
  
  public isDarkMode(): boolean {
    return this.darkMode.value;
  }
} 