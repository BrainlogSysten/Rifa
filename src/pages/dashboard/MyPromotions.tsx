import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Pause,
  Play,
  Trash2,
  Download,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreVertical,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Shield,
  Copy,
  Share2,
  BarChart3,
  Ticket
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import promotionService from '../../services/promotionService';
import { api } from '../../services/api';

const MyPromotions: React.FC = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPromotions();
    loadStats();
  }, [filter, page]);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const statusFilter = filter === 'all' ? undefined : filter;
      const response = await promotionService.getMyPromotions(page, 10, statusFilter);

      // Se a API retornar dados no formato esperado
      if (response.promotions) {
        setPromotions(response.promotions);
        setTotalPages(Math.ceil(response.total / 10));
      } else {
        // Fallback para dados da API de raffles
        const rafflesResponse = await api.get('/raffles');
        const raffles = rafflesResponse.data.raffles || [];

        // Mapear raffles para formato de promotions
        const mappedPromotions = raffles.map((raffle: any) => ({
          id: raffle.id,
          title: raffle.title,
          description: raffle.description,
          status: raffle.status === 4 ? 'active' : 'draft',
          scpcStatus: raffle.scpcAuthorizationNumber ? 'approved' : 'not_submitted',
          ticketsSold: raffle.ticketsSold || 0,
          totalTickets: raffle.numberOfTickets || 1000,
          revenue: (raffle.ticketsSold || 0) * (raffle.ticketPrice || 0),
          ticketPrice: raffle.ticketPrice || 0,
          drawDate: raffle.drawDate || raffle.endDate,
          createdAt: raffle.createdAt,
          coverImage: raffle.coverImageUrl || raffle.imageBanner,
          scpcProtocol: raffle.scpcAuthorizationNumber,
          category: 'general'
        }));

        setPromotions(mappedPromotions);
      }
    } catch (error) {
      console.error('Erro ao carregar promoções:', error);
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const stats = await promotionService.getPromotionStats();
      setStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este sorteio?')) {
      try {
        await promotionService.deletePromotion(id);
        await loadPromotions();
      } catch (error) {
        console.error('Erro ao excluir promoção:', error);
        alert('Erro ao excluir promoção');
      }
    }
  };

  const handlePause = async (id: string) => {
    try {
      await promotionService.pausePromotion(id);
      await loadPromotions();
    } catch (error) {
      console.error('Erro ao pausar promoção:', error);
    }
  };

  const handleResume = async (id: string) => {
    try {
      await promotionService.resumePromotion(id);
      await loadPromotions();
    } catch (error) {
      console.error('Erro ao retomar promoção:', error);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const newPromotion = await promotionService.duplicatePromotion(id);
      navigate(`/dashboard/edit-promotion/${newPromotion.id}`);
    } catch (error) {
      console.error('Erro ao duplicar promoção:', error);
    }
  };

  const handleExport = async (id: string, format: 'csv' | 'pdf') => {
    try {
      const blob = await promotionService.exportPromotionData(id, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `promotion-${id}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'pending_approval': return 'text-yellow-400 bg-yellow-400/10';
      case 'draft': return 'text-gray-400 bg-gray-400/10';
      case 'paused': return 'text-orange-400 bg-orange-400/10';
      case 'completed': return 'text-blue-400 bg-blue-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending_approval': return 'Aguardando Aprovação';
      case 'draft': return 'Rascunho';
      case 'paused': return 'Pausado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getSCPCStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredPromotions = promotions.filter(promo =>
    promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Meus Sorteios Promocionais</h1>
          <p className="text-gray-400 mt-1">Gerencie seus sorteios e acompanhe o desempenho</p>
        </div>
        <Link to="/dashboard/create-promotion" className="btn-primary">
          <Plus className="w-5 h-5" />
          Criar Novo Sorteio
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total de Sorteios</p>
                <p className="text-2xl font-bold text-white">{stats.totalPromotions || 0}</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Receita Total</p>
                <p className="text-2xl font-bold text-white">
                  R$ {(stats.totalRevenue || 0).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Participantes</p>
                <p className="text-2xl font-bold text-white">{stats.totalParticipants || 0}</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-white">
                  {(stats.conversionRate || 0).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar sorteios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-modern pl-10 w-full"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-modern"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="draft">Rascunhos</option>
            <option value="pending_approval">Aguardando Aprovação</option>
            <option value="paused">Pausados</option>
            <option value="completed">Concluídos</option>
          </select>
        </div>
      </div>

      {/* Promotions Grid */}
      {filteredPromotions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPromotions.map((promo) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden"
            >
              {/* Cover Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary-500/20 to-purple-500/20">
                {promo.coverImage && (
                  <img
                    src={promo.coverImage}
                    alt={promo.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(promo.status)}`}>
                    {getStatusLabel(promo.status)}
                  </span>
                </div>
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {getSCPCStatusIcon(promo.scpcStatus)}
                  <span className="text-xs text-white/80">
                    {promo.scpcProtocol || 'Sem protocolo'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{promo.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{promo.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progresso</span>
                    <span className="text-white">
                      {promo.ticketsSold}/{promo.totalTickets} bilhetes
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full transition-all"
                      style={{ width: `${(promo.ticketsSold / promo.totalTickets) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-xs">Receita</p>
                    <p className="text-white font-semibold">
                      R$ {promo.revenue.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Sorteio</p>
                    <p className="text-white font-semibold">
                      {new Date(promo.drawDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/dashboard/promotion/${promo.id}`}
                    className="btn-secondary flex-1 justify-center"
                  >
                    <Eye className="w-4 h-4" />
                    Visualizar
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === promo.id ? null : promo.id)}
                      className="btn-secondary px-3"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {showActionMenu === promo.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 card p-2 z-10">
                        <button
                          onClick={() => navigate(`/dashboard/edit-promotion/${promo.id}`)}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-left"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </button>
                        {promo.status === 'active' ? (
                          <button
                            onClick={() => handlePause(promo.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-left"
                          >
                            <Pause className="w-4 h-4" />
                            Pausar
                          </button>
                        ) : promo.status === 'paused' && (
                          <button
                            onClick={() => handleResume(promo.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-left"
                          >
                            <Play className="w-4 h-4" />
                            Retomar
                          </button>
                        )}
                        <button
                          onClick={() => handleDuplicate(promo.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-left"
                        >
                          <Copy className="w-4 h-4" />
                          Duplicar
                        </button>
                        <button
                          onClick={() => handleExport(promo.id, 'csv')}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-left"
                        >
                          <Download className="w-4 h-4" />
                          Exportar CSV
                        </button>
                        <button
                          onClick={() => handleExport(promo.id, 'pdf')}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-left"
                        >
                          <FileText className="w-4 h-4" />
                          Exportar PDF
                        </button>
                        {promo.status === 'draft' && (
                          <button
                            onClick={() => handleDelete(promo.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-left text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full mb-4">
            <Ticket className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum sorteio encontrado</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm
              ? 'Nenhum sorteio corresponde à sua busca.'
              : 'Crie seu primeiro sorteio promocional e comece a vender bilhetes.'}
          </p>
          {!searchTerm && (
            <Link to="/dashboard/create-promotion" className="btn-primary inline-flex">
              <Plus className="w-5 h-5" />
              Criar Primeiro Sorteio
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="flex items-center px-4 text-white">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPromotions;