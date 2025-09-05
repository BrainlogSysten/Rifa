import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Gift,
  TrendingUp,
  DollarSign,
  Activity as ActivityIcon,
  BarChart3,
  User,
  Settings,
  AlertCircle,
} from 'lucide-react'
import { userService, raffleService, ticketService } from '../../../services/api'
import { activityService, type Activity } from '../../../services/activityService'
import toast from 'react-hot-toast'

interface AdminStats {
  totalUsers: number
  totalRaffles: number
  activeRaffles: number
  totalRevenue: number
  totalTickets: number
  recentActivities: Activity[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalRaffles: 0,
    activeRaffles: 0,
    totalRevenue: 0,
    totalTickets: 0,
    recentActivities: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      const [users, raffles, tickets, activities] = await Promise.all([
        userService.getAll().catch(() => []),
        raffleService.getAll().catch(() => []),
        ticketService.getAll().catch(() => []),
        activityService.getRecentActivities().catch(() => [])
      ])

      const activeRaffles = raffles.filter((r: any) => r.status === 1).length
      
      const totalRevenue = tickets.reduce((sum: number, ticket: any) => {
        if (ticket.value) {
          return sum + ticket.value
        }
        const raffle = raffles.find((r: any) => r.id === ticket.raffleId)
        return sum + (raffle?.ticketPrice || 0)
      }, 0)

      setStats({
        totalUsers: users.length,
        totalRaffles: raffles.length,
        activeRaffles,
        totalRevenue,
        totalTickets: tickets.length,
        recentActivities: activities
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Erro ao carregar dados do dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered':
        return <User className="h-4 w-4" />
      case 'raffle_created':
        return <Gift className="h-4 w-4" />
      case 'ticket_purchased':
        return <DollarSign className="h-4 w-4" />
      case 'raffle_ended':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <ActivityIcon className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_registered':
        return 'text-blue-600 bg-blue-50'
      case 'raffle_created':
        return 'text-green-600 bg-green-50'
      case 'ticket_purchased':
        return 'text-purple-600 bg-purple-50'
      case 'raffle_ended':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600">Visão geral da plataforma e métricas importantes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Total de Usuários</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Rifas Ativas</p>
              <p className="text-3xl font-bold">{stats.activeRaffles}</p>
              <p className="text-xs opacity-75">de {stats.totalRaffles} total</p>
            </div>
            <Gift className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Receita Total</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Bilhetes Vendidos</p>
              <p className="text-3xl font-bold">{stats.totalTickets}</p>
            </div>
            <BarChart3 className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Sistema</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            <p className="text-sm text-gray-600">Usuários totais</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {stats.activeRaffles > 0 
                ? `${Math.round((stats.activeRaffles / stats.totalRaffles) * 100)}%`
                : '0%'
              }
            </p>
            <p className="text-sm text-gray-600">Taxa de atividade</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {stats.totalTickets > 0 && stats.totalRaffles > 0
                ? Math.round(stats.totalTickets / stats.totalRaffles)
                : 0
              }
            </p>
            <p className="text-sm text-gray-600">Média bilhetes/rifa</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(
                stats.totalTickets > 0 
                  ? stats.totalRevenue / stats.totalTickets 
                  : 0
              )}
            </p>
            <p className="text-sm text-gray-600">Ticket médio</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Links Rápidos</h2>
            <div className="space-y-3">
              <Link
                to="/dashboard/admin/users"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Gerenciar Usuários</p>
                    <p className="text-sm text-gray-500">Ver, editar e controlar usuários</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/dashboard/admin/prizes"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Gift className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Gerenciar Prêmios</p>
                    <p className="text-sm text-gray-500">Criar e editar prêmios das rifas</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/dashboard/raffles"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Gerenciar Rifas</p>
                    <p className="text-sm text-gray-500">Ver todas as rifas da plataforma</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/dashboard/settings"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Settings className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Configurações</p>
                    <p className="text-sm text-gray-500">Configurar plataforma</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Atividades Recentes</h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  {stats.recentActivities.length} atividades
                </span>
                <button
                  onClick={loadDashboardData}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                >
                  <ActivityIcon className="h-4 w-4" />
                  Atualizar
                </button>
              </div>
            </div>
            
            {stats.recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <ActivityIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Nenhuma atividade recente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        {activity.user && (
                          <p className="text-xs text-gray-500">por {activity.user}</p>
                        )}
                        {activity.amount && activity.type === 'ticket_purchased' && (
                          <p className="text-xs font-medium text-green-600">
                            {formatCurrency(activity.amount)}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}