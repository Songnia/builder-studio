import { api } from './api';
import type { LoginData, RegisterData, AuthResponse } from '../types/auth';

export const authService = {
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/login', data);
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/register', data);
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    updateCurrentUser(userData: any) {
        const currentUser = this.getCurrentUser() || {};
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('userUpdated'));
        return updatedUser;
    },

    isAuthenticated() {
        return !!localStorage.getItem('auth_token');
    }
};
