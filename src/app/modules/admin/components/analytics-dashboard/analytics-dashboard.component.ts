import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

// Interface pour les données de ventes
interface SalesData {
  period: string;
  amount: number;
  tickets: number;
}

// Interface pour les données de catégories
interface CategoryData {
  name: string;
  value: number;
  color: string;
}

// Interface pour les données d'utilisateurs
interface UserData {
  month: string;
  newUsers: number;
  activeUsers: number;
}

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class AnalyticsDashboardComponent implements OnInit {
  // Filtres de période
  filterForm = new FormGroup({
    startDate: new FormControl<Date | null>(new Date(new Date().setMonth(new Date().getMonth() - 6))),
    endDate: new FormControl<Date | null>(new Date()),
    granularity: new FormControl<'day' | 'week' | 'month'>('month')
  });

  // Indicateurs clés de performance
  kpis = {
    totalRevenue: 0,
    ticketsSold: 0,
    averagePrice: 0,
    conversionRate: 0,
    userGrowth: 0,
    popularCategory: ''
  };

  // Données pour les graphiques
  salesData: SalesData[] = [];
  categorySalesData: CategoryData[] = [];
  userGrowthData: UserData[] = [];

  // États de chargement
  loading = {
    kpis: true,
    salesChart: true,
    categoryChart: true,
    userChart: true
  };

  // Couleurs pour les graphiques
  colors = [
    '#4285F4', '#EA4335', '#FBBC05', '#34A853',
    '#FF6D00', '#2979FF', '#00BFA5', '#D500F9'
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadAnalyticsData();
  }

  // Charge toutes les données analytiques
  loadAnalyticsData(): void {
    this.loadKPIs();
    this.loadSalesData();
    this.loadCategoryData();
    this.loadUserGrowthData();
  }

  // Applique les filtres lors du changement de période
  applyFilters(): void {
    this.loadAnalyticsData();
  }

  // Charge les indicateurs clés de performance
  private loadKPIs(): void {
    this.loading.kpis = true;
    // Simule un appel API
    setTimeout(() => {
      this.kpis = {
        totalRevenue: 85420,
        ticketsSold: 3247,
        averagePrice: 26.3,
        conversionRate: 3.8,
        userGrowth: 12.5,
        popularCategory: 'Concerts'
      };
      this.loading.kpis = false;
    }, 800);
  }

  // Charge les données de ventes pour le graphique
  private loadSalesData(): void {
    this.loading.salesChart = true;
    // Simule un appel API
    setTimeout(() => {
      this.salesData = [
        { period: 'Jan', amount: 4200, tickets: 210 },
        { period: 'Fév', amount: 5800, tickets: 245 },
        { period: 'Mar', amount: 12400, tickets: 470 },
        { period: 'Avr', amount: 15200, tickets: 580 },
        { period: 'Mai', amount: 9600, tickets: 412 },
        { period: 'Juin', amount: 18500, tickets: 687 },
        { period: 'Juil', amount: 19720, tickets: 643 }
      ];
      this.loading.salesChart = false;
    }, 1200);
  }

  // Charge les données de catégories pour le graphique
  private loadCategoryData(): void {
    this.loading.categoryChart = true;
    // Simule un appel API
    setTimeout(() => {
      this.categorySalesData = [
        { name: 'Concerts', value: 42, color: this.colors[0] },
        { name: 'Théâtre', value: 18, color: this.colors[1] },
        { name: 'Sport', value: 15, color: this.colors[2] },
        { name: 'Festival', value: 12, color: this.colors[3] },
        { name: 'Cinéma', value: 8, color: this.colors[4] },
        { name: 'Autres', value: 5, color: this.colors[5] }
      ];
      this.loading.categoryChart = false;
    }, 1000);
  }

  // Charge les données de croissance d'utilisateurs
  private loadUserGrowthData(): void {
    this.loading.userChart = true;
    // Simule un appel API
    setTimeout(() => {
      this.userGrowthData = [
        { month: 'Jan', newUsers: 58, activeUsers: 125 },
        { month: 'Fév', newUsers: 65, activeUsers: 156 },
        { month: 'Mar', newUsers: 88, activeUsers: 210 },
        { month: 'Avr', newUsers: 72, activeUsers: 250 },
        { month: 'Mai', newUsers: 95, activeUsers: 312 },
        { month: 'Juin', newUsers: 130, activeUsers: 402 },
        { month: 'Juil', newUsers: 148, activeUsers: 487 }
      ];
      this.loading.userChart = false;
    }, 1500);
  }

  // Formate les nombres pour l'affichage
  formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(value);
  }

  // Calcule la variation en pourcentage
  calculateChange(current: number, previous: number): number {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  }
} 