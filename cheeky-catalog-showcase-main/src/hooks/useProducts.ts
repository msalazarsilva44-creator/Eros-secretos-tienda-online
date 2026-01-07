import { useQuery } from '@tanstack/react-query';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  isNew?: boolean;
  description?: string;
}

interface BackendProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  category_name: string;
  image_url?: string;
  is_new: boolean;
  is_featured: boolean;
  stock: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const backendProducts: BackendProduct[] = await response.json();
      
      // Mapear campos del backend al formato esperado por el frontend
      return backendProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category_name,
        image: product.image_url 
          ? (product.image_url.startsWith('http') 
              ? product.image_url 
              : `${API_BASE_URL}${product.image_url}`)
          : '/placeholder.svg',
        isNew: product.is_new,
        description: product.description,
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 2,
  });
};

export const useCategories = () => {
  return useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const categories = await response.json();
      // El backend retorna un array de objetos con { id, name, slug, ...}
      // Extraer solo los nombres
      return categories.map((cat: any) => cat.name || cat);
    },
    staleTime: 1000 * 60 * 30, // 30 minutos (las categorías cambian menos)
    gcTime: 1000 * 60 * 60, // 1 hora
    retry: 2,
  });
};

