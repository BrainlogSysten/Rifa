import api from './api';
import { Raffle, CreateRaffleDto, UpdateRaffleDto } from '@/types/raffle';
import { Prize } from '@/types/prize';

class RaffleService {
  async getAll(): Promise<Raffle[]> {
    const response = await api.get<Raffle[]>('/raffle/list');
    return response.data;
  }

  async getById(id: string): Promise<Raffle> {
    const response = await api.get<Raffle>(`/raffle/${id}`);
    return response.data;
  }

  async create(data: CreateRaffleDto): Promise<Raffle> {
    const response = await api.post<Raffle>('/raffle/create', data);
    return response.data;
  }

  async update(id: string, data: UpdateRaffleDto): Promise<Raffle> {
    const response = await api.put<Raffle>(`/raffle/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/raffle/${id}`);
  }

  async getPrizes(raffleId: string): Promise<Prize[]> {
    const response = await api.get<Prize[]>(`/raffle/${raffleId}/prizes`);
    return response.data;
  }

  async addPrize(raffleId: string, prize: Partial<Prize>): Promise<Prize> {
    const response = await api.post<Prize>(`/raffle/${raffleId}/prizes`, prize);
    return response.data;
  }

  async updatePrize(raffleId: string, prizeId: string, prize: Partial<Prize>): Promise<Prize> {
    const response = await api.put<Prize>(`/raffle/${raffleId}/prizes/${prizeId}`, prize);
    return response.data;
  }

  async deletePrize(raffleId: string, prizeId: string): Promise<void> {
    await api.delete(`/raffle/${raffleId}/prizes/${prizeId}`);
  }
}

export default new RaffleService();