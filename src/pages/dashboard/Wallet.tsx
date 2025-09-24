import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet as WalletIcon,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Send,
  Plus,
  CreditCard,
  Smartphone,
  FileText,
  Filter,
  Calendar,
  Search,
  Info
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'withdrawal' | 'commission';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
  method?: string;
  raffleId?: string;
  raffleTitle?: string;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  accountNumber: string;
  agency: string;
  holderName: string;
  document: string;
  isDefault: boolean;
}

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState(4567.89);
  const [pendingBalance, setPendingBalance] = useState(1234.50);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);

      // Mock data - replace with API calls
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'credit',
          description: 'Venda de bilhetes - iPhone 15 Pro Max',
          amount: 750,
          date: '2024-01-15T10:30:00',
          status: 'completed',
          reference: 'TRX123456',
          raffleId: '1',
          raffleTitle: 'iPhone 15 Pro Max'
        },
        {
          id: '2',
          type: 'withdrawal',
          description: 'Saque para conta bancária',
          amount: 2000,
          date: '2024-01-14T15:00:00',
          status: 'completed',
          reference: 'WD789012',
          method: 'PIX'
        },
        {
          id: '3',
          type: 'credit',
          description: 'Venda de bilhetes - MacBook Pro M3',
          amount: 1500,
          date: '2024-01-13T09:45:00',
          status: 'pending',
          reference: 'TRX456789',
          raffleId: '2',
          raffleTitle: 'MacBook Pro M3'
        },
        {
          id: '4',
          type: 'commission',
          description: 'Taxa de serviço Sort.IO (2.5%)',
          amount: 37.50,
          date: '2024-01-13T09:45:00',
          status: 'completed',
          reference: 'FEE456789'
        },
        {
          id: '5',
          type: 'credit',
          description: 'Venda de bilhetes - PlayStation 5',
          amount: 500,
          date: '2024-01-12T14:20:00',
          status: 'completed',
          reference: 'TRX789456',
          raffleId: '3',
          raffleTitle: 'PlayStation 5'
        }
      ];

      const mockBankAccounts: BankAccount[] = [
        {
          id: '1',
          bankName: 'Banco do Brasil',
          accountType: 'checking',
          accountNumber: '12345-6',
          agency: '1234-5',
          holderName: 'Empresa Exemplo LTDA',
          document: '12.345.678/0001-90',
          isDefault: true
        },
        {
          id: '2',
          bankName: 'Itaú',
          accountType: 'checking',
          accountNumber: '54321-0',
          agency: '4321',
          holderName: 'Empresa Exemplo LTDA',
          document: '12.345.678/0001-90',
          isDefault: false
        }
      ];

      setTransactions(mockTransactions);
      setBankAccounts(mockBankAccounts);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'credit':
        return <ArrowDownRight className="w-4 h-4 text-green-400" />;
      case 'debit':
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case 'commission':
        return <DollarSign className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Digite um valor válido');
      return;
    }
    if (parseFloat(withdrawAmount) > balance) {
      alert('Saldo insuficiente');
      return;
    }
    if (!selectedAccount) {
      alert('Selecione uma conta bancária');
      return;
    }

    // Process withdrawal
    console.log('Processing withdrawal:', { amount: withdrawAmount, account: selectedAccount });
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter !== 'all' && t.type !== filter) return false;
    if (searchTerm && !t.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Calculate statistics
  const stats = {
    totalIncome: transactions
      .filter(t => t.type === 'credit' && t.status === 'completed')
      .reduce((acc, t) => acc + t.amount, 0),
    totalWithdrawn: transactions
      .filter(t => t.type === 'withdrawal' && t.status === 'completed')
      .reduce((acc, t) => acc + t.amount, 0),
    totalFees: transactions
      .filter(t => t.type === 'commission' && t.status === 'completed')
      .reduce((acc, t) => acc + t.amount, 0),
    pendingTransactions: transactions.filter(t => t.status === 'pending').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Carteira Digital</h1>
          <p className="text-gray-400 mt-1">Gerencie seus fundos e transações</p>
        </div>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="btn-primary"
        >
          <Send className="w-5 h-5" />
          Sacar Fundos
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <WalletIcon className="w-6 h-6 text-green-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Saldo Disponível</p>
          <p className="text-3xl font-bold text-white">
            R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-green-400 mt-2">+12.5% este mês</p>
        </motion.div>

        {/* Pending Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <Info className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Saldo Pendente</p>
          <p className="text-3xl font-bold text-white">
            R$ {pendingBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400 mt-2">Liberação em até 2 dias úteis</p>
        </motion.div>

        {/* Total Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Saldo Total</p>
          <p className="text-3xl font-bold text-white">
            R$ {(balance + pendingBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-blue-400 mt-2">Incluindo pendente</p>
        </motion.div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownRight className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-sm">Receitas</p>
          </div>
          <p className="text-xl font-bold text-white">
            R$ {stats.totalIncome.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="w-5 h-5 text-red-400" />
            <p className="text-gray-400 text-sm">Saques</p>
          </div>
          <p className="text-xl font-bold text-white">
            R$ {stats.totalWithdrawn.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            <p className="text-gray-400 text-sm">Taxas</p>
          </div>
          <p className="text-xl font-bold text-white">
            R$ {stats.totalFees.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-400" />
            <p className="text-gray-400 text-sm">Pendentes</p>
          </div>
          <p className="text-xl font-bold text-white">{stats.pendingTransactions}</p>
        </div>
      </div>

      {/* Bank Accounts */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Contas Bancárias</h2>
          <button className="btn-secondary text-sm">
            <Plus className="w-4 h-4" />
            Adicionar Conta
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {bankAccounts.map((account) => (
            <div
              key={account.id}
              className={`p-4 rounded-lg border ${
                account.isDefault
                  ? 'border-primary-500/30 bg-primary-500/5'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <p className="font-semibold text-white">{account.bankName}</p>
                </div>
                {account.isDefault && (
                  <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs">
                    Padrão
                  </span>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-gray-400">
                  Agência: <span className="text-white">{account.agency}</span>
                </p>
                <p className="text-gray-400">
                  Conta: <span className="text-white">{account.accountNumber}</span>
                </p>
                <p className="text-gray-400">
                  Titular: <span className="text-white">{account.holderName}</span>
                </p>
                <p className="text-gray-400">
                  CNPJ: <span className="text-white">{account.document}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Transações Recentes</h2>
          <button className="btn-secondary text-sm">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar transação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern w-full pl-10"
              />
            </div>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-modern"
          >
            <option value="all">Todas</option>
            <option value="credit">Receitas</option>
            <option value="withdrawal">Saques</option>
            <option value="commission">Taxas</option>
          </select>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <p className="text-white font-medium">{transaction.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-400">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(transaction.date).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {transaction.reference && (
                      <span className="text-xs text-gray-500">#{transaction.reference}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p
                  className={`font-bold ${
                    transaction.type === 'credit'
                      ? 'text-green-400'
                      : transaction.type === 'commission'
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}
                >
                  {transaction.type === 'credit' ? '+' : '-'} R${' '}
                  {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                {getStatusIcon(transaction.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-800 rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Sacar Fundos</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Valor do Saque</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="0,00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="input-modern w-full pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Disponível: R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Conta Bancária</label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="input-modern w-full"
                >
                  <option value="">Selecione uma conta</option>
                  {bankAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.bankName} - {account.accountNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-yellow-400 font-semibold mb-1">Informações Importantes</p>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Taxa de saque: R$ 3,90 + 1% do valor</li>
                      <li>• Processamento em até 2 dias úteis</li>
                      <li>• Mínimo: R$ 50,00 | Máximo: R$ 10.000,00</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleWithdraw}
                className="btn-primary flex-1"
              >
                <Send className="w-5 h-5" />
                Confirmar Saque
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Wallet;