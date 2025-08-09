import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import API, { BASE_IMAGE_URL } from "../axiosInstance";
import { useCart } from "../context/CartContext";

const Home = () => {
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const flashSaleRef = useRef(null);
  const { addToCart } = useCart();

  const endTime = new Date("2025-08-05T23:59:59");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, bestRes] = await Promise.all([
          API.get("/products"),
          API.get("/products?bestseller=true"),
        ]);

        const allProducts = allRes.data;

        const discounted = allProducts
          .filter((p) => p.promotion && p.promotion.discount > 0)
          .sort((a, b) => b.promotion.discount - a.promotion.discount)
          .slice(0, 8);

        setDiscountedProducts(discounted);
        setBestSellers(bestRes.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      const now = new Date();
      const diff = endTime - now;

      if (diff <= 0) {
        clearInterval(countdown);
        setTimeLeft({});
      } else {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const categories = [
    { name: "Shounen", image: "/naruto-category.jpeg" },
    { name: "Mecha", image: "/zoro-category.jpeg" },
    { name: "Fantasy", image: "/songogu-category.jpeg" },
    { name: "Chibi", image: "/natsu-category.jpeg" },
  ];

  const scrollFlashSale = (direction) => {
    const scrollAmount = 320;
    if (flashSaleRef.current) {
      flashSaleRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const formatTime = (val) => (val < 10 ? `0${val}` : val);

  return (
    <div className="bg-white text-gray-800">
      {/* HERO BANNER */}
      <section
        className="relative bg-cover bg-center min-h-screen w-full overflow-hidden"
        style={{ backgroundImage: "url('/banner.png')" }}
      >
        <motion.h1
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="absolute top-1/3 w-full text-center text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg"
        >
          Khám phá thế giới mô hình Anime
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          viewport={{ once: true }}
          className="absolute top-[45%] w-full text-center text-lg md:text-xl text-white"
        >
          Giảm giá cực sốc – Giao hàng toàn quốc ✨
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          viewport={{ once: true }}
          className="absolute top-[55%] w-full text-center"
        >
          <Link
            to="/products"
            className="bg-green-600 px-8 py-3 text-white font-bold text-lg rounded-full hover:bg-green-700 transition shadow-lg"
          >
            Mua ngay
          </Link>
        </motion.div>
      </section>

      {/* THỂ LOẠI NỔI BẬT */}
      <section className="py-14 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-10 text-green-900">
            Thể loại nổi bật
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={idx}
                className="bg-white rounded-xl shadow-md overflow-hidden group transition-all duration-300 border"
              >
                <div className="relative w-full aspect-[3/4]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-white text-xl font-bold">{cat.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FLASH SALE */}
      <section className="relative bg-green-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span>🔥 FLASH SALE</span>
              <span className="text-yellow-300 font-mono text-2xl">
                {timeLeft.hours !== undefined
                  ? `${formatTime(timeLeft.hours)}:${formatTime(
                      timeLeft.minutes
                    )}:${formatTime(timeLeft.seconds)}`
                  : "00:00:00"}
              </span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Nút trái */}
            <button
              onClick={() => scrollFlashSale("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 
                   w-10 h-10 flex items-center justify-center 
                   bg-green-600 hover:bg-green-700 active:opacity-70 
                   text-white rounded-full shadow-md 
                   transition duration-200"
            >
              <FiChevronLeft size={24} />
            </button>

            {/* Danh sách sản phẩm */}
            <div
              ref={flashSaleRef}
              className="overflow-x-auto scroll-smooth px-6 pb-4"
            >
              <div className="flex gap-4 w-max">
                {discountedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="w-[220px] h-[320px] bg-white rounded-xl shadow-md text-black p-4 flex-shrink-0 flex flex-col justify-between"
                  >
                    <div className="w-full aspect-[3/4] overflow-hidden rounded-md mb-3 flex items-center justify-center bg-white">
                      <img
                        src={`${BASE_IMAGE_URL}${p.image}`}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 h-[40px]">
                      {p.name}
                    </h3>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-500 line-through">
                          {p.price.toLocaleString()}đ
                        </span>
                        <span className="text-green-600 font-bold text-lg">
                          {p.finalPrice.toLocaleString()}đ
                        </span>
                      </div>
                      <Link to={`/products/${p.id}`}>
                        <button className="bg-green-700 hover:bg-green-800 text-white py-1 px-4 rounded-full text-sm w-full">
                          Mua ngay
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nút phải */}
            <button
              onClick={() => scrollFlashSale("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 
                   w-10 h-10 flex items-center justify-center 
                   bg-green-600 hover:bg-green-700 active:opacity-70 
                   text-white rounded-full shadow-md 
                   transition duration-200"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* SẢN PHẨM MỚI */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-green-900 mb-6"
        >
          🆕 Sản phẩm mới
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellers.map((p) => (
            <motion.div
              key={p.id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col justify-between"
              whileHover={{ scale: 1.04 }}
            >
              {/* Ảnh sản phẩm */}
              <div className="w-full aspect-[3/4] overflow-hidden flex items-center justify-center bg-white p-3">
                <img
                  src={`${BASE_IMAGE_URL}${p.image}`}
                  alt={p.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Thông tin */}
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-sm line-clamp-2 h-[40px]">
                  {p.name}
                </h3>
                <p className="text-green-700 font-bold text-lg">
                  {p.finalPrice.toLocaleString()}đ
                </p>

                {/* Nút hành động */}
                <div className="flex gap-2 mt-2">
                  <Link
                    to={`/products/${p.id}`}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-full text-base font-semibold text-center transition-all duration-200"
                  >
                    Mua ngay
                  </Link>
                  <button
                    onClick={() => addToCart(p.id)}
                    className="flex items-center justify-center w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full text-lg transition-all duration-200"
                    title="Thêm vào giỏ hàng"
                  >
                    🛒
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
