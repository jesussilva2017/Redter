import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('redter_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const fetchMe = async () => {
    try {
      const response = await axios.get('/api/v1/auth/me');
      setUser(response.data.user);
    } catch (err) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password = 'redter123') => {
    const response = await axios.post('/api/v1/auth/login', { email, password });
    const newToken = response.data.token;
    const userData = response.data.user;

    localStorage.setItem('redter_token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('redter_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
