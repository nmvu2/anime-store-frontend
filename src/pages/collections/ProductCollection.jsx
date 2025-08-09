import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import API, { BASE_IMAGE_URL } from "../../axiosInstance";
import { useCart } from "../../context/CartContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ProductCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = useQuery();
  const category = query.get("category");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        let data = res.data;

        // Lọc theo category nếu có
        if (category) {
          data = data.filter(
            (p) =>
              p.category &&
              p.category.toLowerCase() === category.toLowerCase()
          );
        }

        setProducts(data);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading)
    return <div className="p-6 text-gray-600">Đang tải sản phẩm...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-green-900">
        {category ? `Thể loại: ${category}` : "Tất cả sản phẩm"}
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500">
          Không có sản phẩm nào thuộc thể loại này.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition flex flex-col justify-between"
            >
              {/* Ảnh sản phẩm */}
              <div className="w-full aspect-[3/4] bg-white p-3 flex items-center justify-center">
                <img
                  src={`${BASE_IMAGE_URL}${p.image}`}
                  alt={p.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Thông tin sản phẩm */}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCollection;
