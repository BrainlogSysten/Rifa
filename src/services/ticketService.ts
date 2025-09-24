import { api } from './api';

export interface Ticket {
  id: string;
  promotionId: string;
  promotionTitle: string;
  ticketNumber: string;
  purchaseDate: string;
  price: number;
  status: 'active' | 'winner' | 'expired';
  drawDate: string;
  prizeWon?: {
    name: string;
    value: number;
    position: number;
  };
}

export interface TicketPurchaseRequest {
  promotionId: string;
  quantity: number;
  selectedNumbers?: string[];
}

export interface TicketStats {
  totalTickets: number;
  activeTickets: number;
  wonTickets: number;
  totalSpent: number;
  totalWon: number;
  winRate: number;
}

const ticketService = {
  async getMyTickets(page: number = 1, limit: number = 10, status?: string) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      if (status) params.append('status', status);

      const response = await api.get(`/tickets/my?${params}`);
      return response.data;
    } catch (error) {
      return { tickets: [], total: 0 };
    }
  },

  async purchaseTickets(data: TicketPurchaseRequest): Promise<Ticket[]> {
    const response = await api.post('/tickets/purchase', data);
    return response.data;
  },

  async getTicketById(id: string): Promise<Ticket | null> {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async getTicketStats(): Promise<TicketStats> {
    try {
      const response = await api.get('/tickets/stats');
      return response.data;
    } catch (error) {
      return {
        totalTickets: 0,
        activeTickets: 0,
        wonTickets: 0,
        totalSpent: 0,
        totalWon: 0,
        winRate: 0
      };
    }
  },

  async getAvailableNumbers(promotionId: string): Promise<string[]> {
    try {
      const response = await api.get(`/tickets/available-numbers/${promotionId}`);
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async validateTicket(ticketNumber: string): Promise<boolean> {
    try {
      const response = await api.get(`/tickets/validate/${ticketNumber}`);
      return response.data.isValid;
    } catch (error) {
      return false;
    }
  },

  async getTicketHistory(limit: number = 50) {
    try {
      const response = await api.get(`/tickets/history?limit=${limit}`);
      return response.data;
    } catch (error) {
      return [];
    }
  }
};

export default ticketService;