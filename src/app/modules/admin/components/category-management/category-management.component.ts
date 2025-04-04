import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/category';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  error = '';
  
  // État d'édition
  selectedCategory: Category | null = null;
  editMode = false;
  categoryForm: FormGroup;
  
  // Palette de couleurs prédéfinies
  colorPalette = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
    '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
    '#ff5722', '#795548', '#9e9e9e', '#607d8b'
  ];
  
  // Liste d'icônes disponibles
  iconOptions = [
    { value: 'music_note', label: 'Musique' },
    { value: 'theater_comedy', label: 'Théâtre' },
    { value: 'sports_soccer', label: 'Sport' },
    { value: 'festival', label: 'Festival' },
    { value: 'event_note', label: 'Conférence' },
    { value: 'local_movies', label: 'Cinéma' },
    { value: 'local_dining', label: 'Gastronomie' },
    { value: 'school', label: 'Éducation' },
    { value: 'museum', label: 'Exposition' },
    { value: 'nightlife', label: 'Soirée' }
  ];

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) { 
    this.categoryForm = this.createCategoryForm();
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des catégories.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  createCategoryForm(category?: Category): FormGroup {
    return this.fb.group({
      name: [category?.name || '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: [category?.description || ''],
      color: [category?.color || this.colorPalette[0]],
      icon: [category?.icon || this.iconOptions[0].value],
      active: [category?.active !== undefined ? category.active : true],
    });
  }

  openCreateForm(): void {
    this.editMode = false;
    this.selectedCategory = null;
    this.categoryForm = this.createCategoryForm();
  }

  openEditForm(category: Category): void {
    this.editMode = true;
    this.selectedCategory = category;
    this.categoryForm = this.createCategoryForm(category);
  }

  closeForm(): void {
    this.editMode = false;
    this.selectedCategory = null;
  }

  selectColor(color: string): void {
    this.categoryForm.patchValue({ color });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const categoryData = this.categoryForm.value;

    if (this.editMode && this.selectedCategory) {
      // Mise à jour d'une catégorie existante
      this.categoryService.updateCategory(this.selectedCategory.id, categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.closeForm();
        },
        error: (err) => {
          this.error = 'Erreur lors de la mise à jour de la catégorie.';
          console.error(err);
        }
      });
    } else {
      // Création d'une nouvelle catégorie
      this.categoryService.createCategory(categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.closeForm();
        },
        error: (err) => {
          this.error = 'Erreur lors de la création de la catégorie.';
          console.error(err);
        }
      });
    }
  }

  deleteCategory(category: Category): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.loadCategories();
          if (this.selectedCategory?.id === category.id) {
            this.closeForm();
          }
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression de la catégorie.';
          console.error(err);
        }
      });
    }
  }
} 