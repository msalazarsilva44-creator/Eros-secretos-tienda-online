import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, CartItem } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        // Si ya existe, incrementar cantidad
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Si no existe, agregar nuevo item
      toast.success(`${product.name} agregado al carrito`);
      return [...prevItems, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.product.id !== productId);
      toast.success('Producto eliminado del carrito');
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.success('Carrito vaciado');
  }, []);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const value: CartContextType = {
    items,
    itemCount,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

