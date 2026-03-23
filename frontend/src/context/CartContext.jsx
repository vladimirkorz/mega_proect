// frontend/src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../api/axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, token, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Загрузка корзины
  useEffect(() => {
    if (isAuthenticated && token) {
      // Если пользователь авторизован - загружаем с сервера
      loadCartFromServer();
    } else {
      // Если не авторизован - загружаем из localStorage
      loadCartFromLocalStorage();
    }
  }, [isAuthenticated, token]);

  const loadCartFromServer = async () => {
    setLoading(true);
    try {
      const response = await api.get("/cart");
      if (response.data) {
        setCart(response.data);
        localStorage.setItem("cart", JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Failed to load cart from server:", error);
      loadCartFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromLocalStorage = () => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    } else {
      setCart([]);
    }
  };

  // Синхронизация с сервером
  const syncCartWithServer = async (newCart) => {
    if (!isAuthenticated || !token) return;
    
    try {
      await api.post("/cart/sync", { items: newCart });
      console.log("Cart synced with server");
    } catch (error) {
      console.error("Failed to sync cart with server:", error);
    }
  };

  // Сохранение в localStorage и синхронизация
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    
    if (isAuthenticated && token) {
      syncCartWithServer(cart);
    }
  }, [cart, isAuthenticated, token]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    if (isAuthenticated && token) {
      api.delete("/cart/clear").catch(console.error);
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};