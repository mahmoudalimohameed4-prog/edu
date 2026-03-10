import axios from "axios";

// In production (Vercel), VITE_API_URL should be set to the backend URL
// In development, falls back to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";


const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include JWT token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth Services
export const login = (data) => api.post("/auth/login", data);
export const signup = (data) => api.post("/auth/signup", data);
export const googleLogin = (idToken) => api.post("/auth/google-login", { idToken });

// Ad Services
export const getAllAds = () => api.get("/ad");
export const getAdById = (id) => api.get(`/ad/${id}`);
export const createAd = (data) => api.post("/ad", data);
export const updateAd = (id, data) => api.put(`/ad/${id}`, data);
export const deleteAd = (id) => api.delete(`/ad/${id}`);

// Item Services
export const createItem = (formData) => api.post("/item", formData, {
    headers: { "Content-Type": "multipart/form-data" }
});
export const getMyItems = () => api.get("/item/my-items");
export const getLatestItems = () => api.get("/item/latest");
export const getItemById = (id) => api.get(`/item/${id}`);
export const updateItem = (id, data) => api.put(`/item/${id}`, data);
export const deleteItem = (id) => api.delete(`/item/${id}`);

// Category Services
export const getAllCategories = () => api.get("/category");

// Chat Services
export const getConversations = () => api.get("/chat/conversations");
export const getMessages = (otherId) => api.get(`/chat/messages/${otherId}`);
export const sendChat = (receiverId, text) => api.post("/chat", { receiverId, text });

// User Profile
export const getProfile = () => api.get("/user/profile");
export const updateProfile = (data) => api.put("/user/profile", data);
export const updateProfilePicture = (formData) => api.patch("/user/profile-picture", formData, {
    headers: { "Content-Type": "multipart/form-data" }
});

// OTP Services
export const sendOTP = (email) => api.post("/otp/send-otp", { email });
export const verifyOTP = (email, code, checkOnly = false) => api.post("/otp/verify-otp", { email, code, checkOnly });




// Notification Services
export const getNotifications = () => api.get("/notification");
export const markNotificationAsRead = (id) => api.patch(`/notification/${id}/read`);
export const markAllNotificationsAsRead = () => api.patch("/notification/read-all");
export const deleteNotification = (id) => api.delete(`/notification/${id}`);

// Dashboard Stats
export const getDashboardStats = () => api.get("/user/dashboard-stats");

export const changePassword = (data) => api.post("/user/change-password", data);
export const resetPassword = (data) => api.post("/user/reset-password", data);

export default api;
