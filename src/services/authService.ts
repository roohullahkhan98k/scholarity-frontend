import api from '@/lib/api';
import { SignupData, LoginData, AuthResponse, User, RoleName } from '@/types';

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

    // Get current user profile (Phase 0.3)
    async getProfile(): Promise<User> {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Logout
    async logout() {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    },

    // Save auth data to localStorage
    saveAuth(data: any) {
        const token = data.token || data.access_token;
        if (token) {
            localStorage.setItem('token', token);
        }

        if (data.user) {
            // Normalize user before saving
            const normalizedUser = { ...data.user };
            if (typeof normalizedUser.role === 'string') {
                normalizedUser.role = { name: normalizedUser.role.toUpperCase() };
            } else if (normalizedUser.role && typeof normalizedUser.role.name === 'string') {
                normalizedUser.role.name = normalizedUser.role.name.toUpperCase();
            }
            localStorage.setItem('user', JSON.stringify(normalizedUser));
        }
    },

    // Get current user from localStorage
    getCurrentUser(): User | null {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            const user = JSON.parse(userStr);
            // Robust normalization
            if (typeof user.role === 'string') {
                user.role = { name: user.role.toUpperCase() };
            } else if (user.role && typeof user.role.name === 'string') {
                user.role.name = user.role.name.toUpperCase();
            }
            return user as User;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        const token = localStorage.getItem('token');
        return !!token && token !== 'undefined' && token !== 'null';
    },

    // Check if user has specific role
    hasRole(roleName: RoleName): boolean {
        const user = this.getCurrentUser();
        const currentRole = user?.role?.name?.toUpperCase();
        return currentRole === roleName.toUpperCase();
    },
};
