import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../models/user';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  sortColumn = 'id';
  sortDirection = 'asc';
  
  selectedUser: User | null = null;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    // Dans un cas réel, utilisez un service UserService pour récupérer les utilisateurs
    // Pour cet exemple, nous allons créer des utilisateurs fictifs
    setTimeout(() => {
      this.users = this.generateMockUsers(50);
      this.applyFilters();
      this.loading = false;
    }, 1000);
  }
  
  generateMockUsers(count: number): User[] {
    const roles = ['user', 'admin'] as const;
    const firstNames = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Thomas', 'Camille', 'Lucas', 'Emma', 'Hugo', 'Léa'];
    const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      email: `user${i + 1}@example.com`,
      role: roles[Math.random() > 0.9 ? 1 : 0],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
    }));
  }
  
  applyFilters(): void {
    // Filtrage par recherche
    let filtered = this.users;
    
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(search) ||
        user.lastName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }
    
    // Tri
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[this.sortColumn as keyof User];
      const bValue = b[this.sortColumn as keyof User];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // Pour les autres types (nombre, date, etc.)
      return this.sortDirection === 'asc' 
        ? ((aValue ?? 0) < (bValue ?? 0) ? -1 : 1) 
        : ((aValue ?? 0) > (bValue ?? 0) ? -1 : 1);
    });
    
    this.filteredUsers = filtered;
  }
  
  changeSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.applyFilters();
  }
  
  onSearch(): void {
    this.applyFilters();
  }
  
  resetSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }
  
  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }
  
  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  // Actions utilisateur
  selectUser(user: User): void {
    this.selectedUser = user;
  }
  
  closeUserModal(): void {
    this.selectedUser = null;
  }
  
  toggleUserRole(user: User): void {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    
    // Dans un cas réel, appel API pour mettre à jour le rôle
    // this.userService.updateUser(user.id, { role: newRole })...
    
    // Mise à jour locale
    const userIndex = this.users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...user, role: newRole };
      this.applyFilters();
    }
  }
  
  deleteUser(userId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      // Dans un cas réel, appel API pour supprimer l'utilisateur
      // this.userService.deleteUser(userId)...
      
      // Mise à jour locale
      this.users = this.users.filter(user => user.id !== userId);
      this.applyFilters();
      
      if (this.selectedUser?.id === userId) {
        this.closeUserModal();
      }
    }
  }
} 