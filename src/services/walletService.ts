import { api } from './api';

export interface WalletBalance {
  available: number;
  pending: number;
  withdrawn: number;
  total: number;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'withdrawal' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

export interface WithdrawalRequest {
  amount: number;
  method: 'pix' | 'bank_transfer';
  pixKey?: string;
  bankAccount?: {
    bank: string;
    agency: string;
    account: string;
    accountType: 'checking' | 'savings';
  };
}

export interface BankAccount {
  id: string;
  bank: string;
  agency: string;
  account: string;
  accountType: 'checking' | 'savings';
  holderName: string;
  isDefault: boolean;
}

const walletService = {
  async getBalance(): Promise<WalletBalance> {
    try {
      const response = await api.get('/wallet/balance');
      return response.data;
    } catch (error) {
      return {
        available: 0,
        pending: 0,
        withdrawn: 0,
        total: 0
      };
    }
  },

  async getTransactions(page: number = 1, limit: number = 20, type?: string) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      if (type) params.append('type', type);

      const response = await api.get(`/wallet/transactions?${params}`);
      return response.data;
    } catch (error) {
      return { transactions: [], total: 0 };
    }
  },

  async requestWithdrawal(data: WithdrawalRequest): Promise<void> {
    await api.post('/wallet/withdraw', data);
  },

  async getBankAccounts(): Promise<BankAccount[]> {
    try {
      const response = await api.get('/wallet/bank-accounts');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async addBankAccount(account: Omit<BankAccount, 'id'>): Promise<BankAccount> {
    const response = await api.post('/wallet/bank-accounts', account);
    return response.data;
  },

  async updateBankAccount(id: string, account: Partial<BankAccount>): Promise<BankAccount> {
    const response = await api.put(`/wallet/bank-accounts/${id}`, account);
    return response.data;
  },

  async deleteBankAccount(id: string): Promise<void> {
    await api.delete(`/wallet/bank-accounts/${id}`);
  },

  async getWithdrawalHistory(page: number = 1, limit: number = 10) {
    try {
      const response = await api.get(`/wallet/withdrawals?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return { withdrawals: [], total: 0 };
    }
  },

  async getTransactionDetails(id: string): Promise<Transaction | null> {
    try {
      const response = await api.get(`/wallet/transactions/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async exportTransactions(startDate: string, endDate: string, format: 'csv' | 'pdf' = 'csv') {
    const response = await api.get('/wallet/export', {
      params: { startDate, endDate, format },
      responseType: 'blob'
    });
    return response.data;
  }
};

export default walletService;