'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User } from '@/lib/api';
import { getProfile, login as apiLogin, register as apiRegister } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { userName: string; firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (t: string) => {
    try {
      const res = await getProfile();
      if (res.data.success && res.data.data) setUser(res.data.data);
    } catch {
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (stored) {
      setToken(stored);
      loadUser(stored).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [loadUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiLogin({ email, password });
      const t = res.data.accessToken;
      if (!t) throw new Error('Login failed');
      localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
      await loadUser(t);
    },
    [loadUser]
  );

  const register = useCallback(
    async (data: { userName: string; firstName: string; lastName: string; email: string; password: string }) => {
      const res = await apiRegister(data);
      const t = res.data.accessToken;
      if (!t) throw new Error('Registration failed');
      localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
      await loadUser(t);
    },
    [loadUser]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (token) await loadUser(token);
  }, [token, loadUser]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
