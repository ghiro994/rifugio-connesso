import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, getToken, setToken } from '@/lib/api';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    try {
      const data = await api.get<{ user: AuthUser; isAdmin: boolean }>('/api/auth/me');
      setUser(data.user);
      setIsAdmin(data.isAdmin);
    } catch {
      setToken(null);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.post<{
        token: string;
        user: AuthUser;
        isAdmin: boolean;
      }>('/api/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      setIsAdmin(data.isAdmin);
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Login fallito') };
    }
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
