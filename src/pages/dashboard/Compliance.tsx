import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Upload,
  Calendar,
  Info,
  ExternalLink,
  Award,
  Scale,
  Briefcase,
  FileCheck,
  XCircle,
  ChevronRight,
  AlertCircle,
  Eye
} from 'lucide-react';

interface ComplianceDocument {
  id: string;
  type: 'certificate' | 'regulation' | 'accountability' | 'authorization' | 'report';
  title: string;
  description: string;
  status: 'valid' | 'expired' | 'pending' | 'rejected';
  issueDate: string;
  expiryDate?: string;
  documentUrl?: string;
  raffleId?: string;
  raffleTitle?: string;
}

interface ComplianceTask {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'completed' | 'pending' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  raffleId?: string;
}

const Compliance: React.FC = () => {
  const [documents, setDocuments] = useState<ComplianceDocument[]>([]);
  const [tasks, setTasks] = useState<ComplianceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const fetchComplianceData = async () => {
    try {
      setLoading(true);

      // Mock data - replace with API calls
      const mockDocuments: ComplianceDocument[] = [
        {
          id: '1',
          type: 'certificate',
          title: 'Certificado SCPC/SECAP',
          description: 'Certificado de autorização para promoções comerciais',
          status: 'valid',
          issueDate: '2024-01-01',
          expiryDate: '2024-12-31',
          documentUrl: '#'
        },
        {
          id: '2',
          type: 'authorization',
          title: 'Autorização Sorteio - iPhone 15 Pro Max',
          description: 'Protocolo SCPC2024/001234',
          status: 'valid',
          issueDate: '2024-01-05',
          expiryDate: '2024-02-15',
          documentUrl: '#',
          raffleId: '1',
          raffleTitle: 'iPhone 15 Pro Max'
        },
        {
          id: '3',
          type: 'accountability',
          title: 'Prestação de Contas - PlayStation 5',
          description: 'Relatório de prestação de contas do sorteio',
          status: 'pending',
          issueDate: '2024-01-10',
          documentUrl: '#',
          raffleId: '3',
          raffleTitle: 'PlayStation 5'
        },
        {
          id: '4',
          type: 'regulation',
          title: 'Regulamento - MacBook Pro M3',
          description: 'Regulamento aprovado pela SECAP',
          status: 'valid',
          issueDate: '2024-01-08',
          documentUrl: '#',
          raffleId: '2',
          raffleTitle: 'MacBook Pro M3'
        }
      ];

      const mockTasks: ComplianceTask[] = [
        {
          id: '1',
          title: 'Enviar prestação de contas - iPhone 14',
          description: 'Prazo máximo de 30 dias após o sorteio',
          deadline: '2024-01-20',
          status: 'pending',
          priority: 'high',
          raffleId: '4'
        },
        {
          id: '2',
          title: 'Renovar certificado SCPC',
          description: 'Certificado expira em 30 dias',
          deadline: '2024-02-01',
          status: 'pending',
          priority: 'high'
        },
        {
          id: '3',
          title: 'Atualizar regulamento geral',
          description: 'Adequar às novas normas da SECAP',
          deadline: '2024-02-15',
          status: 'pending',
          priority: 'medium'
        },
        {
          id: '4',
          title: 'Relatório anual de sorteios',
          description: 'Compilar dados para relatório anual',
          deadline: '2024-03-01',
          status: 'pending',
          priority: 'low'
        }
      ];

      setDocuments(mockDocuments);
      setTasks(mockTasks);
    } catch (error) {
      console.error('Error fetching compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: ComplianceDocument['status']) => {
    const statusConfig = {
      valid: { color: 'bg-green-500', icon: <CheckCircle className="w-3 h-3" />, text: 'Válido' },
      expired: { color: 'bg-red-500', icon: <XCircle className="w-3 h-3" />, text: 'Expirado' },
      pending: { color: 'bg-yellow-500', icon: <Clock className="w-3 h-3" />, text: 'Pendente' },
      rejected: { color: 'bg-red-500', icon: <XCircle className="w-3 h-3" />, text: 'Rejeitado' }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority: ComplianceTask['priority']) => {
    const priorityConfig = {
      high: { color: 'bg-red-500', text: 'Alta' },
      medium: { color: 'bg-yellow-500', text: 'Média' },
      low: { color: 'bg-blue-500', text: 'Baixa' }
    };

    const config = priorityConfig[priority];
    return (
      <span className={`px-2 py-1 rounded-full text-xs text-white ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getDocumentIcon = (type: ComplianceDocument['type']) => {
    switch (type) {
      case 'certificate':
        return <Award className="w-5 h-5 text-green-400" />;
      case 'regulation':
        return <Scale className="w-5 h-5 text-blue-400" />;
      case 'accountability':
        return <FileCheck className="w-5 h-5 text-yellow-400" />;
      case 'authorization':
        return <Shield className="w-5 h-5 text-purple-400" />;
      case 'report':
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const stats = {
    validDocuments: documents.filter(d => d.status === 'valid').length,
    pendingDocuments: documents.filter(d => d.status === 'pending').length,
    expiredDocuments: documents.filter(d => d.status === 'expired').length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    overdueTasks: tasks.filter(t => t.status === 'overdue').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length
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
          <h1 className="text-3xl font-bold text-white">Compliance & SCPC</h1>
          <p className="text-gray-400 mt-1">Gerencie documentação e conformidade legal</p>
        </div>
        <div className="flex gap-3">
          <a
            href="https://www.gov.br/fazenda/pt-br/assuntos/apostas-e-jogos/promocao-comercial"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <ExternalLink className="w-5 h-5" />
            Portal SECAP
          </a>
          <button className="btn-primary">
            <Upload className="w-5 h-5" />
            Enviar Documento
          </button>
        </div>
      </div>

      {/* Important Alert */}
      {stats.overdueTasks > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 bg-red-500/10 border border-red-500/30"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div className="flex-1">
              <p className="text-white font-semibold">Atenção! Você tem {stats.overdueTasks} tarefa(s) em atraso</p>
              <p className="text-gray-300 text-sm mt-1">Regularize sua situação para evitar penalidades.</p>
            </div>
            <button className="btn-primary">Ver Tarefas</button>
          </div>
        </motion.div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-sm">Válidos</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.validDocuments}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <p className="text-gray-400 text-sm">Pendentes</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.pendingDocuments}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <p className="text-gray-400 text-sm">Expirados</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.expiredDocuments}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            <p className="text-gray-400 text-sm">Tarefas</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.pendingTasks}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <p className="text-gray-400 text-sm">Atrasadas</p>
          </div>
          <p className="text-2xl font-bold text-orange-400">{stats.overdueTasks}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-sm">Completas</p>
          </div>
          <p className="text-2xl font-bold text-green-400">{stats.completedTasks}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {['overview', 'documents', 'tasks', 'guides'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'overview' && 'Visão Geral'}
            {tab === 'documents' && 'Documentos'}
            {tab === 'tasks' && 'Tarefas'}
            {tab === 'guides' && 'Guias'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Status */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-400" />
              Status da Empresa
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Certificado SCPC/SECAP</p>
                    <p className="text-xs text-gray-400">Válido até 31/12/2024</p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">CNPJ Regular</p>
                    <p className="text-xs text-gray-400">12.345.678/0001-90</p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Regularidade Fiscal</p>
                    <p className="text-xs text-gray-400">Todas as certidões válidas</p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">Prestações de Contas</p>
                    <p className="text-xs text-gray-400">2 pendentes</p>
                  </div>
                </div>
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-400" />
              Próximos Prazos
            </h2>
            <div className="space-y-3">
              {tasks
                .filter(t => t.status === 'pending')
                .slice(0, 4)
                .map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-white font-medium text-sm">{task.title}</p>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{task.description}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-400">
                        Prazo: {new Date(task.deadline).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-4">
          {documents.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    {getDocumentIcon(doc.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{doc.title}</h3>
                      {getStatusBadge(doc.status)}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{doc.description}</p>
                    {doc.raffleTitle && (
                      <p className="text-xs text-gray-500 mb-2">
                        Sorteio: {doc.raffleTitle}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>
                        Emissão: {new Date(doc.issueDate).toLocaleDateString('pt-BR')}
                      </span>
                      {doc.expiryDate && (
                        <span>
                          Validade: {new Date(doc.expiryDate).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary text-sm">
                    <Eye className="w-4 h-4" />
                    Visualizar
                  </button>
                  <button className="btn-secondary text-sm">
                    <Download className="w-4 h-4" />
                    Baixar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card p-6 hover:shadow-xl transition-shadow ${
                task.status === 'overdue' ? 'border-l-4 border-red-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                    {getPriorityBadge(task.priority)}
                    {task.status === 'overdue' && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                        Atrasado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      Prazo: {new Date(task.deadline).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                <button className="btn-primary text-sm">
                  <ChevronRight className="w-4 h-4" />
                  Resolver
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            {
              title: 'Como solicitar autorização SCPC',
              description: 'Passo a passo para cadastrar promoções no sistema SCPC/SECAP',
              icon: <Shield className="w-6 h-6" />,
              time: '10 min de leitura'
            },
            {
              title: 'Prestação de contas obrigatória',
              description: 'Saiba como fazer a prestação de contas após o sorteio',
              icon: <FileCheck className="w-6 h-6" />,
              time: '5 min de leitura'
            },
            {
              title: 'Regulamento padrão SECAP',
              description: 'Modelo de regulamento aprovado pela SECAP',
              icon: <Scale className="w-6 h-6" />,
              time: '15 min de leitura'
            },
            {
              title: 'Prazos e multas',
              description: 'Conheça todos os prazos legais e evite multas',
              icon: <AlertTriangle className="w-6 h-6" />,
              time: '8 min de leitura'
            }
          ].map((guide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:shadow-xl transition-shadow cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-500/20 rounded-lg text-primary-400 group-hover:scale-110 transition-transform">
                  {guide.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{guide.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{guide.description}</p>
                  <p className="text-xs text-gray-500">{guide.time}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Compliance;