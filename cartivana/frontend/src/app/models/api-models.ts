export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'customer' | 'supplier' | 'admin';
    token?: string;
  }
  
export interface Product {
  rejectionReason?: string; // was any
  status?: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  supplier?: User;
  details?: string;
  specs?: string[]; // Array of product specifications
  sku?: string;
}
  
export interface OrderItem {
  product: Product;
  quantity: number;
  name?: string;
  price?: number;
  supplier?: User;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}
  
  export interface Order {
    _id: string;
    products: OrderItem[];
    totalAmount: number;
    createdAt: string;
  }
  
  export interface RoleCount {
    _id: string;
    count: number;
  }
  
  export interface AdminStats {
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
    roleCounts: RoleCount[];
    monthlyOrders: number[];
    [key: string]: any;
  }
