import axios from 'axios';

// En développement, Vite relaie /api vers Laravel (voir vite.config.ts).
// En production, VITE_API_URL est injectée explicitement pendant le build.
// Un chemin relatif évite d'embarquer accidentellement localhost dans un bundle.
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Accept': 'application/json'
    },
    withCredentials: true
});

// Intercepteur pour ajouter le token si nécessaire
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

import { toast } from 'sonner';

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 422) {
            console.error('Validation errors:', error.response.data);
            const errors = error.response.data.errors;
            const errorMessages = Object.values(errors).flat().join('\n');
            toast.error('Erreur de validation', { description: errorMessages });
        }
        return Promise.reject(error);
    }
);
