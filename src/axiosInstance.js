import axios from "axios";

// ✅ Lấy URL từ biến môi trường (CRA yêu cầu prefix REACT_APP_)
export const BASE_API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";
export const BASE_IMAGE_URL =
  process.env.REACT_APP_IMAGE_URL || "http://localhost:5000";

// 🔧 Tạo instance mặc định
const API = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true, // cần nếu backend dùng cookie
});

// 🛡️ Gắn token từ localStorage vào header Authorization
API.interceptors.request.use(
  (config) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (error) {
      console.error("Error parsing user token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
