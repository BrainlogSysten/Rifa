import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Ticket,
  Users,
  Trophy,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileText,
  Bell,
  Plus,
  Eye,
  Download,
  ChevronRight,
  Activity,
  Shield,
  Award,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import dashboardService from '../../services/dashboardService';
import promotionService from '../../services/promotionService';
import ticketService from '../../services/ticketService';
import walletService from '../../services/walletService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

const DashboardHome: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [complianceAlerts, setComplianceAlerts] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any>(null);
  const [topPromotions, setTopPromotions] = useState<any[]>([]);
  const [conversionData, setConversionData] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Carregar métricas
      const [metricsData, salesData, activities, alerts, promotions, funnel, balance] = await Promise.all([
        dashboardService.getMetrics(timeRange),
        dashboardService.getSalesData(timeRange),
        dashboardService.getRecentActivity(),
        dashboardService.getComplianceAlerts(),
        dashboardService.getTopPromotions(),
        dashboardService.getConversionFunnel(timeRange),
        walletService.getBalance()
      ]);

      // Formatar métricas
      setMetrics([
        {
          title: 'Receita Total',
          value: `R$ ${(balance.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          change: metricsData.revenueChange || 0,
          changeType: metricsData.revenueChange >= 0 ? 'increase' : 'decrease',
          icon: <DollarSign className="w-6 h-6" />,
          color: 'from-green-400 to-green-600'
        },
        {
          title: 'Bilhetes Vendidos',
          value: (metricsData.ticketsSold || 0).toLocaleString('pt-BR'),
          change: metricsData.ticketsChange || 0,
          changeType: metricsData.ticketsChange >= 0 ? 'increase' : 'decrease',
          icon: <Ticket className="w-6 h-6" />,
          color: 'from-blue-400 to-blue-600'
        },
        {
          title: 'Sorteios Ativos',
          value: metricsData.activePromotions || 0,
          change: metricsData.promotionsChange || 0,
          changeType: metricsData.promotionsChange >= 0 ? 'increase' : 'decrease',
          icon: <Trophy className="w-6 h-6" />,
          color: 'from-purple-400 to-purple-600'
        },
        {
          title: 'Participantes',
          value: (metricsData.participants || 0).toLocaleString('pt-BR'),
          change: metricsData.participantsChange || 0,
          changeType: metricsData.participantsChange >= 0 ? 'increase' : 'decrease',
          icon: <Users className="w-6 h-6" />,
          color: 'from-yellow-400 to-yellow-600'
        }
      ]);

      setSalesData(salesData);
      setRecentActivities(activities);
      setComplianceAlerts(alerts);
      setTopPromotions(promotions);
      setConversionData(funnel);

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const salesChartData = salesData ? {
    labels: salesData.labels,
    datasets: [
      {
        label: 'Vendas',
        data: salesData.values,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  } : null;

  const ticketsChartData = topPromotions.length > 0 ? {
    labels: topPromotions.slice(0, 5).map(p => p.title),
    datasets: [
      {
        label: 'Bilhetes Vendidos',
        data: topPromotions.slice(0, 5).map(p => p.ticketsSold),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(167, 139, 250, 0.8)',
          'rgba(251, 113, 133, 0.8)'
        ]
      }
    ]
  } : null;

  const conversionChartData = conversionData ? {
    labels: ['Visitas', 'Registros', 'Compras', 'Conclusões'],
    datasets: [
      {
        label: 'Funil',
        data: [
          conversionData.visits || 0,
          conversionData.registrations || 0,
          conversionData.purchases || 0,
          conversionData.completions || 0
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(156, 163, 175, 0.9)'
        }
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: 'rgba(156, 163, 175, 0.9)'
        }
      }
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'info':
        return <CheckCircle className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Ticket className="w-4 h-4 text-green-400" />;
      case 'withdrawal':
        return <DollarSign className="w-4 h-4 text-blue-400" />;
      case 'promotion_created':
        return <Plus className="w-4 h-4 text-purple-400" />;
      case 'winner':
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Bem-vindo de volta! Aqui está o resumo do seu negócio.</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-modern"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
          <Link to="/dashboard/create-promotion" className="btn-primary">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Criar Sorteio</span>
          </Link>
        </div>
      </div>

      {/* Compliance Alerts */}
      {complianceAlerts.length > 0 && (
        <div className="space-y-3">
          {complianceAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card p-4 border-l-4 ${
                alert.type === 'warning' ? 'border-yellow-400' :
                alert.type === 'error' ? 'border-red-400' : 'border-blue-400'
              }`}
            >
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{alert.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{alert.description}</p>
                </div>
                {alert.action && (
                  <Link
                    to={alert.actionUrl || '#'}
                    className="btn-secondary text-sm"
                  >
                    {alert.action}
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color}`}>
                {metric.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                metric.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
              }`}>
                {metric.changeType === 'increase' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">{metric.title}</p>
              <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Vendas ao Longo do Tempo</h2>
            <button className="text-gray-400 hover:text-white">
              <Download className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64">
            {salesChartData && <Line data={salesChartData} options={chartOptions} />}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Funil de Conversão</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64">
            {conversionChartData && <Bar data={conversionChartData} options={chartOptions} />}
          </div>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Promotions */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Top Sorteios</h2>
            <Link to="/dashboard/my-promotions" className="text-primary-400 hover:text-primary-300 text-sm">
              Ver todos <ChevronRight className="w-4 h-4 inline" />
            </Link>
          </div>
          {topPromotions.length > 0 ? (
            <div className="space-y-4">
              {topPromotions.slice(0, 5).map((promo) => (
                <div key={promo.id} className="flex items-center gap-4">
                  <img
                    src={promo.imageUrl || '/api/placeholder/50/50'}
                    alt={promo.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{promo.title}</h4>
                    <p className="text-gray-400 text-sm">
                      {promo.ticketsSold} bilhetes • R$ {promo.revenue.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-primary-400 font-semibold">{promo.progress}%</div>
                    <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-primary-400 rounded-full"
                        style={{ width: `${promo.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Trophy className="w-12 h-12 mb-2" />
              <p>Nenhum sorteio ativo</p>
              <Link to="/dashboard/create-promotion" className="btn-secondary mt-4">
                Criar Sorteio
              </Link>
            </div>
          )}
        </div>

        {/* Tickets Distribution */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Distribuição de Bilhetes</h2>
            <Eye className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64">
            {ticketsChartData ? (
              <Doughnut
                data={ticketsChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      display: true,
                      position: 'bottom' as const,
                      labels: {
                        color: 'rgba(156, 163, 175, 0.9)',
                        padding: 15
                      }
                    }
                  }
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Ticket className="w-12 h-12 mb-2" />
                <p>Sem dados de bilhetes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Atividade Recente</h2>
          <Link to="/dashboard/notifications" className="text-primary-400 hover:text-primary-300 text-sm">
            Ver todas <ChevronRight className="w-4 h-4 inline" />
          </Link>
        </div>
        {recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{activity.title}</h4>
                  <p className="text-gray-400 text-sm">{activity.description}</p>
                  <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
                </div>
                {activity.amount && (
                  <div className="text-right">
                    <span className="text-green-400 font-semibold">
                      R$ {activity.amount.toLocaleString('pt-BR')}
                    </span>
                    {activity.status && (
                      <div className={`text-xs mt-1 ${
                        activity.status === 'success' ? 'text-green-400' :
                        activity.status === 'pending' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {activity.status === 'success' ? 'Concluído' :
                         activity.status === 'pending' ? 'Pendente' : 'Falhou'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-2" />
            <p>Nenhuma atividade recente</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/dashboard/create-promotion" className="card p-4 hover:bg-white/5 transition-colors">
          <Plus className="w-6 h-6 text-primary-400 mb-2" />
          <p className="text-white font-medium">Criar Sorteio</p>
        </Link>
        <Link to="/dashboard/wallet" className="card p-4 hover:bg-white/5 transition-colors">
          <DollarSign className="w-6 h-6 text-green-400 mb-2" />
          <p className="text-white font-medium">Solicitar Saque</p>
        </Link>
        <Link to="/dashboard/compliance" className="card p-4 hover:bg-white/5 transition-colors">
          <Shield className="w-6 h-6 text-yellow-400 mb-2" />
          <p className="text-white font-medium">Conformidade</p>
        </Link>
        <Link to="/dashboard/analytics" className="card p-4 hover:bg-white/5 transition-colors">
          <BarChart3 className="w-6 h-6 text-purple-400 mb-2" />
          <p className="text-white font-medium">Relatórios</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHome;