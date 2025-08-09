import axios from "axios";

// ✅ Thay đổi nếu deploy thật
export const BASE_API_URL = "http://localhost:5000/api";
export const BASE_IMAGE_URL = "http://localhost:5000";

// 🔧 Tạo instance mặc định
const API = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true, // cần thiết để gửi cookie nếu backend sử dụng
});

// 🛡️ Gắn token từ localStorage vào header Authorization
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
