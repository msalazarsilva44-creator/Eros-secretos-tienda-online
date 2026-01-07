import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { fetchApi, setToken, removeToken, getToken } from '@/lib/api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar token al montar el componente
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = getToken();
        if (token) {
          const response = await fetchApi<{ user: User }>('/api/auth/verify', {
            method: 'GET',
          });
          setUser(response.user);
        }
      } catch (error) {
        // Token inválido, limpiar
        removeToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await fetchApi<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      setToken(response.token);
      setUser(response.user);
      
      toast.success('Bienvenido de nuevo');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await fetchApi<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      setToken(response.token);
      setUser(response.user);
      
      toast.success('Cuenta creada exitosamente');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrar';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    toast.success('Sesión cerrada');
  }, []);

  const updateUser = useCallback((newUser: User) => {
    setUser(newUser);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
