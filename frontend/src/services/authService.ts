import { api } from './api';
import type { LoginData, RegisterData, AuthResponse, User } from '../types/auth';

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
        const token = localStorage.getItem('auth_token');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');

        if (token) {
            void api.post('/logout', {}, {
                headers: { Authorization: `Bearer ${token}` },
            }).catch(() => {
                // The local session is already cleared; server expiry remains a fallback.
            });
        }
    },

    getCurrentUser(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) as User : null;
    },

    updateCurrentUser(userData: Partial<User>) {
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
