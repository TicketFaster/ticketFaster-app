export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  eventCount?: number; // Nombre d'événements dans cette catégorie (optionnel)
} 