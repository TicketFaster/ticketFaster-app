// src/app/pages/user-profile/user-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { User } from '../../models/user';
import { FontAwesomeIconsModule } from '../../shared/font-awesome.module';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeIconsModule]
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  loading = {
    profile: false,
    password: false,
    picture: false
  };
  submitted = {
    profile: false,
    password: false
  };
  success = {
    profile: '',
    password: '',
    picture: ''
  };
  error = {
    profile: '',
    password: '',
    picture: ''
  };
  user: User | null = null;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService
  ) {
    this.profileForm = this.createProfileForm();
    this.passwordForm = this.createPasswordForm();
  }

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    
    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email
      });
    }
  }

  createProfileForm(): FormGroup {
    return this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  createPasswordForm(): FormGroup {
    return this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  // Getters pour un accès facile aux champs du formulaire
  get p() { return this.profileForm.controls; }
  get pw() { return this.passwordForm.controls; }

  /**
   * Obtient l'URL de la photo de profil
   */
  getProfilePictureUrl(): string {
    return this.profileService.getProfilePictureUrl(this.user?.profilePicture);
  }

  /**
   * Gère la sélection de fichier pour la photo de profil
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Vérifier le type du fichier
      if (!this.selectedFile.type.startsWith('image/')) {
        this.error.picture = 'Veuillez sélectionner une image valide.';
        this.selectedFile = null;
        return;
      }
      
      // Vérifier la taille du fichier (max 2MB)
      if (this.selectedFile.size > 2 * 1024 * 1024) {
        this.error.picture = 'L\'image ne doit pas dépasser 2MB.';
        this.selectedFile = null;
        return;
      }
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
      
      // Réinitialiser les messages
      this.error.picture = '';
      this.success.picture = '';
    }
  }

  /**
   * Télécharge la nouvelle photo de profil
   */
  uploadProfilePicture(): void {
    if (!this.selectedFile) {
      return;
    }
    
    this.loading.picture = true;
    this.error.picture = '';
    this.success.picture = '';
    
    this.profileService.uploadProfilePicture(this.selectedFile).subscribe({
      next: (response) => {
        this.success.picture = 'Photo de profil mise à jour avec succès.';
        this.loading.picture = false;
        this.selectedFile = null;
        
        // Mettre à jour l'utilisateur local
        this.authService.getUserProfile().subscribe(user => {
          this.user = user;
        });
      },
      error: (err) => {
        this.error.picture = 'Erreur lors de la mise à jour de la photo de profil.';
        this.loading.picture = false;
        console.error('Erreur d\'upload :', err);
      }
    });
  }

  /**
   * Supprime la photo de profil
   */
  deleteProfilePicture(): void {
    if (!this.user?.profilePicture) {
      return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil ?')) {
      this.loading.picture = true;
      this.error.picture = '';
      this.success.picture = '';
      
      this.profileService.deleteProfilePicture().subscribe({
        next: () => {
          this.success.picture = 'Photo de profil supprimée avec succès.';
          this.loading.picture = false;
          
          // Mettre à jour l'utilisateur local
          this.authService.getUserProfile().subscribe(user => {
            this.user = user;
          });
        },
        error: (err) => {
          this.error.picture = 'Erreur lors de la suppression de la photo de profil.';
          this.loading.picture = false;
          console.error('Erreur de suppression :', err);
        }
      });
    }
  }

  /**
   * Soumet le formulaire de mise à jour du profil
   */
  onSubmitProfile(): void {
    this.submitted.profile = true;
    this.success.profile = '';
    this.error.profile = '';

    if (this.profileForm.invalid) {
      return;
    }

    this.loading.profile = true;
    
    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.success.profile = 'Profil mis à jour avec succès';
        this.loading.profile = false;
      },
      error: (err) => {
        this.error.profile = 'Erreur lors de la mise à jour du profil';
        this.loading.profile = false;
        console.error('Erreur de mise à jour :', err);
      }
    });
  }

  /**
   * Soumet le formulaire de changement de mot de passe
   */
  onSubmitPassword(): void {
    this.submitted.password = true;
    this.success.password = '';
    this.error.password = '';

    if (this.passwordForm.invalid) {
      return;
    }

    this.loading.password = true;
    
    // Dans une application réelle, vous auriez un service pour changer le mot de passe
    // Pour l'exemple, nous simulerons la mise à jour
    setTimeout(() => {
      this.success.password = 'Mot de passe changé avec succès';
      this.loading.password = false;
      this.passwordForm.reset();
      this.submitted.password = false;
    }, 1000);
  }
}