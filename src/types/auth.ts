export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isEnabled: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: number;
}