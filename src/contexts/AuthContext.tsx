import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, LoginRequest, RegisterCPFRequest, RegisterCNPJRequest } from '../services/authService';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  registerCPF: (data: RegisterCPFRequest) => Promise<string>;
  registerCNPJ: (data: RegisterCNPJRequest) => Promise<string>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado ao carregar
    const loadUser = () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await authService.login(data);
      setUser(response.user);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const registerCPF = async (data: RegisterCPFRequest): Promise<string> => {
    try {
      const userId = await authService.registerCPF(data);
      return userId;
    } catch (error) {
      console.error('Erro no registro CPF:', error);
      throw error;
    }
  };

  const registerCNPJ = async (data: RegisterCNPJRequest): Promise<string> => {
    try {
      const userId = await authService.registerCNPJ(data);
      return userId;
    } catch (error) {
      console.error('Erro no registro CNPJ:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        registerCPF,
        registerCNPJ,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;