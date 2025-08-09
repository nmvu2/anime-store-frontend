import { createContext, useState, useEffect } from "react";
import API from "../axiosInstance"; // để gọi API /cart

// Tạo context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0); // 🆕 Số lượng sản phẩm giỏ hàng

  // Load user từ localStorage khi app khởi động
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // 🆕 Khi user thay đổi → load số lượng giỏ hàng từ API
  useEffect(() => {
    if (user) {
      API.get("/cart")
        .then((res) => {
          const totalItems = res.data.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          setCartCount(totalItems);
        })
        .catch((err) => {
          console.error("Lỗi khi load giỏ hàng:", err);
        });
    } else {
      setCartCount(0); // nếu chưa login thì giỏ hàng = 0
    }
  }, [user]);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCartCount(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        cartCount,
        setCartCount, // để component khác update khi thêm vào giỏ
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
