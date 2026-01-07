/**
 * Tipos compartidos para el proyecto
 */

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  stock?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: 'admin' | 'user';
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

