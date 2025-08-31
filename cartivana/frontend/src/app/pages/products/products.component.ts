import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';
import { OrderService } from '../../services/order.service';
import { Product, Order } from '../../models/api-models';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../services/toast.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

// Extended Product interface for frontend features
interface ExtendedProduct extends Product {
  rating?: number;
  reviewCount?: number;
  originalPrice?: number;
  isNew?: boolean;
}

// Interface for tree structure
interface CategoryTreeNode {
  category: Category;
  children: CategoryTreeNode[];
  isExpanded?: boolean;
  isSelected?: boolean;
  isIndeterminate?: boolean; // For partial selection of children
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: false
})
export class ProductsComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    private toastService: ToastService
  ){}

  // Product data
  allProducts: ExtendedProduct[] = [];
  filteredProducts: ExtendedProduct[] = [];
  paginatedProducts: ExtendedProduct[] = [];
  parentCategories: Category[] = []; // Parent (top-level) categories
  subcategories: Category[] = []; // Child categories
  allCategories: Category[] = []; // Full category objects for mapping
  quantities: { [key: string]: number } = {};

  // Search functionality
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private filterSubject = new Subject<void>();
  searchSuggestions: string[] = [];
  showSuggestions: boolean = false;
  highlightedSuggestionIndex: number = -1;
  popularSearches: string[] = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports & Fitness',
    'Books',
    'Beauty & Health'
  ];

  // Filter functionality - Updated for tree structure
  selectedCategories: { [key: string]: boolean } = {}; // Changed from single to multiple
  expandedCategories: { [key: string]: boolean } = {}; // Track expanded state
  categoryTree: CategoryTreeNode[] = []; // Tree structure for display
  priceRange = { min: null as number | null, max: null as number | null };
  ratingOptions = [1, 2, 3, 4, 5];
  selectedRatings: { [key: number]: boolean } = {};

  // UI state
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: string = 'newest'; // Changed from 'default' to a valid sort option
  sidebarOpen = false;
  
  // Loading states
  isLoading = false;
  isSuggestionsLoading = false;
  
  // Custom sort dropdown state
  sortDropdownOpen = false;
  sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  // Helper method to get category name from ObjectId or populated data
  getCategoryName(categoryValue: any): string {
    if (!categoryValue) return 'No Category';
    
    // If it's already a category object with name (from populated data)
    if (typeof categoryValue === 'object' && categoryValue.name) {
      return categoryValue.name;
    }
    
    // If it's a string, it might be a name already or an ObjectId
    if (typeof categoryValue === 'string') {
      // If it looks like an ObjectId (24 hex characters), try to find the category
      if (categoryValue.length === 24 && /^[0-9a-fA-F]{24}$/.test(categoryValue)) {
        const category = this.allCategories?.find((cat: any) => cat._id === categoryValue);
        return category ? category.name : 'Unknown Category';
      }
      // Otherwise, assume it's already a category name
      return categoryValue;
    }
    
    return 'Unknown Category';
  }

  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;
  totalResults = 0;

  // Quick view and wishlist
  quickViewProduct: ExtendedProduct | null = null;
  wishlist: string[] = [];

  Math = Math;

  ngOnInit(): void {
    // Initialize arrays
    this.categoryTree = [];
    this.allCategories = [];
    this.parentCategories = [];
    this.subcategories = [];
    
    // Initialize wishlist from localStorage
    this.initializeWishlist();

    // Setup search debouncing for suggestions only
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      if (searchTerm.length >= 2) {
        this.loadSearchSuggestions(searchTerm);
      } else if (searchTerm.length === 0) {
        this.searchSuggestions = [...this.popularSearches];
      }
      this.showSuggestions = true;
      this.highlightedSuggestionIndex = -1;
    });

    // Setup filter debouncing for price range inputs
    this.filterSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadProducts();
    });

    // Load categories first
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        // Ensure isActive has a default value and filter for active categories
        const activeCategories = data.map(cat => ({
          ...cat,
          isActive: cat.isActive !== undefined ? cat.isActive : true
        })).filter(cat => cat.isActive);
        
        this.allCategories = activeCategories; // Store full category objects
        
        // Separate parent categories and subcategories
        this.parentCategories = activeCategories.filter(cat => !cat.parentCategory || cat.parentCategory === null || cat.parentCategory === 'null');
        this.subcategories = activeCategories.filter(cat => cat.parentCategory && cat.parentCategory !== null && cat.parentCategory !== 'null');
        
        // Build category tree structure
        this.categoryTree = this.buildCategoryTree(activeCategories);
        
        console.log('Categories loaded successfully:', {
          total: activeCategories.length,
          parents: this.parentCategories.length,
          children: this.subcategories.length,
          treeNodes: this.categoryTree.length
        });
        
        // Check for category parameter in URL
        this.route.queryParams.subscribe(params => {
          if (params['category']) {
            // Find category by name and set it as selected
            const foundCategory = activeCategories.find(cat => cat.name === params['category']);
            if (foundCategory) {
              this.selectedCategories[foundCategory._id] = true;
            }
          }
          // Load products after categories are loaded
          this.loadProducts();
        });
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Fallback: try to load products anyway
        this.loadProducts();
      }
    });
  }

  // Search functionality
  onSearchChange(): void {
    // Only trigger suggestions, not full search
    this.searchSubject.next(this.searchTerm);
  }

  // Trigger full search (on Enter, search icon click, or suggestion selection)
  performFullSearch(): void {
    this.showSuggestions = false;
    this.highlightedSuggestionIndex = -1;
    this.currentPage = 1; // Reset to first page
    this.loadProducts();
  }

  // Load search suggestions from API
  loadSearchSuggestions(query: string): void {
    this.isSuggestionsLoading = true;
    
    this.productService.getSearchSuggestions(query).subscribe({
      next: (suggestions) => {
        this.searchSuggestions = suggestions;
        this.isSuggestionsLoading = false;
      },
      error: (error) => {
        console.error('Failed to load suggestions:', error);
        // Fallback to local suggestions
        this.generateSearchSuggestions();
        this.isSuggestionsLoading = false;
      }
    });
  }

  // Load products with current filters and search
  loadProducts(): void {
    this.isLoading = true;
    
    // Get selected category IDs
    const selectedCategoryIds = Object.keys(this.selectedCategories)
      .filter(id => this.selectedCategories[id]);
    
    const searchParams = {
      query: this.searchTerm || undefined,
      categories: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
      minPrice: this.priceRange.min || undefined,
      maxPrice: this.priceRange.max || undefined,
      rating: this.getSelectedRatings() || undefined,
      sortBy: this.sortBy,
      page: this.currentPage,
      limit: this.itemsPerPage
    };

    this.productService.searchProducts(searchParams).subscribe({
      next: (response) => {
        // Process the API response
        this.allProducts = response.products.map(product => ({
          ...product,
          imageUrls: Array.isArray(product.imageUrls) && product.imageUrls.length > 0
            ? product.imageUrls.map(url => url.startsWith('/uploads')
              ? environment.apiUrl.replace(/\/api$/, '') + url
              : url)
            : ['/assets/images/placeholder.svg'],
          rating: (product as any).rating || Math.floor(Math.random() * 2) + 4,
          reviewCount: (product as any).reviewCount || Math.floor(Math.random() * 50) + 10,
          isNew: Math.random() > 0.7,
          originalPrice: (product as any).originalPrice || (Math.random() > 0.6 ? product.price * 1.2 : undefined)
        }));
        
        // API returns filtered and sorted results, so we use them directly
        this.filteredProducts = [...this.allProducts];
        this.paginatedProducts = [...this.allProducts];
        this.totalResults = response.total;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.isLoading = false;

        // Initialize quantities
        this.allProducts.forEach(p => {
          if (!this.quantities[p._id]) {
            this.quantities[p._id] = 1;
          }
        });
      },
      error: (error) => {
        console.error('Failed to load products:', error);
        this.isLoading = false;
        this.toastService.showToast('Failed to load products. Please try again.', 'error');
      }
    });
  }

  // Get selected ratings for API call
  getSelectedRatings(): number | undefined {
    const selectedRatings = Object.keys(this.selectedRatings)
      .filter(rating => this.selectedRatings[+rating])
      .map(rating => +rating);
    
    return selectedRatings.length > 0 ? Math.min(...selectedRatings) : undefined;
  }

  onSearchFocus(): void {
    if (this.searchTerm || this.popularSearches.length > 0) {
      this.generateSearchSuggestions();
      this.showSuggestions = true;
      this.highlightedSuggestionIndex = -1;
    }
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (!this.showSuggestions || this.searchSuggestions.length === 0) {
      if (event.key === 'Enter') {
        this.performFullSearch();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedSuggestionIndex = Math.min(
          this.highlightedSuggestionIndex + 1,
          this.searchSuggestions.length - 1
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedSuggestionIndex = Math.max(this.highlightedSuggestionIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.highlightedSuggestionIndex >= 0) {
          this.selectSuggestion(this.searchSuggestions[this.highlightedSuggestionIndex]);
        } else {
          this.performFullSearch();
        }
        break;
      case 'Escape':
        this.showSuggestions = false;
        this.highlightedSuggestionIndex = -1;
        break;
    }
  }

  selectSuggestion(suggestion: string): void {
    this.searchTerm = suggestion;
    this.performFullSearch();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchSuggestions = [];
    this.showSuggestions = false;
    this.highlightedSuggestionIndex = -1;
    this.performFullSearch(); // Reload all products
  }

  // Fallback method for generating local suggestions (used as backup)
  generateSearchSuggestions(): void {
    if (!this.searchTerm) {
      this.searchSuggestions = [...this.popularSearches];
      return;
    }

    // Simple fallback - just show popular searches
    this.searchSuggestions = this.popularSearches.filter(search => 
      search.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (this.searchSuggestions.length === 0) {
      this.searchSuggestions = [...this.popularSearches];
    }
  }

  highlightSearchTerm(text: string): string {
    if (!this.searchTerm) return text;
    
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }

  // Filter functionality - all filters now trigger API calls
  applyFilters(): void {
    this.currentPage = 1; // Reset to first page when filtering
    this.loadProducts();
  }

  // Immediate filter changes (category, rating)
  onCategoryChange(categoryId?: string): void {
    this.currentPage = 1; // Reset to first page when filtering
    this.loadProducts(); // Trigger API call with updated selections
  }

  onRatingChange(): void {
    this.applyFilters();
  }

  // Debounced filter changes (price range)
  onPriceRangeChange(): void {
    this.currentPage = 1; // Reset to first page when filtering
    this.filterSubject.next();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategories = {}; // Clear all selected categories
    this.priceRange = { min: null, max: null };
    this.selectedRatings = {};
    this.sortBy = 'newest';
    this.applyFilters();
  }

  // Sorting functionality - triggers API call
  applySorting(): void {
    this.currentPage = 1; // Reset to first page when sorting
    this.loadProducts();
  }

  // Pagination functionality - API-driven
  updatePagination(): void {
    // With API pagination, this method is not needed as API handles pagination
    // We keep it for backward compatibility but it does nothing
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadProducts(); // Load new page from API
      // Scroll to top of products
      document.querySelector('.products-container')?.scrollIntoView({ behavior: 'smooth' });
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

  // View mode functionality
  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  toggleSidebar(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.sidebarOpen = !this.sidebarOpen;
    console.log('Sidebar toggled:', this.sidebarOpen);
    
    // Force change detection for mobile devices
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.querySelector('.sidebar-backdrop');
        console.log('Sidebar element:', sidebar);
        console.log('Sidebar classes:', sidebar?.className);
        console.log('Backdrop element:', backdrop);
        console.log('Backdrop classes:', backdrop?.className);
      }, 100);
    }
  }

  // Mobile specific methods
  applyFiltersAndClose(): void {
    this.applyFilters(); // This now triggers API call
    this.toggleSidebar(); // Close the sidebar after applying filters
  }

  // Wishlist functionality
  initializeWishlist(): void {
    const saved = localStorage.getItem('cartivana_wishlist');
    this.wishlist = saved ? JSON.parse(saved) : [];
  }

  toggleWishlist(product: ExtendedProduct): void {
    const index = this.wishlist.indexOf(product._id);
    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.toastService.showToast('Removed from wishlist', 'info');
    } else {
      this.wishlist.push(product._id);
      this.toastService.showToast('Added to wishlist', 'success');
    }
    localStorage.setItem('cartivana_wishlist', JSON.stringify(this.wishlist));
  }

  isInWishlist(productId: string): boolean {
    return this.wishlist.includes(productId);
  }

  // Quick view functionality
  openQuickView(product: ExtendedProduct): void {
    this.quickViewProduct = product;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeQuickView(): void {
    this.quickViewProduct = null;
    document.body.style.overflow = 'auto'; // Restore scrolling
  }

  // Utility functions
  getProductImage(product: ExtendedProduct): string {
    return product.imageUrls && product.imageUrls.length > 0 
      ? product.imageUrls[0] 
      : '/assets/images/placeholder.svg';
  }

  onImageError(event: any): void {
    if (event.target.src !== '/assets/images/placeholder.svg') {
      event.target.src = '/assets/images/placeholder.svg';
    }
  }

  getStarArray(rating: number): number[] {
    if (!rating) return [];
    return new Array(Math.floor(rating)).fill(0);
  }

  trackByProduct(index: number, product: ExtendedProduct): string {
    return product._id;
  }

  trackByIndex(index: number): number {
    return index;
  }

  // Quantity controls
  incrementQuantity(productId: string): void {
    if (!this.quantities[productId]) {
      this.quantities[productId] = 1;
    }
    this.quantities[productId]++;
  }

  decrementQuantity(productId: string): void {
    if (!this.quantities[productId]) {
      this.quantities[productId] = 1;
    }
    if (this.quantities[productId] > 1) {
      this.quantities[productId]--;
    }
  }

  // Legacy method for backward compatibility - now works with checkboxes
  filterByCategory(categoryName: string): void {
    // Clear all selections first
    this.selectedCategories = {};
    
    // Find and select the category by name
    const category = this.allCategories.find(cat => cat.name === categoryName);
    if (category) {
      this.selectedCategories[category._id] = true;
    }
    
    this.applyFilters(); // This now triggers API call
  }

  // Helper method to get parent category name
  getParentCategoryName(parentId: string): string {
    const parent = this.allCategories.find(cat => cat._id === parentId);
    return parent ? parent.name : 'Unknown';
  }

  // TrackBy function for performance
  trackByFn(index: number, item: any): any {
    return item.category?._id || index;
  }

  // Build category tree structure
  buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
    if (!categories || categories.length === 0) {
      console.warn('No categories provided to buildCategoryTree');
      return [];
    }
    
    const parentCategories = categories.filter((cat: Category) => !cat.parentCategory || cat.parentCategory === null || cat.parentCategory === 'null');
    
    if (parentCategories.length === 0) {
      console.warn('No parent categories found');
      return [];
    }
    
    const tree = parentCategories.map((parent: Category) => {
      const children = this.buildCategoryChildren(parent._id, categories);
      
      return {
        category: parent,
        children: children,
        isExpanded: this.expandedCategories[parent._id] || false,
        isSelected: this.selectedCategories[parent._id] || false,
        isIndeterminate: this.isParentIndeterminate(parent._id, categories)
      };
    });
    
    return tree;
  }

  // Build children for a parent category
  buildCategoryChildren(parentId: string, categories: Category[]): CategoryTreeNode[] {
    const children = categories.filter((cat: Category) => {
      // Convert both to strings for comparison (MongoDB ObjectId issue)
      const catParentId = cat.parentCategory ? String(cat.parentCategory) : null;
      const targetParentId = String(parentId);
      return catParentId === targetParentId;
    });
    
    return children.map((child: Category) => ({
      category: child,
      children: [], // For now, we only support 2 levels
      isExpanded: false,
      isSelected: this.selectedCategories[child._id] || false,
      isIndeterminate: false
    }));
  }

  // Check if parent should be in indeterminate state
  isParentIndeterminate(parentId: string, categories: Category[]): boolean {
    const children = categories.filter((cat: Category) => {
      const catParentId = cat.parentCategory ? String(cat.parentCategory) : null;
      return catParentId === String(parentId);
    });
    
    if (children.length === 0) return false;
    
    const selectedChildren = children.filter((child: Category) => this.selectedCategories[child._id]);
    return selectedChildren.length > 0 && selectedChildren.length < children.length;
  }

  // Toggle category expansion with touch support
  toggleCategoryExpansion(categoryId: string, event?: Event): void {
    // Prevent event bubbling to avoid conflicts with parent elements
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    this.expandedCategories[categoryId] = !this.expandedCategories[categoryId];
    // Rebuild tree to update expanded state
    this.categoryTree = this.buildCategoryTree(this.allCategories);
    
    console.log(`Category ${categoryId} expanded: ${this.expandedCategories[categoryId]}`);
  }

  // Handle parent category selection
  onParentCategoryChange(parentNode: CategoryTreeNode, event?: Event): void {
    // Prevent event bubbling
    if (event) {
      event.stopPropagation();
    }
    
    const parentId = parentNode.category._id;
    const isSelected = !this.selectedCategories[parentId];
    
    // Set parent selection
    this.selectedCategories[parentId] = isSelected;
    
    // Set all children to same state as parent
    parentNode.children.forEach(child => {
      this.selectedCategories[child.category._id] = isSelected;
    });
    
    // Update tree and trigger search
    this.categoryTree = this.buildCategoryTree(this.allCategories);
    this.onCategoryChange();
    
    console.log(`Parent category ${parentNode.category.name} selected: ${isSelected}`);
  }

  // Handle child category selection
  onChildCategoryChange(parentNode: CategoryTreeNode, childNode: CategoryTreeNode, event?: Event): void {
    // Prevent event bubbling
    if (event) {
      event.stopPropagation();
    }
    
    const childId = childNode.category._id;
    const parentId = parentNode.category._id;
    
    // Toggle child selection
    this.selectedCategories[childId] = !this.selectedCategories[childId];
    
    // Check if all children are selected/deselected to update parent
    const allChildrenSelected = parentNode.children.every(child => 
      this.selectedCategories[child.category._id]
    );
    const noChildrenSelected = parentNode.children.every(child => 
      !this.selectedCategories[child.category._id]
    );
    
    if (allChildrenSelected) {
      this.selectedCategories[parentId] = true;
    } else if (noChildrenSelected) {
      this.selectedCategories[parentId] = false;
    }
    
    // Update tree and trigger search
    this.categoryTree = this.buildCategoryTree(this.allCategories);
    this.onCategoryChange();
  }

  addToCart(productId: string, quantity: number = 1): void {
    this.cartService.addToCart(productId, quantity).subscribe(() => {
      this.toastService.showToast('Product added to cart!', 'success');
      this.cartService.refreshCartQuantity();
    });
  }

  buyNow(productId: string, quantity: number = 1): void {
    const product = this.allProducts.find(p => p._id === productId);
    if (!product) return;
    
    const totalAmount = product.price * quantity;
    this.orderService.buyNow(productId, quantity, totalAmount).subscribe({
      next: (order: Order) => {
        this.toastService.showToast('Order placed successfully!', 'success');
        this.router.navigate(['/order-confirmation'], { queryParams: { orderId: order._id } });
      },
      error: (error) => {
        console.error('Buy now failed:', error);
        this.toastService.showToast('Failed to place order. Please try again.', 'error');
      }
    });
  }

  // Custom sort dropdown methods
  toggleSortDropdown(): void {
    this.sortDropdownOpen = !this.sortDropdownOpen;
  }

  selectSortOption(value: string): void {
    this.sortBy = value;
    this.sortDropdownOpen = false;
    this.applySorting(); // This now triggers API call
  }

  getSortDisplayText(): string {
    const option = this.sortOptions.find(opt => opt.value === this.sortBy);
    return option ? option.label : 'Newest First';
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Close sort dropdown
    const sortDropdown = target.closest('.sort-dropdown');
    if (!sortDropdown && this.sortDropdownOpen) {
      this.sortDropdownOpen = false;
    }

    // Close search suggestions
    const searchContainer = target.closest('.search-input-wrapper');
    if (!searchContainer && this.showSuggestions) {
      this.showSuggestions = false;
      this.highlightedSuggestionIndex = -1;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const sortDropdown = document.querySelector('.sort-dropdown') as HTMLElement;
    const sidebar = document.querySelector('.sidebar') as HTMLElement;

    // Close sort dropdown if clicked outside
    if (this.sortDropdownOpen && sortDropdown && !sortDropdown.contains(target)) {
      this.sortDropdownOpen = false;
    }

    // Close sidebar if clicked outside
    if (this.sidebarOpen && sidebar && !sidebar.contains(target)) {
      this.sidebarOpen = false;
    }
  }
}
