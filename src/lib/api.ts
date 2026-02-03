import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        } else if (error.response?.status === 403) {
            // Forbidden - likely inactive teacher
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.role?.name === 'TEACHER' && user.isActive === false) {
                    if (typeof window !== 'undefined') {
                        window.location.href = '/become-instructor/pending';
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
