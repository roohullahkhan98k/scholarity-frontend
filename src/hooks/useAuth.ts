"use client";
import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { User } from '@/types';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(authService.isAuthenticated());
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const data = await authService.login({ email, password });
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
    };

    const signup = async (email: string, password: string, name: string) => {
        const data = await authService.signup({ email, password, name });
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    return {
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        hasRole: (role: string) => user?.role === role,
    };
}
