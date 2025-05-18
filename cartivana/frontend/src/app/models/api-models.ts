export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'customer' | 'supplier' | 'admin';
    token?: string;
  }
  
  export interface Product {
    rejectionReason?: any;
    status?: string;
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    category: string;
    supplier?: User;
    details?:string;
  }
  
  export interface OrderItem {
    product: Product;
    quantity: number;
  }
  
  export interface Order {
    _id: string;
    products: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
  }
  