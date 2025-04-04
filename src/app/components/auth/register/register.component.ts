// src/app/components/auth/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  
  // Variables pour gérer l'affichage du mot de passe
  hidePassword = true;
  hideConfirmPassword = true;
  
  // Variables pour le niveau de force du mot de passe
  passwordStrength = 0;
  passwordFeedback = '';
  
  // Étapes d'inscription
  currentStep = 1;
  totalSteps = 3;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Rediriger vers la page d'accueil si déjà connecté
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }

    this.registerForm = this.createForm();
  }

  ngOnInit(): void {
    // Observer les changements sur le champ de mot de passe pour calculer sa force
    this.registerForm.get('password')?.valueChanges.subscribe(value => {
      this.checkPasswordStrength(value);
    });
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      // Étape 1 : Informations personnelles
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      
      // Étape 2 : Sécurité
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        this.passwordValidator()
      ]],
      confirmPassword: ['', Validators.required],
      
      // Étape 3 : Préférences
      receiveNewsletter: [true],
      termsAccepted: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordsMatchValidator
    });
  }

  // Validateur personnalisé pour la complexité du mot de passe
  passwordValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      
      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
      
      // Vérifier si le mot de passe répond à au moins 3 des 4 critères
      const passwordValid = (hasUpperCase ? 1 : 0) + 
                           (hasLowerCase ? 1 : 0) + 
                           (hasNumeric ? 1 : 0) + 
                           (hasSpecialChar ? 1 : 0);
      
      return passwordValid >= 3 ? null : { complexity: true };
    };
  }

  // Validateur pour vérifier que les mots de passe correspondent
  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // Calcul de la force du mot de passe
  checkPasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = 0;
      this.passwordFeedback = '';
      return;
    }
    
    let strength = 0;
    
    // Longueur
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Complexité
    if (/[A-Z]+/.test(password)) strength += 1;
    if (/[a-z]+/.test(password)) strength += 1;
    if (/[0-9]+/.test(password)) strength += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) strength += 1;
    
    // Convertir la force en pourcentage (0-5 -> 0-100%)
    this.passwordStrength = Math.min(100, (strength / 6) * 100);
    
    // Feedback textuel
    if (this.passwordStrength < 30) {
      this.passwordFeedback = 'Très faible';
    } else if (this.passwordStrength < 50) {
      this.passwordFeedback = 'Faible';
    } else if (this.passwordStrength < 70) {
      this.passwordFeedback = 'Moyen';
    } else if (this.passwordStrength < 90) {
      this.passwordFeedback = 'Fort';
    } else {
      this.passwordFeedback = 'Très fort';
    }
  }

  // Getter pour un accès facile aux champs du formulaire
  get f() { return this.registerForm.controls; }
  
  // Navigation entre les étapes
  nextStep(): void {
    // Vérifier si l'étape actuelle est valide
    if (this.validateCurrentStep()) {
      this.currentStep++;
    } else {
      this.markCurrentStepAsTouched();
    }
  }
  
  previousStep(): void {
    this.currentStep--;
  }
  
  // Valider l'étape actuelle
  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.f['firstName'].valid && this.f['lastName'].valid && this.f['email'].valid;
      case 2:
        return this.f['password'].valid && 
               this.f['confirmPassword'].valid && 
               this.f['password'].value === this.f['confirmPassword'].value;
      case 3:
        return this.f['termsAccepted'].valid;
      default:
        return true;
    }
  }
  
  // Marquer les champs de l'étape actuelle comme touchés
  markCurrentStepAsTouched(): void {
    switch (this.currentStep) {
      case 1:
        this.f['firstName'].markAsTouched();
        this.f['lastName'].markAsTouched();
        this.f['email'].markAsTouched();
        break;
      case 2:
        this.f['password'].markAsTouched();
        this.f['confirmPassword'].markAsTouched();
        break;
      case 3:
        this.f['termsAccepted'].markAsTouched();
        break;
    }
  }

  // Soumission du formulaire
  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    // Vérifier la validité du formulaire
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Extraire les données pertinentes pour l'API
    const userData = {
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      preferences: {
        newsletter: this.f['receiveNewsletter'].value
      }
    };
    
    this.authService.register(userData)
      .subscribe({
        next: () => {
          this.success = 'Inscription réussie ! Redirection vers la page de connexion...';
          // Rediriger vers la page de connexion après un court délai
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: error => {
          if (error.status === 409) {
            this.error = 'Cette adresse email est déjà utilisée.';
          } else {
            this.error = error.error?.message || 'Une erreur est survenue lors de l\'inscription';
          }
          this.loading = false;
        }
      });
  }
  
  // Basculer l'affichage du mot de passe
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  
  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
  
  // Obtenir la couleur pour l'indicateur de force du mot de passe
  getPasswordStrengthColor(): string {
    if (this.passwordStrength < 30) return '#dc3545'; // danger
    if (this.passwordStrength < 50) return '#ffc107'; // warning
    if (this.passwordStrength < 70) return '#fd7e14'; // orange
    if (this.passwordStrength < 90) return '#28a745'; // success
    return '#198754'; // success dark
  }

  // Méthodes pour vérifier les critères de mot de passe
  hasUpperCase(value: string): boolean {
    return /[A-Z]+/.test(value);
  }
  
  hasLowerCase(value: string): boolean {
    return /[a-z]+/.test(value);
  }
  
  hasNumeric(value: string): boolean {
    return /[0-9]+/.test(value);
  }
  
  hasSpecialChar(value: string): boolean {
    return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(value);
  }
}