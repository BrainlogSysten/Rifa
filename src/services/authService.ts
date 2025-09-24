import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

// INTERFACE DESABILITADA - Lei 5.768/71: Apenas empresas (CNPJ) podem criar sorteios promocionais
// @deprecated Uso de CPF para sorteios promocionais é proibido pela Lei 5.768/71
export interface RegisterCPFRequest {
  name: string;
  cpf: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  birthDate: string;
  postalCode: string;
  address: string;
  city: string;
  state: string;
}

export interface RegisterCNPJRequest {
  companyName: string;
  tradeName: string;
  cnpj: string;
  responsibleName: string;
  responsibleCPF: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  whatsapp?: string;
  postalCode: string;
  address: string;
  city: string;
  state: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  documentType: 'CNPJ'; // Exclusivamente CNPJ conforme Lei 5.768/71
  documentNumber: string;
  documentVerificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  canCreateRaffles: boolean;
  isAdmin: boolean;
  companyName?: string;
  tradeName?: string;
  phone?: string;
  isNonProfit?: boolean;
  legalComplianceStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    const { token } = response.data;

    // Decodificar token para obter informações do usuário
    const user = this.decodeToken(token);

    // Salvar no localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { token, user };
  }

  // MÉTODO DESABILITADO - Lei 5.768/71: Apenas empresas (CNPJ) podem criar sorteios promocionais
  // @deprecated Registro de CPF para sorteios promocionais é proibido pela Lei 5.768/71
  async registerCPF(data: RegisterCPFRequest): Promise<string> {
    throw new Error('Registro de CPF para sorteios promocionais é proibido pela Lei 5.768/71. Use apenas CNPJ.');
  }

  async registerCNPJ(data: RegisterCNPJRequest): Promise<string> {
    const response = await api.post('/auth/register/cnpj', data);
    return response.data;
  }

  async getVerificationStatus(userId: string): Promise<any> {
    const response = await api.get(`/auth/verify-status/${userId}`);
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.decodeToken(token);
      const exp = payload.exp * 1000; // Converter para milliseconds
      return Date.now() < exp;
    } catch {
      return false;
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      throw new Error('Token inválido');
    }
  }
}

export default new AuthService();