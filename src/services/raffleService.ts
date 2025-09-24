import api from './api';

export interface Prize {
  id?: string;
  position: number;
  title: string;
  description: string;
  value: number;
  imageUrl?: string;
}

export interface Organization {
  id: string;
  name: string;
  companyName: string;
  tradeName?: string;
  cnpj: string;
  isNonProfit: boolean;
  legalComplianceStatus: string;
  description?: string;
  logo?: string;
}

export interface Raffle {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  category: string;
  status: 'DRAFT' | 'PENDING_AUTHORIZATION' | 'AUTHORIZED' | 'ACTIVE' | 'CLOSED' | 'DRAWN' | 'CANCELLED';
  ticketPrice: number;
  prizeValue: number;
  totalTickets: number;
  soldTickets: number;
  availableTickets: number;
  minTickets: number;
  maxTicketsPerUser: number;
  startDate: string;
  endDate: string;
  drawDate: string;
  coverImageUrl?: string;
  images?: string[];
  uniqueLink: string;

  // Organização
  organizerId: string;
  organizer?: Organization;
  organizationName?: string;

  // Compliance Legal
  scpcAuthorizationNumber?: string;
  authorizationDate?: string;
  regulation?: string;
  fundraisingPurpose?: string;
  drawLocation?: string;
  drawLiveStreamUrl?: string;
  accountabilityStatus?: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

  // Prêmios e Ganhador
  prizes: Prize[];
  winnerId?: string;
  winnerTicketNumber?: string;
  winner?: {
    name: string;
    ticketNumber: string;
    city: string;
    state: string;
  };

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface CreateRaffleRequest {
  title: string;
  description: string;
  fullDescription?: string;
  category: string;
  ticketPrice: number;
  prizeValue: number;
  totalTickets: number;
  minTickets?: number;
  maxTicketsPerUser?: number;
  startDate: string;
  endDate: string;
  drawDate: string;
  drawLocation: string;
  fundraisingPurpose: string;
  regulation?: string;
  prizes: Omit<Prize, 'id'>[];
  coverImage?: File;
}

export interface RaffleFilters {
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  organizationId?: string;
  sortBy?: 'date' | 'price' | 'popularity' | 'ending';
  page?: number;
  pageSize?: number;
}

export interface PurchaseTicketsRequest {
  raffleId: string;
  quantity: number;
  selectedNumbers?: number[];
  paymentMethod: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD';
}

export interface Ticket {
  id: string;
  raffleId: string;
  userId: string;
  ticketNumber: number;
  purchaseDate: string;
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED';
  paymentMethod?: string;
  isWinner: boolean;
}

class RaffleService {
  // Buscar todas as rifas com filtros
  async getAllRaffles(filters?: RaffleFilters): Promise<{ raffles: Raffle[]; total: number }> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get('/raffles', { params });
    return response.data;
  }

  // Buscar rifa por ID
  async getRaffleById(id: string): Promise<Raffle> {
    const response = await api.get(`/raffles/${id}`);
    return response.data;
  }

  // Buscar rifa por link único
  async getRaffleByLink(uniqueLink: string): Promise<Raffle> {
    const response = await api.get(`/raffles/link/${uniqueLink}`);
    return response.data;
  }

  // Buscar rifas ativas
  async getActiveRaffles(): Promise<Raffle[]> {
    const response = await api.get('/raffles/active');
    return response.data;
  }

  // Buscar rifas em destaque
  async getFeaturedRaffles(): Promise<Raffle[]> {
    const response = await api.get('/raffles/featured');
    return response.data;
  }

  // Buscar rifas terminando em breve
  async getEndingSoonRaffles(): Promise<Raffle[]> {
    const response = await api.get('/raffles/ending-soon');
    return response.data;
  }

  // Buscar rifas por categoria
  async getRafflesByCategory(category: string): Promise<Raffle[]> {
    const response = await api.get(`/raffles/category/${category}`);
    return response.data;
  }

  // Buscar rifas de uma organização
  async getRafflesByOrganization(organizationId: string): Promise<Raffle[]> {
    const response = await api.get(`/raffles/organization/${organizationId}`);
    return response.data;
  }

  // Buscar minhas rifas (organizador)
  async getMyRaffles(): Promise<Raffle[]> {
    const response = await api.get('/raffles/my-raffles');
    return response.data;
  }

