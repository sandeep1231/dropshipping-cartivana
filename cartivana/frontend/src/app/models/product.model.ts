export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  supplier?: {
    _id: string;
    name: string;
    email: string;
  };
  status?: 'approved' | 'pending' | 'rejected';
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  specs?: string[]; // Array of product specifications
}
  