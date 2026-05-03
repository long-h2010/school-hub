import React, { createContext, useContext, useEffect, useState } from 'react';
import AxiosClient, { setAccessToken } from '../api/axios-client';

interface AuthContextType {
  user: any | null;
  setUser: (user: any) => void;
  token: string | null;
  error: string;
  isAuthenticated: boolean;
  loading: boolean;
  login: (loginEnpoint: string, data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getMe = async () => {
    const res = await AxiosClient.get('/auth/me');
    return res.data;
  };

  useEffect(() => {
    if (window.location.pathname === '/login') {
      setLoading(false);
      return;
    }

    const tryRefresh = async () => {
      try {
        const res = await AxiosClient.post(
          import.meta.env.VITE_APP_REFRESH_TOKEN_ENDPOINT,
        );
        const token = res.data.accessToken;
        setAccessToken(token);
        setToken(token);

        const user = await getMe();
        setUser(user);
      } catch {
        setAccessToken(null);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []);

  const login = async (loginEnpoint: string, data: any) => {
    await AxiosClient.post(loginEnpoint, data)
      .then((res) => {
        const data = res.data;
        setAccessToken(data.token);
        setToken(data.token);
        setUser(data.user);
        window.location.href = '/';
      })
      .catch((error) => setError(error.response.data.message));
  };

  const logout = async () => {
    await AxiosClient.post('/auth/logout');
    setAccessToken(null);
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    setUser,
    error,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
