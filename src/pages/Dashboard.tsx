import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  Ticket,
  Trophy,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Eye,
  Plus,
  Calendar,
  TrendingUp,
  Shield,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  AlertCircle,
  Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface TicketPurchase {
  id: string;
  raffleTitle: string;
  raffleId: string;
  ticketNumbers: number[];
  purchaseDate: string;
  amount: number;
  status: 'active' | 'drawn' | 'won' | 'lost';
}

interface Raffle {
  id: string;
  title: string;
  status: 'DRAFT' | 'PENDING_AUTHORIZATION' | 'AUTHORIZED' | 'ACTIVE' | 'CLOSED' | 'DRAWN';
  ticketsSold: number;
  totalTickets: number;
  revenue: number;
  drawDate: string;
  scpcAuthorization?: string;
  accountabilityStatus?: 'PENDING' | 'SUBMITTED' | 'APPROVED';
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'tickets' | 'raffles' | 'profile'>('overview');

  // Mock data - substituir por dados reais da API
  const isCNPJ = user?.documentType === 'CNPJ';
  const organizationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' = user?.legalComplianceStatus === 'APPROVED' ? 'APPROVED' :
                                                                   user?.legalComplianceStatus === 'REJECTED' ? 'REJECTED' :
                                                                   'PENDING';

  const ticketPurchases: TicketPurchase[] = [
    {
      id: '1',
      raffleTitle: 'iPhone 15 Pro Max',
      raffleId: 'r1',
      ticketNumbers: [1234, 1235, 1236],
      purchaseDate: '2024-01-10',
      amount: 30,
      status: 'active'
    },
    {
      id: '2',
      raffleTitle: 'Honda CG 160',
      raffleId: 'r2',
      ticketNumbers: [5678],
      purchaseDate: '2024-01-05',
      amount: 25,
      status: 'drawn'
    }
  ];

  const myRaffles: Raffle[] = [
    {
      id: '1',
      title: 'Sorteio Promocional - Notebook Dell',
      status: 'ACTIVE',
      ticketsSold: 450,
      totalTickets: 1000,
      revenue: 4500,
      drawDate: '2024-02-15',
      scpcAuthorization: 'SPA/2024/12345',
      accountabilityStatus: 'PENDING'
    },
    {
      id: '2',
      title: 'Sorteio Solidário - Vale Compras',
      status: 'PENDING_AUTHORIZATION',
      ticketsSold: 0,
      totalTickets: 500,
      revenue: 0,
      drawDate: '2024-03-01',
      scpcAuthorization: '',
      accountabilityStatus: 'PENDING'
    }
  ];

