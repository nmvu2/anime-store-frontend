import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import API, { BASE_IMAGE_URL } from "../axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Lỗi khi tải categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-green-800 text-white px-6 py-3 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          Anime<span className="text-yellow-300">Shop</span>
        </Link>

        {/* Menu */}
        <nav className="flex items-center gap-6 relative">
          <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
          <Link to="/collections?sort=new" className="hover:text-yellow-300 transition">New Arrivals</Link>
          <Link to="/collections" className="hover:text-yellow-300 transition">Full Product</Link>

          {/* Dropdown thể loại */}
          <div
            className="relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button className="hover:text-yellow-300 transition">Thể loại ▾</button>
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white text-green-900 shadow-lg rounded-md overflow-hidden z-50"
                >
                  {categories.length > 0 ? (
                    categories.map((cat, idx) => (
                      <Link
                        to={`/collections?category=${encodeURIComponent(cat)}`}
                        key={idx}
                        className="block px-4 py-2 hover:bg-green-100 transition whitespace-nowrap"
                      >
                        {cat}
                      </Link>
                    ))
                  ) : (
                    <span className="block px-4 py-2 italic text-gray-500">
                      Không có thể loại
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/about" className="hover:text-yellow-300 transition">About Us</Link>

          {user && (user.role === "admin" || user.role === "staff") && (
            <Link
              to={user.role === "admin" ? "/admin/dashboard" : "/staff/dashboard"}
              className="hover:text-yellow-300 transition"
            >
              Quản trị
            </Link>
          )}

          {/* GIỎ HÀNG MINI */}
          <div
            className="relative"
            onMouseEnter={() => setShowCartPreview(true)}
            onMouseLeave={() => setShowCartPreview(false)}
          >
            <div
              onClick={() => navigate("/cart")}
              className="cursor-pointer relative"
            >
              <FiShoppingCart className="text-white text-2xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </div>

            {/* MINI CART PREVIEW */}
            <AnimatePresence>
              {showCartPreview && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-4 w-80 bg-white text-black shadow-xl rounded-lg p-4 z-50"
                >
                  {cartItems.length === 0 ? (
                    <p className="text-sm text-center">Giỏ hàng trống</p>
                  ) : (
                    <>
                      {cartItems.slice(0, 5).map((item) => {
                        const product = item.Product;
                        return (
                          <div key={item.id} className="flex items-center gap-2 mb-3 relative">
                            <img
                              src={
                                product?.images?.[0]?.url
                                  ? BASE_IMAGE_URL + product.images[0].url
                                  : product?.image
                                    ? BASE_IMAGE_URL + product.image
                                    : "/fallback.jpg"
                              }
                              alt={product?.name || "Sản phẩm"}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-semibold line-clamp-1">
                                {product?.name}
                              </p>
                              <p className="text-sm text-green-700">
                                {item.quantity} x {product?.finalPrice?.toLocaleString()}đ
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromCart(item.id);
                              }}
                              className="text-red-500 text-lg font-bold hover:text-red-700"
                              title="Xoá sản phẩm"
                            >
                              &times;
                            </button>
                          </div>
                        );
                      })}
                      <Link
                        to="/cart"
                        className="block mt-2 text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                      >
                        Xem giỏ hàng
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <>
              <span className="text-sm hidden md:inline">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="ml-2 bg-white text-green-800 font-semibold px-3 py-1 rounded hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300 transition">Đăng nhập</Link>
              <Link to="/register" className="hover:text-yellow-300 transition">Đăng ký</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
