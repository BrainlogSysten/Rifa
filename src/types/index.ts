
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  isEnabled: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface Raffle {
  id: number;
  title: string;
  description: string;
  prizeTitle: string;
  prizeDescription: string;
  coverImageUrl?: string;
  imageBanner?: string;
  imageUrl?: string;
  images?: string[];
  ticketPrice: number;
  numberOfTickets: number;
  startDate: string;
  endDate: string;
  status: RaffleStatus;
  creatorId?: string;
  soldTickets?: number;
  terms?: string;
  maxTicketPerUser?: number;
  maxParticipants?: number;
  paymentMethod?: string;
  isEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export enum RaffleStatus {
  Draft = 0,
  Active = 1,
  Finished = 2,
  Cancelled = 3
}

export interface CreateRaffleRequest {
  title: string;
  description: string;
  prizeTitle: string;
  prizeDescription: string;
  coverImageUrl: string;
  imageBanner: string;
  images: string[];
  ticketPrice: number;
  numberOfTickets: number;
  startDate: string;
  endDate: string;
  status: number;
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
  raffleTitle?: string;
  raffleImage?: string;
  raffleStatus?: RaffleStatus;
}

export interface PurchaseTicketRequest {
  raffleId: string;
  ticketNumber?: number;
  quantity?: number;
  userId: string;
}

export interface DashboardStatistics {
  totalRevenue: number;
  totalSold: number;
  activeRaffles: number;
  totalParticipants: number;
}

export interface AdminStatistics {
  totalUsers: number;
  totalRaffles: number;
  activeRaffles: number;
  totalRevenue: number;
  totalTickets: number;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface RaffleFormData {
  title: string;
  description: string;
  prizeTitle: string;
  prizeDescription: string;
  imageUrl: string;
  ticketPrice: string;
  numberOfTickets: string;
  startDate: string;
  endDate: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RaffleFilters {
  status?: RaffleStatus;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  creatorId?: string;
  startDate?: string;
  endDate?: string;
}

export interface UserFilters {
  status?: 'active' | 'inactive';
  role?: 'admin' | 'user';
  searchTerm?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  checks: HealthCheck[];
}

export interface HealthCheck {
  name: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export default {
  RaffleStatus
};