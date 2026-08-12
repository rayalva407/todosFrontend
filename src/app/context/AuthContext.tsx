import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api/client';

interface AuthContextType {
    user: string | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const data = await apiFetch<{ username: string }>('/users/me');
            setUser(data.username);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        const data = await apiFetch<{ username: string }>('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        setUser(data.username);
    };

    const register = async (username: string, password: string) => {
        const data = await apiFetch<{ username: string }>('/users', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        setUser(data.username);
    };

    const logout = async () => {
        try {
            await apiFetch('/logout', { method: 'POST' });
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};