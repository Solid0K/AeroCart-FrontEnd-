import { createContext, useCallback, useEffect, useState } from "react";
import { getCart, addCartItem, updateCartItem, removeCartItem, clearCart } from "@/api/cart";
import { useAuth } from "@/hooks/useAuth";

export const CartContext = createContext(null);

const EMPTY_CART = { items: [], totalAmount: 0 };

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(EMPTY_CART);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setCart(EMPTY_CART);
      return;
    }
    setLoading(true);
    try {
      const data = await getCart();
      setCart(data || EMPTY_CART);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(async (payload) => {
    const data = await addCartItem(payload);
    setCart(data);
    return data;
  }, []);

  const updateItem = useCallback(async (productId, payload) => {
    const data = await updateCartItem(productId, payload);
    setCart(data);
    return data;
  }, []);

  const removeItem = useCallback(async (productId) => {
    const data = await removeCartItem(productId);
    setCart(data);
    return data;
  }, []);

  const clear = useCallback(async () => {
    await clearCart();
    setCart(EMPTY_CART);
  }, []);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, loading, itemCount, refresh, addItem, updateItem, removeItem, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}
