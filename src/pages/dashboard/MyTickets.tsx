import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket,
  Search,
  Filter,
  Calendar,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  DollarSign,
  TrendingUp,
  Hash,
  Gift,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

interface TicketData {
  id: string;
  raffleId: string;
  raffleTitle: string;
  raffleImage?: string;
  numbers: number[];
  purchaseDate: string;
  purchasePrice: number;
  status: 'active' | 'drawn' | 'won' | 'expired' | 'cancelled';
  drawDate: string;
  prizeValue?: number;
  prizeDescription?: string;
  transactionId: string;
  paymentMethod: string;
}

const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Fetch tickets from API
  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      // This would be the actual API call
      // const response = await api.get('/tickets/my-tickets');

      // Mock data for now
      const mockTickets: TicketData[] = [
        {
          id: '1',
          raffleId: 'raffle-1',
          raffleTitle: 'iPhone 15 Pro Max 256GB',
          raffleImage: '/images/placeholders/electronics1.jpg',
          numbers: [42, 157, 289, 501, 723],
          purchaseDate: '2024-01-15T10:30:00',
          purchasePrice: 50,
          status: 'active',
          drawDate: '2024-02-15',
          prizeValue: 8000,
          prizeDescription: 'iPhone 15 Pro Max 256GB Titânio Natural',
          transactionId: 'TRX123456789',
          paymentMethod: 'PIX'
        },
        {
          id: '2',
          raffleId: 'raffle-2',
          raffleTitle: 'MacBook Pro M3',
          raffleImage: '/images/placeholders/electronics1.jpg',
          numbers: [88, 234, 445],
          purchaseDate: '2024-01-10T14:20:00',
          purchasePrice: 75,
          status: 'won',
          drawDate: '2024-01-12',
          prizeValue: 15000,
          prizeDescription: 'MacBook Pro M3 14" 512GB',
          transactionId: 'TRX987654321',
          paymentMethod: 'Cartão de Crédito'
        },
        {
          id: '3',
          raffleId: 'raffle-3',
          raffleTitle: 'PlayStation 5',
          raffleImage: '/images/placeholders/gaming1.jpg',
          numbers: [10, 55],
          purchaseDate: '2023-12-20T09:15:00',
          purchasePrice: 20,
          status: 'drawn',
          drawDate: '2023-12-31',
          prizeValue: 4500,
          prizeDescription: 'PlayStation 5 + 2 Controles',
          transactionId: 'TRX456789123',
          paymentMethod: 'PIX'
        }
      ];

      setTickets(mockTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: TicketData['status']) => {
    const statusConfig = {
      active: { color: 'bg-blue-500', icon: <Clock className="w-3 h-3" />, text: 'Ativo' },
      drawn: { color: 'bg-gray-500', icon: <CheckCircle className="w-3 h-3" />, text: 'Sorteado' },
      won: { color: 'bg-green-500', icon: <Trophy className="w-3 h-3" />, text: 'Ganhador!' },
      expired: { color: 'bg-orange-500', icon: <XCircle className="w-3 h-3" />, text: 'Expirado' },
      cancelled: { color: 'bg-red-500', icon: <XCircle className="w-3 h-3" />, text: 'Cancelado' }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter !== 'all' && ticket.status !== filter) return false;
    if (searchTerm && !ticket.raffleTitle.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
      case 'oldest':
        return new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
      case 'price_high':
        return b.purchasePrice - a.purchasePrice;
      case 'price_low':
        return a.purchasePrice - b.purchasePrice;
      default:
        return 0;
    }
  });

  // Calculate statistics
  const stats = {
    total: tickets.length,
    active: tickets.filter(t => t.status === 'active').length,
    won: tickets.filter(t => t.status === 'won').length,
    totalSpent: tickets.reduce((acc, t) => acc + t.purchasePrice, 0),
    totalWon: tickets.filter(t => t.status === 'won').reduce((acc, t) => acc + (t.prizeValue || 0), 0)
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
          <h1 className="text-3xl font-bold text-white">Meus Bilhetes</h1>
          <p className="text-gray-400 mt-1">Acompanhe todos os seus bilhetes e sorteios</p>
        </div>
        <Link to="/raffles" className="btn-primary">
          <Ticket className="w-5 h-5" />
          Comprar Mais Bilhetes
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Ticket className="w-5 h-5 text-blue-400" />
            <p className="text-gray-400 text-sm">Total</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <p className="text-gray-400 text-sm">Ativos</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.active}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-sm">Ganhos</p>
          </div>
          <p className="text-2xl font-bold text-green-400">{stats.won}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-red-400" />
            <p className="text-gray-400 text-sm">Investido</p>
          </div>
          <p className="text-xl font-bold text-white">R$ {stats.totalSpent.toLocaleString('pt-BR')}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-sm">Prêmios</p>
          </div>
          <p className="text-xl font-bold text-green-400">R$ {stats.totalWon.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* Won Alert */}
      {stats.won > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30"
        >
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-green-400" />
            <div className="flex-1">
              <p className="text-white font-semibold">Parabéns! Você tem {stats.won} bilhete(s) premiado(s)!</p>
              <p className="text-gray-300 text-sm mt-1">Entre em contato para resgatar seus prêmios.</p>
            </div>
            <button className="btn-primary">Resgatar Prêmios</button>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por sorteio..."
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
            <option value="all">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="drawn">Sorteados</option>
            <option value="won">Ganhos</option>
            <option value="expired">Expirados</option>
            <option value="cancelled">Cancelados</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-modern"
          >
            <option value="recent">Mais Recentes</option>
            <option value="oldest">Mais Antigos</option>
            <option value="price_high">Maior Valor</option>
            <option value="price_low">Menor Valor</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {sortedTickets.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum bilhete encontrado</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || filter !== 'all'
                ? 'Tente ajustar os filtros ou termo de busca'
                : 'Você ainda não comprou nenhum bilhete'}
            </p>
            {!searchTerm && filter === 'all' && (
              <Link to="/raffles" className="btn-primary">
                <Ticket className="w-5 h-5" />
                Explorar Sorteios
              </Link>
            )}
          </div>
        ) : (
          sortedTickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Image */}
                <div className="lg:w-48 h-48 lg:h-auto bg-gradient-to-br from-gray-700 to-gray-800 relative">
                  <img
                    src={ticket.raffleImage}
                    alt={ticket.raffleTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 left-2">
                    {getStatusBadge(ticket.status)}
                  </div>
                  {ticket.status === 'won' && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <Trophy className="w-16 h-16 text-green-400 animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{ticket.raffleTitle}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Compra: {new Date(ticket.purchaseDate).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="w-4 h-4" />
                          Sorteio: {new Date(ticket.drawDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">R$ {ticket.purchasePrice}</p>
                      <p className="text-xs text-gray-400">{ticket.paymentMethod}</p>
                    </div>
                  </div>

                  {/* Numbers */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Seus Números:</p>
                    <div className="flex flex-wrap gap-2">
                      {ticket.numbers.map((number) => (
                        <div
                          key={number}
                          className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${
                            ticket.status === 'won'
                              ? 'bg-gradient-to-br from-green-500 to-green-600'
                              : 'bg-gradient-to-br from-primary-500 to-primary-600'
                          }`}
                        >
                          {number.toString().padStart(4, '0')}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prize Info (if won) */}
                  {ticket.status === 'won' && (
                    <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="w-5 h-5 text-green-400" />
                        <p className="font-semibold text-green-400">Prêmio Conquistado!</p>
                      </div>
                      <p className="text-white">{ticket.prizeDescription}</p>
                      <p className="text-2xl font-bold text-green-400 mt-2">
                        R$ {ticket.prizeValue?.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  )}

                  {/* Transaction Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-400">
                      <span className="flex items-center gap-1">
                        <Hash className="w-4 h-4" />
                        ID: {ticket.transactionId}
                      </span>
                      <span>{ticket.numbers.length} número(s)</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-secondary text-sm">
                        <Download className="w-4 h-4" />
                        Comprovante
                      </button>
                      <Link
                        to={`/raffle/${ticket.raffleId}`}
                        className="btn-secondary text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Sorteio
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyTickets;