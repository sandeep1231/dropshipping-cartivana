import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../../services/category.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  parentCategories: Category[] = []; // Initialize as empty array
  searchTerm: string = '';
  
  // Modal state
  showModal: boolean = false;
  modalMode: 'create' | 'edit' = 'create';
  currentCategory: Partial<Category> = {};
  
  // Form state
  isLoading: boolean = false;
  isSaving: boolean = false;
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 15;
  totalPages: number = 1;

  constructor(
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadParentCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllCategoriesWithCounts().subscribe({
      next: (categories: Category[]) => {
        console.log('=== API Response Debug ===');
        console.log('Raw categories from API:', categories);
        categories.forEach((cat, index) => {
          console.log(`Category ${index + 1}:`, {
            name: cat.name,
            isActive: cat.isActive,
            isActiveType: typeof cat.isActive,
            fullObject: cat
          });
        });
        
        // Ensure isActive has a default value if missing
        this.categories = categories.map(cat => ({
          ...cat,
          isActive: cat.isActive !== undefined ? cat.isActive : true
        }));
        
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
        this.toastService.showToast('Failed to load categories', 'error');
        this.isLoading = false;
      }
    });
  }

  loadParentCategories(): void {
    console.log('Loading parent categories...');
    this.categoryService.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        console.log('Raw categories from API:', categories);
        
        // Show all categories as potential parents, but filter out the current category when editing
        this.parentCategories = categories.filter(cat => {
          // Only show active categories as potential parents
          if (!cat.isActive) return false;
          
          // For editing mode, exclude the current category and its descendants
          if (this.modalMode === 'edit' && this.currentCategory._id) {
            return cat._id !== this.currentCategory._id;
          }
          // For create mode, show all active categories
          return true;
        });
        
        console.log('Filtered parent categories:', this.parentCategories);
        console.log('Parent categories count:', this.parentCategories.length);
      },
      error: (error: any) => {
        console.error('Error loading parent categories:', error);
        this.toastService.showToast('Failed to load parent categories', 'error');
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.categories];
    
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchLower) ||
        (category.description && category.description.toLowerCase().includes(searchLower))
      );
    }
    
    this.filteredCategories = filtered;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCategories.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  getPaginatedCategories(): Category[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCategories.slice(startIndex, endIndex);
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  // Modal methods
  openCreateModal(): void {
    console.log('Opening create modal...');
    this.modalMode = 'create';
    this.currentCategory = {
      name: '',
      description: '',
      isActive: true,
      displayOrder: 0,
      parentCategory: undefined
    };
    this.showModal = true;
    
    // Load parent categories after setting modal to true
    setTimeout(() => {
      this.loadParentCategories();
    }, 100);
  }

  openEditModal(category: Category): void {
    this.modalMode = 'edit';
    this.currentCategory = { ...category };
    this.loadParentCategories(); // Refresh parent categories when opening modal
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentCategory = {};
  }

  // CRUD operations
  saveCategory(): void {
    if (!this.currentCategory.name?.trim()) {
      this.toastService.showToast('Category name is required', 'error');
      return;
    }

    this.isSaving = true;
    
    if (this.modalMode === 'create') {
      this.categoryService.createCategory(this.currentCategory).subscribe({
        next: (category: Category) => {
          this.toastService.showToast('Category created successfully', 'success');
          this.loadCategories();
          this.loadParentCategories(); // Refresh parent categories
          this.closeModal();
          this.isSaving = false;
        },
        error: (error: any) => {
          console.error('Error creating category:', error);
          this.toastService.showToast(error.error?.message || 'Failed to create category', 'error');
          this.isSaving = false;
        }
      });
    } else {
      this.categoryService.updateCategory(this.currentCategory._id!, this.currentCategory).subscribe({
        next: (category: Category) => {
          this.toastService.showToast('Category updated successfully', 'success');
          this.loadCategories();
          this.loadParentCategories(); // Refresh parent categories
          this.closeModal();
          this.isSaving = false;
        },
        error: (error: any) => {
          console.error('Error updating category:', error);
          this.toastService.showToast(error.error?.message || 'Failed to update category', 'error');
          this.isSaving = false;
        }
      });
    }
  }

  deleteCategory(category: Category): void {
    if (category.productCount && category.productCount > 0) {
      const confirmMessage = `This category has ${category.productCount} products. It will be deactivated instead of deleted. Continue?`;
      if (!confirm(confirmMessage)) return;
    } else {
      if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;
    }

    this.categoryService.deleteCategory(category._id).subscribe({
      next: (response: any) => {
        this.toastService.showToast(response.message || 'Category deleted successfully', 'success');
        this.loadCategories();
      },
      error: (error: any) => {
        console.error('Error deleting category:', error);
        this.toastService.showToast(error.error?.message || 'Failed to delete category', 'error');
      }
    });
  }

  toggleActiveStatus(category: Category): void {
    const updatedCategory = { ...category, isActive: !category.isActive };
    
    this.categoryService.updateCategory(category._id, updatedCategory).subscribe({
      next: () => {
        const status = updatedCategory.isActive ? 'activated' : 'deactivated';
        this.toastService.showToast(`Category ${status} successfully`, 'success');
        this.loadCategories();
      },
      error: (error: any) => {
        console.error('Error updating category status:', error);
        this.toastService.showToast('Failed to update category status', 'error');
      }
    });
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (this.currentPage > 3) {
        pages.push('...');
      }
      
      const startPage = Math.max(2, this.currentPage - 1);
      const endPage = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (this.currentPage < this.totalPages - 2) {
        pages.push('...');
      }
      
      pages.push(this.totalPages);
    }

    return pages;
  }

  // Helper method to get parent category name
  getParentCategoryName(parentCategoryId: string): string {
    if (!parentCategoryId) return '';
    
    const parentCategory = this.categories.find(cat => cat._id === parentCategoryId);
    return parentCategory ? parentCategory.name : 'Unknown';
  }

  // Helper method to count subcategories
  getSubcategoryCount(parentId: string): number {
    if (!this.categories || !parentId) return 0;
    return this.categories.filter(cat => cat.parentCategory === parentId).length;
  }

  // Helper method for tracking in ngFor
  trackByCategory(index: number, category: Category): string {
    return category._id;
  }
}
