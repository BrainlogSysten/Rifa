import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  DollarSign,
  Upload,
  Download,
  Send,
  Eye,
  Plus,
  Info,
  ExternalLink,
  AlertCircle,
  TrendingUp,
  Award,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SCPCPromotion {
  id: string;
  title: string;
  protocol: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'expired';
  submissionDate: string;
  approvalDate?: string;
  expirationDate?: string;
  drawDate: string;
  prizeValue: number;
  ticketPrice: number;
  numberOfTickets: number;
  loteriaFederalNumber?: string;
  documents: {
    regulamento: boolean;
    planoDivulgacao: boolean;
    certificadoRegularidade: boolean;
    comprovacoesFinanceiras: boolean;
  };
}

const SCPCManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'history'>('active');
  const [showNewPromotionModal, setShowNewPromotionModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<SCPCPromotion | null>(null);

  // Mock data - replace with API
  const [promotions] = useState<SCPCPromotion[]>([
    {
      id: '1',
      title: 'iPhone 15 Pro Max - Natal 2024',
      protocol: 'SCPC/2024/001234',
      status: 'approved',
      submissionDate: '2024-09-01',
      approvalDate: '2024-09-15',
      expirationDate: '2024-12-31',
      drawDate: '2024-12-25',
      prizeValue: 8000,
      ticketPrice: 10,
      numberOfTickets: 1000,
      loteriaFederalNumber: '001/2024',
      documents: {
        regulamento: true,
        planoDivulgacao: true,
        certificadoRegularidade: true,
        comprovacoesFinanceiras: true
      }
    },
    {
      id: '2',
      title: 'MacBook Pro M3',
      protocol: 'SCPC/2024/001235',
      status: 'submitted',
      submissionDate: '2024-09-20',
      drawDate: '2025-01-15',
      prizeValue: 15000,
      ticketPrice: 25,
      numberOfTickets: 1000,
      documents: {
        regulamento: true,
        planoDivulgacao: true,
        certificadoRegularidade: false,
        comprovacoesFinanceiras: false
      }
    }
  ]);

  const getStatusColor = (status: SCPCPromotion['status']) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-400/10';
      case 'submitted': return 'text-yellow-400 bg-yellow-400/10';
      case 'rejected': return 'text-red-400 bg-red-400/10';
      case 'expired': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: SCPCPromotion['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'submitted': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: SCPCPromotion['status']) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'submitted': return 'Em Análise';
      case 'rejected': return 'Rejeitado';
      case 'expired': return 'Expirado';
      default: return 'Rascunho';
    }
  };

  const filteredPromotions = promotions.filter(p => {
    if (activeTab === 'active') return p.status === 'approved';
    if (activeTab === 'pending') return p.status === 'submitted' || p.status === 'draft';
    return p.status === 'rejected' || p.status === 'expired';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestão SCPC</h1>
          <p className="text-gray-400 mt-1">
            Gerencie suas autorizações de sorteios promocionais
          </p>
        </div>
        <button
          onClick={() => setShowNewPromotionModal(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Nova Solicitação
        </button>
      </div>

      {/* Important Notice */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-4 border border-yellow-500/20 bg-yellow-500/5"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-400 mb-1">
              Prazo Legal de Solicitação: 40 a 120 dias
            </h3>
            <p className="text-sm text-yellow-300/80">
              Conforme Lei 5.768/71 e Decreto 70.951/72, todas as promoções comerciais devem ser
              cadastradas no SCPC com antecedência mínima de 40 dias e máxima de 120 dias
              antes do início da promoção.
            </p>
            <div className="flex gap-4 mt-3">
              <a
                href="https://scpc.seae.fazenda.gov.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1"
              >
                Acessar Portal SCPC
                <ExternalLink className="w-3 h-3" />
              </a>
              <Link
                to="/dashboard/compliance/guide"
                className="text-primary-400 hover:text-primary-300 text-sm font-medium"
              >
                Guia Completo →
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Autorizações Ativas</p>
              <p className="text-2xl font-bold text-white">
                {promotions.filter(p => p.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Em Análise</p>
              <p className="text-2xl font-bold text-white">
                {promotions.filter(p => p.status === 'submitted').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Próximo Vencimento</p>
              <p className="text-lg font-bold text-white">15 dias</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Taxa Total Paga</p>
              <p className="text-2xl font-bold text-white">R$ 2.450</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-lg w-fit">
        {[
          { id: 'active', label: 'Ativas', count: promotions.filter(p => p.status === 'approved').length },
          { id: 'pending', label: 'Pendentes', count: promotions.filter(p => p.status === 'submitted' || p.status === 'draft').length },
          { id: 'history', label: 'Histórico', count: promotions.filter(p => p.status === 'rejected' || p.status === 'expired').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Promotions List */}
      <div className="space-y-4">
        {filteredPromotions.length > 0 ? (
          filteredPromotions.map(promotion => (
            <motion.div
              key={promotion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {promotion.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`px-3 py-1 rounded-full font-medium flex items-center gap-1 ${getStatusColor(promotion.status)}`}>
                          {getStatusIcon(promotion.status)}
                          {getStatusLabel(promotion.status)}
                        </span>
                        {promotion.protocol && (
                          <span className="text-gray-400">
                            Protocolo: <span className="text-white font-mono">{promotion.protocol}</span>
                          </span>
                        )}
                        {promotion.loteriaFederalNumber && (
                          <span className="text-gray-400">
                            Loteria Federal: <span className="text-white font-mono">{promotion.loteriaFederalNumber}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Submissão</p>
                      <p className="text-white text-sm">
                        {new Date(promotion.submissionDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    {promotion.approvalDate && (
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Aprovação</p>
                        <p className="text-white text-sm">
                          {new Date(promotion.approvalDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Sorteio</p>
                      <p className="text-white text-sm">
                        {new Date(promotion.drawDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    {promotion.expirationDate && (
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Validade</p>
                        <p className="text-white text-sm">
                          {new Date(promotion.expirationDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Financial Info */}
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-gray-400">Valor do Prêmio:</span>
                      <span className="text-white ml-2 font-semibold">
                        R$ {promotion.prizeValue.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Bilhetes:</span>
                      <span className="text-white ml-2 font-semibold">
                        {promotion.numberOfTickets} x R$ {promotion.ticketPrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Documents Status */}
                <div className="lg:w-64">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Documentos</h4>
                  <div className="space-y-2">
                    {Object.entries(promotion.documents).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          {key === 'regulamento' && 'Regulamento'}
                          {key === 'planoDivulgacao' && 'Plano de Divulgação'}
                          {key === 'certificadoRegularidade' && 'Cert. Regularidade'}
                          {key === 'comprovacoesFinanceiras' && 'Comprov. Financeiras'}
                        </span>
                        {value ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2">
                  <button className="btn-secondary text-sm">
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Visualizar</span>
                  </button>
                  {promotion.status === 'approved' && (
                    <button className="btn-secondary text-sm">
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Certificado</span>
                    </button>
                  )}
                  {promotion.status === 'draft' && (
                    <button className="btn-primary text-sm">
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Enviar</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="card p-12 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhuma autorização {activeTab === 'active' ? 'ativa' : activeTab === 'pending' ? 'pendente' : 'no histórico'}
            </h3>
            <p className="text-gray-400 mb-6">
              Cadastre sua primeira promoção no SCPC
            </p>
            <button
              onClick={() => setShowNewPromotionModal(true)}
              className="btn-primary inline-flex"
            >
              <Plus className="w-5 h-5" />
              Nova Solicitação
            </button>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-2">Taxa de Fiscalização</h3>
              <p className="text-sm text-gray-400 mb-3">
                As taxas são calculadas com base no valor total dos prêmios oferecidos:
              </p>
              <ul className="space-y-1 text-sm">
                <li className="text-gray-300">• Até R$ 10.000: R$ 354,97</li>
                <li className="text-gray-300">• De R$ 10.001 a R$ 100.000: R$ 709,95</li>
                <li className="text-gray-300">• De R$ 100.001 a R$ 1.000.000: R$ 1.419,89</li>
                <li className="text-gray-300">• Acima de R$ 1.000.000: R$ 2.839,77</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start gap-3 mb-4">
            <FileText className="w-6 h-6 text-purple-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-2">Documentação Necessária</h3>
              <p className="text-sm text-gray-400 mb-3">
                Para submissão no SCPC você precisará:
              </p>
              <ul className="space-y-1 text-sm">
                <li className="text-gray-300">• Regulamento completo da promoção</li>
                <li className="text-gray-300">• Plano de divulgação e mídia</li>
                <li className="text-gray-300">• Certificado de regularidade fiscal</li>
                <li className="text-gray-300">• Comprovações financeiras</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SCPCManagement;