  const stats = {
    cpf: {
      totalTickets: 15,
      activeRaffles: 3,
      totalSpent: 250,
      prizesWon: 0
    },
    cnpj: {
      totalRaffles: 5,
      activeRaffles: 2,
      totalRevenue: 15750,
      pendingAccountability: 1
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'PENDING_AUTHORIZATION':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'APPROVED':
      case 'AUTHORIZED':
      case 'ACTIVE':
        return 'text-green-400 bg-green-400/10';
      case 'REJECTED':
      case 'CLOSED':
        return 'text-red-400 bg-red-400/10';
      case 'DRAWN':
        return 'text-blue-400 bg-blue-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-900 via-surface-800 to-surface-900 pt-20">
      {/* Header */}
      <div className="bg-surface-800/50 border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isCNPJ ? (
                <Building2 className="w-8 h-8 text-secondary-400" />
              ) : (
                <User className="w-8 h-8 text-primary-400" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Olá, {user?.name || 'Usuário'}
                </h1>
                <p className="text-gray-400">
                  {isCNPJ ? user?.companyName : `CPF: ${user?.documentNumber}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
              </button>
              <Link to="/settings" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Status Alert (CNPJ only) */}
      {isCNPJ && organizationStatus !== 'APPROVED' && (
        <div className="container mx-auto px-4 mt-6">
          {organizationStatus === 'PENDING' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-400 mb-1">
                    Cadastro em Análise
                  </p>
                  <p className="text-sm text-gray-300">
                    Seus documentos estão sendo analisados. Você receberá uma notificação em até 48 horas úteis.
                    Enquanto isso, você pode explorar a plataforma, mas não poderá criar sorteios promocionais.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {organizationStatus === 'REJECTED' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-400 mb-1">
                    Cadastro Rejeitado
                  </p>
                  <p className="text-sm text-gray-300 mb-3">
                    Seu cadastro foi rejeitado. Motivo: Empresa com fins lucrativos não pode criar sorteios promocionais.
                  </p>
                  <Link to="/support" className="text-sm text-primary-400 hover:text-primary-300">
                    Entre em contato com o suporte →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex gap-2 border-b border-white/10">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-4 py-3 border-b-2 transition-all ${
              selectedTab === 'overview'
                ? 'text-primary-400 border-primary-400'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Visão Geral
          </button>
          {!isCNPJ && (
            <button
              onClick={() => setSelectedTab('tickets')}
              className={`px-4 py-3 border-b-2 transition-all ${
                selectedTab === 'tickets'
                  ? 'text-primary-400 border-primary-400'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              Meus Bilhetes
            </button>
          )}
          {isCNPJ && organizationStatus === 'APPROVED' && (
            <button
              onClick={() => setSelectedTab('raffles')}
              className={`px-4 py-3 border-b-2 transition-all ${
                selectedTab === 'raffles'
                  ? 'text-primary-400 border-primary-400'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              Minhas Sorteios
            </button>
          )}
          <button
            onClick={() => setSelectedTab('profile')}
            className={`px-4 py-3 border-b-2 transition-all ${
              selectedTab === 'profile'
                ? 'text-primary-400 border-primary-400'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Perfil
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {!isCNPJ ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Ticket className="w-8 h-8 text-primary-400" />
                      <span className="text-2xl font-bold text-white">{stats.cpf.totalTickets}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Bilhetes Comprados</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <FileText className="w-8 h-8 text-secondary-400" />
                      <span className="text-2xl font-bold text-white">{stats.cpf.activeRaffles}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Sorteios Ativas</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <DollarSign className="w-8 h-8 text-green-400" />
                      <span className="text-2xl font-bold text-white">
                        R$ {stats.cpf.totalSpent}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">Total Investido</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Trophy className="w-8 h-8 text-yellow-400" />
                      <span className="text-2xl font-bold text-white">{stats.cpf.prizesWon}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Prêmios Ganhos</p>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <FileText className="w-8 h-8 text-primary-400" />
                      <span className="text-2xl font-bold text-white">{stats.cnpj.totalRaffles}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Total de Sorteios</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Clock className="w-8 h-8 text-secondary-400" />
                      <span className="text-2xl font-bold text-white">{stats.cnpj.activeRaffles}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Sorteios Ativas</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <DollarSign className="w-8 h-8 text-green-400" />
                      <span className="text-2xl font-bold text-white">
                        R$ {stats.cnpj.totalRevenue.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">Receita Total</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card p-6 border border-yellow-500/30"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <AlertTriangle className="w-8 h-8 text-yellow-400" />
                      <span className="text-2xl font-bold text-white">
                        {stats.cnpj.pendingAccountability}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">Prestações Pendentes</p>
                  </motion.div>
                </>
              )}
            </div>

            {/* Recent Activity / Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Atividade Recente</h3>
                <div className="space-y-3">
                  {!isCNPJ ? (
                    ticketPurchases.slice(0, 3).map((purchase) => (
                      <div key={purchase.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Ticket className="w-5 h-5 text-primary-400" />
                          <div>
                            <p className="text-white text-sm">{purchase.raffleTitle}</p>
                            <p className="text-xs text-gray-400">
                              {purchase.ticketNumbers.length} bilhete(s) - {new Date(purchase.purchaseDate).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">R$ {purchase.amount}</span>
                      </div>
                    ))
                  ) : (
                    myRaffles.slice(0, 3).map((raffle) => (
                      <div key={raffle.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-secondary-400" />
                          <div>
                            <p className="text-white text-sm">{raffle.title}</p>
                            <p className="text-xs text-gray-400">
                              {raffle.ticketsSold}/{raffle.totalTickets} vendidos
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(raffle.status)}`}>
                          {raffle.status === 'ACTIVE' && 'Ativa'}
                          {raffle.status === 'PENDING_AUTHORIZATION' && 'Aguardando'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Ações Rápidas</h3>
                <div className="space-y-3">
                  {!isCNPJ ? (
                    <>
                      <Link
                        to="/raffles"
                        className="flex items-center justify-between p-4 bg-primary-500/10 rounded-lg hover:bg-primary-500/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Search className="w-5 h-5 text-primary-400" />
                          <span className="text-white">Explorar Sorteios</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </Link>
                      <Link
                        to="/my-tickets"
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Ticket className="w-5 h-5 text-gray-400" />
                          <span className="text-white">Ver Meus Bilhetes</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </Link>
                    </>
                  ) : organizationStatus === 'APPROVED' ? (
                    <>
                      <Link
                        to="/create-raffle"
                        className="flex items-center justify-between p-4 bg-secondary-500/10 rounded-lg hover:bg-secondary-500/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Plus className="w-5 h-5 text-secondary-400" />
                          <span className="text-white">Criar Nova Sorteio</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </Link>
                      <Link
                        to="/accountability"
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <span className="text-white">Prestação de Contas</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </Link>
                      <Link
                        to="/scpc-authorization"
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-gray-400" />
                          <span className="text-white">Solicitar Autorização SCPC</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </Link>
                    </>
                  ) : (
                    <div className="p-4 bg-yellow-500/10 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-yellow-400 font-semibold mb-1">
                            Aguardando Aprovação
                          </p>
                          <p className="text-xs text-gray-300">
                            Você poderá criar sorteios promocionais após a aprovação do seu cadastro.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab (CPF only) */}
        {selectedTab === 'tickets' && !isCNPJ && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Meus Bilhetes</h2>
              <Link to="/raffles" className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Comprar Mais
              </Link>
            </div>

            <div className="grid gap-4">
              {ticketPurchases.map((purchase) => (
                <div key={purchase.id} className="card p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{purchase.raffleTitle}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span>Data: {new Date(purchase.purchaseDate).toLocaleDateString('pt-BR')}</span>
                        <span>Valor: R$ {purchase.amount}</span>
                        <span className={`px-2 py-1 rounded-full ${
                          purchase.status === 'active' ? 'bg-green-400/10 text-green-400' :
                          purchase.status === 'won' ? 'bg-yellow-400/10 text-yellow-400' :
                          'bg-gray-400/10 text-gray-400'
                        }`}>
                          {purchase.status === 'active' && 'Ativo'}
                          {purchase.status === 'drawn' && 'Sorteado'}
                          {purchase.status === 'won' && 'Ganhou!'}
                          {purchase.status === 'lost' && 'Não ganhou'}
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-400 mb-2">Números:</p>
                        <div className="flex flex-wrap gap-2">
                          {purchase.ticketNumbers.map((number) => (
                            <span key={number} className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-lg font-mono">
                              {String(number).padStart(6, '0')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/raffle/${purchase.raffleId}`}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Sorteio
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raffles Tab (CNPJ only) */}
        {selectedTab === 'raffles' && isCNPJ && organizationStatus === 'APPROVED' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Minhas Sorteios</h2>
              <Link to="/create-raffle" className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Criar Sorteio
              </Link>
            </div>

            <div className="grid gap-4">
              {myRaffles.map((raffle) => (
                <div key={raffle.id} className="card p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{raffle.title}</h3>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-400">Status</p>
                          <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(raffle.status)}`}>
                            {raffle.status === 'ACTIVE' && 'Ativa'}
                            {raffle.status === 'PENDING_AUTHORIZATION' && 'Aguardando Autorização'}
                            {raffle.status === 'CLOSED' && 'Encerrada'}
                            {raffle.status === 'DRAWN' && 'Sorteada'}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Vendidos</p>
                          <p className="text-white">{raffle.ticketsSold}/{raffle.totalTickets}</p>
                          <div className="w-full bg-white/10 rounded-full h-1 mt-1">
                            <div
                              className="bg-primary-500 h-1 rounded-full"
                              style={{ width: `${(raffle.ticketsSold / raffle.totalTickets) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Receita</p>
                          <p className="text-white">R$ {raffle.revenue.toLocaleString('pt-BR')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Sorteio</p>
                          <p className="text-white">{new Date(raffle.drawDate).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      {raffle.scpcAuthorization && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <Shield className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">Autorização: {raffle.scpcAuthorization}</span>
                        </div>
                      )}
                      {raffle.accountabilityStatus === 'PENDING' && raffle.status === 'DRAWN' && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400">Prestação de contas pendente (prazo: 180 dias)</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/raffle/${raffle.id}/manage`}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Gerenciar
                      </Link>
                      {raffle.status === 'DRAWN' && raffle.accountabilityStatus === 'PENDING' && (
                        <Link
                          to={`/raffle/${raffle.id}/accountability`}
                          className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Prestar Contas
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {selectedTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Informações Pessoais</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Nome</p>
                  <p className="text-white">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">E-mail</p>
                  <p className="text-white">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Documento</p>
                  <p className="text-white">{user?.documentType}: {user?.documentNumber}</p>
                </div>
                {isCNPJ && (
                  <>
                    <div>
                      <p className="text-sm text-gray-400">Razão Social</p>
                      <p className="text-white">{user?.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status da Organização</p>
                      <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(organizationStatus)}`}>
                        {organizationStatus === 'PENDING' && 'Em Análise'}
                        {organizationStatus === 'APPROVED' && 'Aprovada'}
                        {organizationStatus === 'REJECTED' && 'Rejeitada'}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-6 flex gap-4">
                <Link to="/settings" className="btn-primary">
                  Editar Perfil
                </Link>
                <Link to="/settings/password" className="btn-secondary">
                  Alterar Senha
                </Link>
              </div>
            </div>

            {isCNPJ && (
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Documentos</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Estatuto Social', status: 'approved' },
                    { name: 'Ata de Eleição', status: 'approved' },
                    { name: 'Cartão CNPJ', status: 'approved' },
                    { name: 'Comprovante de Endereço', status: 'approved' },
                  ].map((doc) => (
                    <div key={doc.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-white">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.status === 'approved' && <CheckCircle className="w-4 h-4 text-green-400" />}
                        <button className="text-sm text-primary-400 hover:text-primary-300">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;