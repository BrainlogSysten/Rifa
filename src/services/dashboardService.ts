import { api } from './api';

export interface DashboardMetrics {
  totalRevenue: number;
  revenueChange: number;
  ticketsSold: number;
  ticketsChange: number;
  activePromotions: number;
  promotionsChange: number;
  participants: number;
  participantsChange: number;
}

export interface SalesData {
  labels: string[];
  values: number[];
}

export interface RecentActivity {
  id: string;
  type: 'purchase' | 'withdrawal' | 'promotion_created' | 'winner';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  status?: 'success' | 'pending' | 'failed';
}

export interface ComplianceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  action?: string;
  actionUrl?: string;
}

export interface TopPromotion {
  id: string;
  title: string;
  revenue: number;
  ticketsSold: number;
  progress: number;
  imageUrl: string;
}

const dashboardService = {
  async getMetrics(timeRange: string = '7d'): Promise<DashboardMetrics> {
    try {
      const response = await api.get(`/dashboard/metrics?range=${timeRange}`);
      return response.data;
    } catch (error) {
      // Return default values if API fails
      return {
        totalRevenue: 0,
        revenueChange: 0,
        ticketsSold: 0,
        ticketsChange: 0,
        activePromotions: 0,
        promotionsChange: 0,
        participants: 0,
        participantsChange: 0
      };
    }
  },

  async getSalesData(timeRange: string = '7d'): Promise<SalesData> {
    try {
      const response = await api.get(`/dashboard/sales?range=${timeRange}`);
      return response.data;
    } catch (error) {
      // Return empty data if API fails
      const days = timeRange === '30d' ? 30 : 7;
      const labels = [];
      const now = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
      }
      return {
        labels,
        values: new Array(days).fill(0)
      };
    }
  },

  async getRecentActivity(): Promise<RecentActivity[]> {
    try {
      const response = await api.get('/dashboard/activity');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async getComplianceAlerts(): Promise<ComplianceAlert[]> {
    try {
      const response = await api.get('/dashboard/compliance-alerts');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async getTopPromotions(): Promise<TopPromotion[]> {
    try {
      const response = await api.get('/dashboard/top-promotions');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async getConversionFunnel(timeRange: string = '7d') {
    try {
      const response = await api.get(`/dashboard/conversion-funnel?range=${timeRange}`);
      return response.data;
    } catch (error) {
      return {
        visits: 0,
        registrations: 0,
        purchases: 0,
        completions: 0
      };
    }
  },

  async getTicketDistribution() {
    try {
      const response = await api.get('/dashboard/ticket-distribution');
      return response.data;
    } catch (error) {
      return {
        labels: [],
        values: []
      };
    }
  }
};

export default dashboardService;