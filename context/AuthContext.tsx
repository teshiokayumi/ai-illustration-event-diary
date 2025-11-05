
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User | null>;
  register: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    setUser(user);
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<User | null> => {
    const loggedInUser = await apiLogin(email, pass);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (email: string, pass: string): Promise<User | null> => {
    const newUser = await apiRegister(email, pass);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
