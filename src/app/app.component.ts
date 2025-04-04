// src/app/app.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'billetterie-frontend';
  showBackToTop = false;
  
  ngOnInit() {
    // Vérifier la position du scroll au chargement
    this.checkScroll();
  }
  
  // Détecter le scroll de la page
  @HostListener('window:scroll', [])
  checkScroll() {
    this.showBackToTop = window.scrollY > 300;
  }
  
  // Remonter en haut de la page
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}