'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tokenStore } from './tokenStore';
import { client } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin';
  themeMode?: 'light' | 'dark' | 'system';
  colorTheme?: string;
  customThemeColors?: Record<string, string>;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const initAuth = useCallback(() => {
    const user = tokenStore.getUser();
    const token = tokenStore.getAccessToken();
    setState({
      user,
      isLoading: false,
      isAuthenticated: !!token && !!user,
    });
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await client.post('/auth/login', { email, password });
      
      const { accessToken, user } = response.data.data;
      
      tokenStore.setAccessToken(accessToken);
      tokenStore.setUser(user);
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await client.post('/auth/register', { 
        firstName, 
        lastName, 
        email, 
        password 
      });
      
      const { accessToken, user } = response.data.data;
      
      tokenStore.setAccessToken(accessToken);
      tokenStore.setUser(user);
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    tokenStore.clearAll();
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const refreshUser = async () => {
    try {
      const response = await client.get('/users/me');
      const user = response.data;
      tokenStore.setUser(user);
      setState(prev => ({ ...prev, user }));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
