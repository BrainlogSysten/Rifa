import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Building2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  Shield,
  TrendingUp,
  Calendar,
  DollarSign,
  BarChart3,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Organization {
  id: string;
  companyName: string;
  tradeName: string;
  cnpj: string;
  documentType: 'CNPJ';
  legalNature: string;
  isNonProfit: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  submittedAt: string;
  documents: {
    socialStatute: string;
    electionMinutes: string;
    cnpjCard: string;
    addressProof: string;
  };
  legalRepresentative: {
    name: string;
    cpf: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

interface Stats {
  totalOrganizations: number;
  pendingApprovals: number;
  approvedToday: number;
  rejectedToday: number;
  activeRaffles: number;
  totalRevenue: number;
}

const AdminDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'organizations' | 'raffles' | 'reports'>('overview');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - substituir por API real
  const stats: Stats = {
    totalOrganizations: 157,
    pendingApprovals: 12,
    approvedToday: 3,
    rejectedToday: 1,
    activeRaffles: 45,
    totalRevenue: 125000
  };

  useEffect(() => {
    // Carregar organizações da API
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    // Mock data - substituir por chamada real da API
    const mockOrgs: Organization[] = [
      {
        id: '1',
        companyName: 'Associação Beneficente ABC',
        tradeName: 'ABC Solidária',
        cnpj: '12.345.678/0001-90',
        documentType: 'CNPJ',
        legalNature: 'Associação Privada',
        isNonProfit: true,
        status: 'PENDING',
        submittedAt: '2024-01-15T10:30:00',
        documents: {
          socialStatute: '/docs/statute-1.pdf',
          electionMinutes: '/docs/minutes-1.pdf',
          cnpjCard: '/docs/cnpj-1.pdf',
          addressProof: '/docs/address-1.pdf'
        },
        legalRepresentative: {
          name: 'Maria Silva',
          cpf: '123.456.789-00',
          email: 'maria@abc.org.br',
          phone: '(11) 98765-4321'
        },
        address: {
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          postalCode: '01234-567'
        }
      },
      {
        id: '2',
        companyName: 'Instituto Esperança',
        tradeName: 'Esperança Brasil',
        cnpj: '98.765.432/0001-10',
        documentType: 'CNPJ',
        legalNature: 'Instituto',
        isNonProfit: true,
        status: 'PENDING',
        submittedAt: '2024-01-14T14:20:00',
        documents: {
          socialStatute: '/docs/statute-2.pdf',
          electionMinutes: '/docs/minutes-2.pdf',
          cnpjCard: '/docs/cnpj-2.pdf',
          addressProof: '/docs/address-2.pdf'
        },
        legalRepresentative: {
          name: 'João Santos',
          cpf: '987.654.321-00',
          email: 'joao@esperanca.org.br',
          phone: '(21) 91234-5678'
        },
        address: {
          street: 'Av. Principal',
          number: '500',
          complement: 'Sala 10',
          neighborhood: 'Jardim',
          city: 'Rio de Janeiro',
          state: 'RJ',
          postalCode: '20000-000'
        }
      }
    ];

    setOrganizations(mockOrgs);
  };

  const handleApprove = async (orgId: string) => {
    // Implementar aprovação
    console.log('Aprovar organização:', orgId);
    // Atualizar status no backend
    // Enviar notificação por email
    // Recarregar lista
  };

  const handleReject = async (orgId: string, reason: string) => {
    // Implementar rejeição
    console.log('Rejeitar organização:', orgId, 'Motivo:', reason);
    // Atualizar status no backend
    // Enviar notificação por email com motivo
    // Recarregar lista
  };

  const filteredOrgs = organizations.filter(org => {
    const matchesStatus = filterStatus === 'ALL' || org.status === filterStatus;
    const matchesSearch = org.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          org.cnpj.includes(searchTerm) ||
                          org.tradeName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'APPROVED':
        return 'text-green-400 bg-green-400/10';
      case 'REJECTED':
        return 'text-red-400 bg-red-400/10';
      case 'SUSPENDED':
        return 'text-orange-400 bg-orange-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />;
      case 'SUSPENDED':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-900 via-surface-800 to-surface-900 pt-20">
      {/* Admin Header */}
      <div className="bg-surface-800/50 border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary-400" />
                Painel Administrativo
              </h1>
              <p className="text-gray-400 mt-1">Gerencie organizações e sorteios promocionais</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Administrador: admin@sortio.com
              </span>
              <button className="btn-secondary">
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex gap-2 border-b border-white/10">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'organizations', label: 'Organizações', icon: Building2 },
            { id: 'raffles', label: 'Sorteios', icon: FileText },
            { id: 'reports', label: 'Relatórios', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-all ${
                selectedTab === tab.id
                  ? 'text-primary-400 border-primary-400'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Building2 className="w-8 h-8 text-primary-400" />
                  <span className="text-2xl font-bold text-white">{stats.totalOrganizations}</span>
                </div>
                <p className="text-gray-400 text-sm">Total de Organizações</p>
                <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12% este mês</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6 border border-yellow-500/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">{stats.pendingApprovals}</span>
                </div>
                <p className="text-gray-400 text-sm">Aprovações Pendentes</p>
                <Link to="#" className="mt-2 text-yellow-400 text-sm hover:text-yellow-300">
                  Ver todas →
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <FileText className="w-8 h-8 text-secondary-400" />
                  <span className="text-2xl font-bold text-white">{stats.activeRaffles}</span>
                </div>
                <p className="text-gray-400 text-sm">Sorteios Ativos</p>
                <div className="mt-2 flex items-center gap-4 text-xs">
                  <span className="text-green-400">✓ {stats.approvedToday} hoje</span>
                  <span className="text-red-400">✗ {stats.rejectedToday} hoje</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-green-400" />
                  <span className="text-2xl font-bold text-white">
                    R$ {stats.totalRevenue.toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">Receita Total</p>
                <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+25% este mês</span>
                </div>
              </motion.div>
            </div>

            {/* Recent Activities */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Atividades Recentes</h3>
              <div className="space-y-3">
                {[
                  { type: 'approval', org: 'Instituto Esperança', time: '2 horas atrás' },
                  { type: 'rejection', org: 'Empresa XYZ Ltda', time: '5 horas atrás', reason: 'Empresa com fins lucrativos' },
                  { type: 'pending', org: 'Associação ABC', time: '1 dia atrás' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      {activity.type === 'approval' && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {activity.type === 'rejection' && <XCircle className="w-5 h-5 text-red-400" />}
                      {activity.type === 'pending' && <Clock className="w-5 h-5 text-yellow-400" />}
                      <div>
                        <p className="text-white">{activity.org}</p>
                        {activity.reason && <p className="text-xs text-gray-400">{activity.reason}</p>}
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'organizations' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="card p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou CNPJ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-modern w-full pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        filterStatus === status
                          ? 'bg-primary-500 text-white'
                          : 'bg-white/10 text-gray-400 hover:bg-white/20'
                      }`}
                    >
                      {status === 'ALL' && 'Todas'}
                      {status === 'PENDING' && 'Pendentes'}
                      {status === 'APPROVED' && 'Aprovadas'}
                      {status === 'REJECTED' && 'Rejeitadas'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Organizations List */}
            <div className="space-y-4">
              {filteredOrgs.map((org) => (
                <motion.div
                  key={org.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <Building2 className="w-8 h-8 text-primary-400 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{org.companyName}</h3>
                          <p className="text-sm text-gray-400">{org.tradeName}</p>
                          <div className="mt-2 flex flex-wrap gap-3 text-sm">
                            <span className="text-gray-400">
                              CNPJ: <span className="text-white">{org.cnpj}</span>
                            </span>
                            <span className="text-gray-400">
                              Natureza: <span className="text-white">{org.legalNature}</span>
                            </span>
                            <span className={`px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(org.status)}`}>
                              {getStatusIcon(org.status)}
                              {org.status === 'PENDING' && 'Pendente'}
                              {org.status === 'APPROVED' && 'Aprovada'}
                              {org.status === 'REJECTED' && 'Rejeitada'}
                              {org.status === 'SUSPENDED' && 'Suspensa'}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center gap-4 text-sm">
                            <span className="text-gray-400">
                              Responsável: <span className="text-white">{org.legalRepresentative.name}</span>
                            </span>
                            <span className="text-gray-400">
                              Enviado: {new Date(org.submittedAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrg(org);
                          setShowDetailsModal(true);
                        }}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                      </button>
                      {org.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(org.id)}
                            className="btn-primary flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Aprovar
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Motivo da rejeição:');
                              if (reason) handleReject(org.id, reason);
                            }}
                            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Rejeitar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedOrg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto card p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Detalhes da Organização</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Organization Info */}
                <div className="p-6 bg-white/5 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Informações da Organização</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Razão Social</p>
                      <p className="text-white">{selectedOrg.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Nome Fantasia</p>
                      <p className="text-white">{selectedOrg.tradeName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">CNPJ</p>
                      <p className="text-white">{selectedOrg.cnpj}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Natureza Jurídica</p>
                      <p className="text-white">{selectedOrg.legalNature}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Sem Fins Lucrativos</p>
                      <p className="text-white">{selectedOrg.isNonProfit ? 'Sim' : 'Não'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <span className={`px-2 py-1 rounded-full inline-flex items-center gap-1 ${getStatusColor(selectedOrg.status)}`}>
                        {getStatusIcon(selectedOrg.status)}
                        {selectedOrg.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Legal Representative */}
                <div className="p-6 bg-white/5 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Representante Legal</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Nome</p>
                      <p className="text-white">{selectedOrg.legalRepresentative.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">CPF</p>
                      <p className="text-white">{selectedOrg.legalRepresentative.cpf}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">E-mail</p>
                      <p className="text-white">{selectedOrg.legalRepresentative.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Telefone</p>
                      <p className="text-white">{selectedOrg.legalRepresentative.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="p-6 bg-white/5 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Endereço</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <p className="text-sm text-gray-400">Logradouro</p>
                      <p className="text-white">
                        {selectedOrg.address.street}, {selectedOrg.address.number}
                        {selectedOrg.address.complement && ` - ${selectedOrg.address.complement}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Bairro</p>
                      <p className="text-white">{selectedOrg.address.neighborhood}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Cidade/Estado</p>
                      <p className="text-white">{selectedOrg.address.city}/{selectedOrg.address.state}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">CEP</p>
                      <p className="text-white">{selectedOrg.address.postalCode}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="p-6 bg-white/5 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Documentos</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href={selectedOrg.documents.socialStatute}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-primary-400" />
                      <div>
                        <p className="text-white">Estatuto Social</p>
                        <p className="text-xs text-gray-400">Clique para visualizar</p>
                      </div>
                      <Download className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                    <a
                      href={selectedOrg.documents.electionMinutes}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-primary-400" />
                      <div>
                        <p className="text-white">Ata de Eleição</p>
                        <p className="text-xs text-gray-400">Clique para visualizar</p>
                      </div>
                      <Download className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                    <a
                      href={selectedOrg.documents.cnpjCard}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-primary-400" />
                      <div>
                        <p className="text-white">Cartão CNPJ</p>
                        <p className="text-xs text-gray-400">Clique para visualizar</p>
                      </div>
                      <Download className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                    <a
                      href={selectedOrg.documents.addressProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-primary-400" />
                      <div>
                        <p className="text-white">Comprovante de Endereço</p>
                        <p className="text-xs text-gray-400">Clique para visualizar</p>
                      </div>
                      <Download className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  </div>
                </div>

                {/* Actions */}
                {selectedOrg.status === 'PENDING' && (
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => {
                        const reason = prompt('Motivo da rejeição:');
                        if (reason) {
                          handleReject(selectedOrg.id, reason);
                          setShowDetailsModal(false);
                        }
                      }}
                      className="px-6 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Rejeitar Cadastro
                    </button>
                    <button
                      onClick={() => {
                        handleApprove(selectedOrg.id);
                        setShowDetailsModal(false);
                      }}
                      className="btn-primary flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Aprovar Cadastro
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;