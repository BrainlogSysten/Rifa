import axios, { AxiosError, AxiosInstance } from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5044/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          toast.error('Sessão expirada. Por favor, faça login novamente.');
          break;
        case 403:
          toast.error('Você não tem permissão para realizar esta ação.');
          break;
        case 404:
          toast.error('Recurso não encontrado.');
          break;
        case 500:
          toast.error('Erro no servidor. Por favor, tente novamente mais tarde.');
          break;
        default:
          toast.error('Ocorreu um erro. Por favor, tente novamente.');
      }
    } else if (error.request) {
      toast.error('Sem resposta do servidor. Verifique sua conexão.');
    } else {
      toast.error('Erro ao processar requisição.');
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  isEnabled: boolean;
}

export interface Raffle {
  id: string;
  title: string;
  description: string;
  type: string;
  images: string[];
  startDate: string;
  endDate: string;
  terms: string;
  ticketPrice: number;
  maxTicketPerUser: number;
  maxParticipants: number;
  paymentMethod: string;
  status: 'Draft' | 'Active' | 'Finished' | 'Cancelled';
}

export interface Prize {
  id: string;
  title: string;
  description: string;
  value: number;
  imageUrl: string;
  quantity: number;
  type: string;
  raffleId: string;
}

export interface Ticket {
  id: string;
  value: number;
  userId: string;
  raffleId: string;
  isWinner: boolean;
  purchaseDate: string;
}

const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const authService = {
  login: async (email: string, password: string): Promise<any> => {
    const response = await api.post('/Auth/login', { email, password });
    const { token } = response.data;
    
    if (token) {
      localStorage.setItem('token', token);
      
      const decoded = decodeToken(token);
      if (decoded) {
        const user = {
          id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
          email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || email,
          name: email.split('@')[0],
          isAdmin: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin' || false,
          isEnabled: true
        };
        localStorage.setItem('user', JSON.stringify(user));
        
        try {
          const userDetails = await userService.getById(user.id);
          if (userDetails) {
              const fullUser = {
              ...userDetails,
              isAdmin: userDetails.isAdmin !== undefined ? userDetails.isAdmin : user.isAdmin
            };
            console.log('User details:', fullUser);
            localStorage.setItem('user', JSON.stringify(fullUser));
            return { token, user: fullUser };
          }
        } catch (error) {
        }
        
        return { token, user };
      }
    }
    
    return response.data;
  },
  
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    const { token } = response.data;
    if (token) {
      localStorage.setItem('token', token);
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },
  
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },
  
  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
  
  create: async (data: any): Promise<User> => {
    const response = await api.post<User>('/users', data);
    return response.data;
  },
  
  update: async (id: string, data: any): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  enableUser: async (id: string): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}/enable`);
    return response.data;
  },

  disableUser: async (id: string): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}/disable`);
    return response.data;
  },

  makeAdmin: async (id: string): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}/make-admin`);
    return response.data;
  },

  removeAdmin: async (id: string): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}/remove-admin`);
    return response.data;
  },

  search: async (searchTerm: string, filters?: { status?: string; role?: string }): Promise<User[]> => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.role) params.append('role', filters.role);
    
    const response = await api.get<User[]>(`/users/search?${params.toString()}`);
    return response.data;
  },

  changePassword: async (userId: string, passwordData: { currentPassword: string; newPassword: string }): Promise<void> => {
    await api.post(`/users/${userId}/change-password`, passwordData);
  }
};

export const raffleService = {
  getAll: async (filters?: any): Promise<Raffle[]> => {
    const response = await api.get<Raffle[]>('/Raffle/list', { params: filters });
    return response.data;
  },
  
  getById: async (id: string): Promise<Raffle> => {
    const response = await api.get<Raffle>(`/Raffle/${id}`);
    return response.data;
  },
  
  create: async (data: any): Promise<Raffle> => {
    const response = await api.post<Raffle>('/Raffle/create', data);
    return response.data;
  },
  
  update: async (id: string, data: any): Promise<Raffle> => {
    const response = await api.put<Raffle>(`/Raffle/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/Raffle/${id}`);
  },
  
  getTickets: async (raffleId: number): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>(`/Raffle/${raffleId}/tickets`);
    return response.data;
  },
  
  getPrizes: async (raffleId: string): Promise<Prize[]> => {
    const response = await api.get<Prize[]>(`/Raffle/${raffleId}/prizes`);
    return response.data;
  },
  
  addPrize: async (raffleId: string, prizeData: any): Promise<Prize> => {
    const response = await api.post<Prize>(`/Raffle/${raffleId}/prizes`, prizeData);
    return response.data;
  },
  
  updatePrize: async (raffleId: string, prizeId: string, data: any): Promise<Prize> => {
    const response = await api.put<Prize>(`/Raffle/${raffleId}/prizes/${prizeId}`, data);
    return response.data;
  },
  
  removePrize: async (raffleId: string, prizeId: string): Promise<void> => {
    await api.delete(`/Raffle/${raffleId}/prizes/${prizeId}`);
  }
};

export const prizeService = {
  getAll: async (): Promise<Prize[]> => {
    const response = await api.get<Prize[]>('/prizes');
    return response.data;
  },
  
  getById: async (id: string): Promise<Prize> => {
    const response = await api.get<Prize>(`/prizes/${id}`);
    return response.data;
  },
  
  create: async (data: any): Promise<Prize> => {
    const response = await api.post<Prize>('/prizes', data);
    return response.data;
  },
  
  update: async (id: string, data: any): Promise<Prize> => {
    const response = await api.put<Prize>(`/prizes/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/prizes/${id}`);
  }
};

export const ticketService = {
  getAll: async (): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>('/tickets');
    return response.data;
  },
  
  getById: async (id: string): Promise<Ticket> => {
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },
  
  purchase: async (data: any): Promise<Ticket> => {
    const response = await api.post<Ticket>('/tickets', data);
    return response.data;
  },
  
  update: async (id: string, data: any): Promise<Ticket> => {
    const response = await api.put<Ticket>(`/tickets/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tickets/${id}`);
  },
  
  getByRaffle: async (raffleId: string): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>('/tickets', { 
      params: { raffleId } 
    });
    return response.data;
  },
  
  getByUser: async (userId: string): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>('/tickets', { 
      params: { userId } 
    });
    return response.data;
  }
};

export const adminService = {
  getDashboardStats: async (): Promise<{
    totalUsers: number;
    totalRaffles: number;
    activeRaffles: number;
    totalRevenue: number;
    totalTickets: number;
  }> => {
    const response = await api.get('/admin/dashboard-stats');
    return response.data;
  },

  getRecentActivities: async (limit = 10): Promise<Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user?: string;
  }>> => {
    const response = await api.get(`/admin/recent-activities?limit=${limit}`);
    return response.data;
  },

  getSystemHealth: async (): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    checks: Array<{
      name: string;
      status: 'ok' | 'warning' | 'error';
      message: string;
    }>;
  }> => {
    const response = await api.get('/admin/system-health');
    return response.data;
  }
};

export default api;