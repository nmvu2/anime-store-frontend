import { createContext, useContext, useEffect, useState } from "react";
import API from "../axiosInstance";
import { AuthContext } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { user, isLoading } = useContext(AuthContext); // lấy isLoading để tránh chạy sớm

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      setCartCount(0);
      return;
    }
    try {
      const res = await API.get("/cart");
      const items = Array.isArray(res.data.items) ? res.data.items : [];
      setCartItems(items);
      setCartCount(items.length);
    } catch (err) {
      console.error("Lỗi khi tải giỏ hàng:", err);
      setCartItems([]);
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      fetchCart();
    }
  }, [user, isLoading]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return;
    try {
      await API.post("/cart", { productId, quantity });
      await fetchCart(); // ⬅ chờ fetch xong để minicart hiển thị ngay
    } catch (err) {
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", err);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user) return;
    try {
      await API.delete(`/cart/${itemId}`);
      await fetchCart();
    } catch (err) {
      console.error("❌ Lỗi khi xoá khỏi giỏ hàng:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, setCartCount, addToCart, removeFromCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart phải nằm trong CartProvider");
  return context;
};
