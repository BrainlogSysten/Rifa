import apiClient from '../../../services/apiClient';
import { Raffle, Ticket } from '../../../types';

export const publicRaffleService = {
  getByUniqueLink: async (uniqueLink: string): Promise<Raffle> => {
    const response = await apiClient.get<Raffle>(`/public/raffle/${uniqueLink}`);
    return response.data;
  },

  getAvailableTickets: async (uniqueLink: string): Promise<number[]> => {
    const response = await apiClient.get<number[]>(`/public/raffle/${uniqueLink}/available-tickets`);
    return response.data;
  },

  purchaseTickets: async (uniqueLink: string, ticketNumbers: number[], customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    cpf?: string;
  }): Promise<any> => {
    const response = await apiClient.post(`/public/raffle/${uniqueLink}/purchase`, {
      ticketNumbers,
      customerInfo
    });
    return response.data;
  },

  getTicketInfo: async (uniqueLink: string, ticketNumber: number): Promise<Ticket | null> => {
    const response = await apiClient.get<Ticket>(`/public/raffle/${uniqueLink}/ticket/${ticketNumber}`);
    return response.data;
  }
};

export default publicRaffleService;