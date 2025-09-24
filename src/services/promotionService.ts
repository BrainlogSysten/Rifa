import { api } from './api';

export interface Promotion {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  drawDate: string;
  ticketPrice: number;
  numberOfTickets: number;
  ticketsSold: number;
  status: 'draft' | 'active' | 'ended' | 'drawn';
  scpcStatus: 'pending' | 'approved' | 'rejected' | 'expired';
  scpcAuthorizationNumber?: string;
  imageUrl?: string;
  prizes: Prize[];
  revenue: number;
  participants: number;
  createdAt: string;
  updatedAt: string;
}

export interface Prize {
  id: string;
  name: string;
  description: string;
  value: number;
  position: number;
  imageUrl?: string;
}

export interface CreatePromotionRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  drawDate: string;
  ticketPrice: number;
  numberOfTickets: number;
  prizes: Omit<Prize, 'id'>[];
  terms: string;
  regulation: string;
  fundraisingPurpose: string;
}

export interface PromotionStats {
  totalPromotions: number;
  activePromotions: number;
  totalRevenue: number;
  totalParticipants: number;
  averageTicketPrice: number;
  conversionRate: number;
}

const promotionService = {
  async getMyPromotions(page: number = 1, limit: number = 10, status?: string) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      if (status) params.append('status', status);

      const response = await api.get(`/promotions/my?${params}`);
      return response.data;
    } catch (error) {
      return { promotions: [], total: 0 };
    }
  },

  async getPromotionById(id: string): Promise<Promotion | null> {
    try {
      const response = await api.get(`/promotions/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async createPromotion(data: CreatePromotionRequest): Promise<Promotion> {
    const response = await api.post('/promotions', data);
    return response.data;
  },

  async updatePromotion(id: string, data: Partial<CreatePromotionRequest>): Promise<Promotion> {
    const response = await api.put(`/promotions/${id}`, data);
    return response.data;
  },

  async deletePromotion(id: string): Promise<void> {
    await api.delete(`/promotions/${id}`);
  },

  async duplicatePromotion(id: string): Promise<Promotion> {
    const response = await api.post(`/promotions/${id}/duplicate`);
    return response.data;
  },

  async pausePromotion(id: string): Promise<void> {
    await api.post(`/promotions/${id}/pause`);
  },

  async resumePromotion(id: string): Promise<void> {
    await api.post(`/promotions/${id}/resume`);
  },

  async getPromotionStats(): Promise<PromotionStats> {
    try {
      const response = await api.get('/promotions/stats');
      return response.data;
    } catch (error) {
      return {
        totalPromotions: 0,
        activePromotions: 0,
        totalRevenue: 0,
        totalParticipants: 0,
        averageTicketPrice: 0,
        conversionRate: 0
      };
    }
  },

  async getPromotionParticipants(id: string, page: number = 1, limit: number = 50) {
    try {
      const response = await api.get(`/promotions/${id}/participants?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return { participants: [], total: 0 };
    }
  },

  async exportPromotionData(id: string, format: 'csv' | 'pdf' = 'csv') {
    const response = await api.get(`/promotions/${id}/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  async submitForSCPCApproval(id: string, documents: FormData): Promise<void> {
    await api.post(`/promotions/${id}/submit-scpc`, documents, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  async getPromotionAnalytics(id: string) {
    try {
      const response = await api.get(`/promotions/${id}/analytics`);
      return response.data;
    } catch (error) {
      return null;
    }
  }
};

export default promotionService;