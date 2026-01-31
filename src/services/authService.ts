import api from '@/lib/api';
import { SignupData, LoginData, AuthResponse } from '@/types';

export const authService = {
    // Sign up new user
    async signup(data: SignupData): Promise<AuthResponse> {
        const response = await api.post('/auth/signup', data);
        this.saveAuth(response.data);
        return response.data;
    },

    // Login existing user
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post('/auth/login', data);
        this.saveAuth(response.data);
        return response.data;
    },

    // Get current user profile
    async getProfile() {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Logout
    async logout() {
        try {
            // Call logout API endpoint
            await api.post('/auth/logout');
        } catch (error) {
            // Continue with logout even if API call fails
            console.error('Logout API error:', error);
        } finally {
            // Always clear local storage
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    },

    // Save auth data to localStorage
    saveAuth(data: AuthResponse) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
    },

    // Get current user from localStorage
    getCurrentUser() {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('access_token');
    },

    // Check if user has specific role
    hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        return user?.role === role;
    },
};
