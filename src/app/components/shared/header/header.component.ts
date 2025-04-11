import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';
import { EventService } from '../../../services/event.service';
import { User } from '../../../models/user';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  isAdmin: boolean = false;
  searchQuery: string = '';
  
  // Nouvelles propriétés pour les suggestions et le mode sombre
  showSuggestions: boolean = false;
  searchSuggestions: string[] = [];
  isDarkMode: boolean = false;
  
  // Propriété pour gérer l'état du menu mobile
  isMenuCollapsed: boolean = true;
  
  // Pour optimiser les recherches et éviter trop d'appels API
  private searchTerms = new Subject<string>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private eventService: EventService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.role === 'admin';
    });
    
    // S'abonner aux changements de thème
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    
    // Récupérer le terme de recherche des query params
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
      }
    });
    
    // S'abonner aux changements du terme de recherche avec debounce
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(term => {
      if (term && term.length > 1) {
        this.loadSearchSuggestions(term);
      } else {
        this.showSuggestions = false;
        this.searchSuggestions = [];
      }
    });
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    
    const firstName = this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSearchKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.search();
    } else {
      this.searchTerms.next(this.searchQuery);
    }
  }

  search(): void {
    if (this.searchQuery.trim()) {
      this.showSuggestions = false;
      this.router.navigate(['/events'], { queryParams: { search: this.searchQuery.trim() } });
    }
  }
  
  // Méthode pour charger les suggestions depuis le service
  loadSearchSuggestions(term: string): void {
    this.eventService.getSearchSuggestions(term).subscribe({
      next: (suggestions) => {
        this.searchSuggestions = suggestions;
        this.showSuggestions = this.searchSuggestions.length > 0;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des suggestions', error);
        this.searchSuggestions = [];
        this.showSuggestions = false;
      }
    });
  }
  
  selectSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.search();
  }
  
  // Méthode de basculement du mode sombre utilisant le service
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('locale', lang);
  }
}