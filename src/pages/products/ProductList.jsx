import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import API from "../../axiosInstance";

const ProductList = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        setError("Không thể tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) {
      try {
        await API.delete(`/products/${id}`);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        alert("Xoá thất bại");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Danh sách sản phẩm</h2>
        <Link
          to="/products/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4">Tên</th>
                <th className="py-2 px-4">Giá</th>
                <th className="py-2 px-4">Giá cuối (sau KM)</th>
                <th className="py-2 px-4">Hình ảnh</th>
                <th className="py-2 px-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2 px-4">{p.name}</td>
                  <td className="py-2 px-4">{p.price.toLocaleString()} VND</td>
                  <td className="py-2 px-4 text-green-600 font-bold">
                    {p.finalPrice.toLocaleString()} VND
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex gap-2 items-center">
                      {p.image ? (
                        <img
                          src={`http://localhost:5000${p.image}`}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                          No image
                        </div>
                      )}
                      {p.images?.slice(0, 2).map((img, index) => (
                        <img
                          key={index}
                          src={`http://localhost:5000${img.url}`}
                          alt={`Phụ ${index + 1}`}
                          className="w-10 h-10 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <Link
                      to={`/products/edit/${p.id}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Sửa
                    </Link>
                    {user?.role === "admin" && (
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Xoá
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
