import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CategoryService, Category } from '../../../services/category.service';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategorySelectorComponent),
      multi: true
    }
  ]
})
export class CategorySelectorComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string = 'Select a category';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Output() categorySelected = new EventEmitter<Category>();

  categories: Category[] = [];
  filteredCategories: Category[] = [];
  selectedCategory: Category | null = null;
  searchTerm: string = '';
  isOpen: boolean = false;
  isLoading: boolean = false;

  // ControlValueAccessor
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        console.log('CategorySelector - categories from API:', categories);
        
        // Ensure isActive has a default value and filter for active categories
        this.categories = categories.map(cat => ({
          ...cat,
          isActive: cat.isActive !== undefined ? cat.isActive : true
        })).filter((cat: Category) => cat.isActive);
        
        this.filteredCategories = [...this.categories];
        this.isLoading = false;
        
        console.log('CategorySelector - filtered categories:', this.categories);
      },
      error: (error: any) => {
        console.error('Error loading categories in CategorySelector:', error);
        this.isLoading = false;
      }
    });
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    if (value) {
      // Handle both string and object values
      if (typeof value === 'string') {
        this.selectedCategory = this.categories.find(cat => cat._id === value || cat.name === value) || null;
      } else if (value._id) {
        this.selectedCategory = value;
      }
    } else {
      this.selectedCategory = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Component methods
  toggleDropdown(): void {
    if (this.disabled) return;
    
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchTerm = '';
      this.filteredCategories = [...this.categories];
    }
    this.onTouched();
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.searchTerm = '';
    this.filteredCategories = [...this.categories];
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.onChange(category._id);
    this.categorySelected.emit(category);
    this.closeDropdown();
  }

  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = [...this.categories];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(searchLower) ||
      (category.description && category.description.toLowerCase().includes(searchLower))
    );
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeDropdown();
    }
  }

  getDisplayText(): string {
    if (!this.selectedCategory) return this.placeholder;
    
    // Show full path for subcategories
    if (this.selectedCategory.parentCategory) {
      const parentName = this.getParentCategoryName(this.selectedCategory.parentCategory);
      return `${parentName} > ${this.selectedCategory.name}`;
    }
    
    return this.selectedCategory.name;
  }

  getParentCategoryName(parentCategoryId: string): string {
    if (!parentCategoryId) return '';
    
    const parentCategory = this.categories.find(cat => cat._id === parentCategoryId);
    return parentCategory ? parentCategory.name : 'Unknown';
  }

  trackByCategory(index: number, category: Category): string {
    return category._id;
  }
}