  // Criar nova rifa (apenas organizações autorizadas)
  async createRaffle(data: CreateRaffleRequest): Promise<Raffle> {
    const formData = new FormData();

    // Adicionar dados básicos
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'prizes') {
        formData.append(key, JSON.stringify(value));
      } else if (key !== 'coverImage' && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    // Adicionar imagem se houver
    if (data.coverImage) {
      formData.append('coverImage', data.coverImage);
    }

    const response = await api.post('/raffles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Atualizar rifa
  async updateRaffle(id: string, data: Partial<CreateRaffleRequest>): Promise<Raffle> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'prizes') {
        formData.append(key, JSON.stringify(value));
      } else if (key !== 'coverImage' && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (data.coverImage) {
      formData.append('coverImage', data.coverImage);
    }

    const response = await api.put(`/raffles/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Deletar rifa (apenas rascunhos)
  async deleteRaffle(id: string): Promise<void> {
    await api.delete(`/raffles/${id}`);
  }

  // Cancelar rifa (admin ou organizador)
  async cancelRaffle(id: string, reason: string): Promise<void> {
    await api.post(`/raffles/${id}/cancel`, { reason });
  }

  // Comprar bilhetes
  async purchaseTickets(data: PurchaseTicketsRequest): Promise<{
    success: boolean;
    tickets: Ticket[];
    paymentUrl?: string;
  }> {
    const response = await api.post('/raffles/purchase', data);
    return response.data;
  }

  // Buscar meus bilhetes
  async getMyTickets(raffleId?: string): Promise<Ticket[]> {
    const url = raffleId ? `/raffles/my-tickets?raffleId=${raffleId}` : '/raffles/my-tickets';
    const response = await api.get(url);
    return response.data;
  }

  // Buscar números disponíveis
  async getAvailableNumbers(raffleId: string): Promise<number[]> {
    const response = await api.get(`/raffles/${raffleId}/available-numbers`);
    return response.data;
  }

  // Buscar estatísticas da rifa
  async getRaffleStats(id: string): Promise<{
    totalSold: number;
    totalRevenue: number;
    participantsCount: number;
    salesByDay: Array<{ date: string; count: number; revenue: number }>;
  }> {
    const response = await api.get(`/raffles/${id}/stats`);
    return response.data;
  }

  // Buscar ganhadores
  async getWinners(limit?: number): Promise<Array<{
    raffleId: string;
    raffleTitle: string;
    winnerName: string;
    winnerCity: string;
    winnerState: string;
    ticketNumber: string;
    prize: string;
    prizeValue: number;
    drawDate: string;
    organizationName: string;
  }>> {
    const response = await api.get(`/raffles/winners${limit ? `?limit=${limit}` : ''}`);
    return response.data;
  }

  // Realizar sorteio (admin ou organizador após autorização)
  async performDraw(raffleId: string): Promise<{
    winner: any;
    winnerTicketNumber: number;
  }> {
    const response = await api.post(`/raffles/${raffleId}/draw`);
    return response.data;
  }

  // Buscar categorias disponíveis
  async getCategories(): Promise<Array<{
    id: string;
    name: string;
    icon?: string;
    count: number;
  }>> {
    const response = await api.get('/raffles/categories');
    return response.data;
  }

  // Solicitar autorização SCPC (organizador)
  async requestAuthorization(raffleId: string, documents: {
    regulation: File;
    accountability: File;
  }): Promise<void> {
    const formData = new FormData();
    formData.append('regulation', documents.regulation);
    formData.append('accountability', documents.accountability);

    await api.post(`/raffles/${raffleId}/request-authorization`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Submeter prestação de contas (organizador)
  async submitAccountability(raffleId: string, data: {
    totalRevenue: number;
    totalExpenses: number;
    beneficiaryName: string;
    beneficiaryDocument: string;
    expenseDescription: string;
    proofDocuments: File[];
  }): Promise<void> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'proofDocuments') {
        (value as File[]).forEach((file, index) => {
          formData.append(`proofDocuments[${index}]`, file);
        });
      } else {
        formData.append(key, value.toString());
      }
    });

    await api.post(`/raffles/${raffleId}/accountability`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default new RaffleService();