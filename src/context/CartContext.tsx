import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  total: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'total'>) => void;
  removeFromCart: (id: number, size?: string) => void;
  updateQuantity: (id: number, quantity: number, size?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    
    // Calculate total price
    const total = items.reduce((sum, item) => sum + item.total, 0);
    setCartTotal(total);
    
    // Calculate total items
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'total'>) => {
    setItems(prevItems => {
      // Check if item already exists in cart (considering size for t-shirts)
      const itemKeyToMatch = item.size 
        ? `${item.id}-${item.size}` 
        : `${item.id}`;
      
      const existingItemIndex = prevItems.findIndex(cartItem => {
        const cartItemKey = cartItem.size 
          ? `${cartItem.id}-${cartItem.size}` 
          : `${cartItem.id}`;
        return cartItemKey === itemKeyToMatch;
      });

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        const updatedItem = { 
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        };
        updatedItem.total = updatedItem.price * updatedItem.quantity;
        updatedItems[existingItemIndex] = updatedItem;
        return updatedItems;
      } else {
        // Item doesn't exist, add it
        const newItem = {
          ...item,
          total: item.price * item.quantity
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (id: number, size?: string) => {
    setItems(prevItems => {
      return prevItems.filter(item => {
        // If size is provided, only remove item with matching id AND size
        if (size) {
          return !(item.id === id && item.size === size);
        }
        // Otherwise remove item with matching id
        return item.id !== id;
      });
    });
  };

  const updateQuantity = (id: number, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    setItems(prevItems => {
      return prevItems.map(item => {
        // Match item by id and size (if provided)
        if (item.id === id && (!size || item.size === size)) {
          return {
            ...item,
            quantity,
            total: item.price * quantity
          };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
