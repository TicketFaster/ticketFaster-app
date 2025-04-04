// src/app/components/shared/footer/footer.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule]
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  email: string = '';
  isSubscribing: boolean = false;
  subscriptionStatus: 'idle' | 'success' | 'error' = 'idle';
  isDarkMode: boolean = false;
  
  constructor(private themeService: ThemeService) {}
  
  ngOnInit(): void {
    // Animation de la vague
    this.initWaveAnimation();
    
    // S'abonner aux changements de thème
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }
  
  subscribe(): void {
    if (!this.email || !this.validateEmail(this.email)) {
      this.subscriptionStatus = 'error';
      setTimeout(() => {
        this.subscriptionStatus = 'idle';
      }, 3000);
      return;
    }
    
    this.isSubscribing = true;
    
    // Simuler un appel API
    setTimeout(() => {
      this.isSubscribing = false;
      this.subscriptionStatus = 'success';
      this.email = '';
      
      setTimeout(() => {
        this.subscriptionStatus = 'idle';
      }, 3000);
    }, 1500);
  }
  
  validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }
  
  toggleLanguage(): void {
    // Cette fonction simule un changement de langue
    console.log('Language toggle clicked');
  }
  
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
  
  private initWaveAnimation(): void {
    // Si nous voulions animer la vague avec JavaScript, nous pourrions le faire ici
  }
}