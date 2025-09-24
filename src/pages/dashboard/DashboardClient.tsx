import { useState, useEffect } from 'react'
import { 
  Trophy, 
  Ticket,
  DollarSign,
  Calendar,
  Gift,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ShoppingBag,
  TrendingUp,
  Star,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { raffleService } from '../../services/api'
import SYSTEM_CONFIG from '../../config/systemConfig'

interface TicketData {
  id: string
  raffleId: string
  raffleTitle: string
  ticketNumber: number
  purchaseDate: string
  status: string
  raffleDraw?: string
}

interface Statistics {
  totalSpent: number
  totalTickets: number
  activeRaffles: number
  wonRaffles: number
}

export default function DashboardClient() {
  const { user } = useAuth()
  const [myTickets, setMyTickets] = useState<TicketData[]>([])
  const [activeRaffles, setActiveRaffles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statistics, setStatistics] = useState<Statistics>({
    totalSpent: 0,
    totalTickets: 0,
    activeRaffles: 0,
    wonRaffles: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Carregar rifas ativas públicas
      const rafflesResponse = await raffleService.getAll({ status: 1 })
      const activePublicRaffles = rafflesResponse.slice(0, 3)
      setActiveRaffles(activePublicRaffles)

      // TODO: Carregar tickets do usuário quando API estiver pronta
      // const ticketsResponse = await ticketService.getUserTickets(user?.id)
      // setMyTickets(ticketsResponse)

      // Calcular estatísticas
      setStatistics({
        totalSpent: 0, // Será calculado com os tickets reais
        totalTickets: 0,
        activeRaffles: activePublicRaffles.length,
        wonRaffles: 0
      })

    } catch (error) {
      setError('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'bg-green-100 text-green-800'
      case 2: return 'bg-blue-100 text-blue-800'
      case 3: return 'bg-gray-100 text-gray-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return 'Ativa'
      case 2: return 'Finalizada'
      case 3: return 'Cancelada'
      default: return 'Rascunho'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">
          Olá, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-purple-100">
          Bem-vindo ao seu painel de rifas. Participe e boa sorte!
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Ticket className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {statistics.totalTickets}
          </div>
          <p className="text-sm text-gray-500 mt-1">Bilhetes Comprados</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {statistics.wonRaffles}
          </div>
          <p className="text-sm text-gray-500 mt-1">Rifas Ganhas</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(statistics.totalSpent)}
          </div>
          <p className="text-sm text-gray-500 mt-1">Total Investido</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {statistics.activeRaffles}
          </div>
          <p className="text-sm text-gray-500 mt-1">Rifas Ativas</p>
        </div>
      </div>

      {/* Active Raffles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Rifas Disponíveis</h2>
            <Link 
              to="/rifas" 
              className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
            >
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {activeRaffles.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Nenhuma rifa disponível no momento</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeRaffles.map(raffle => (
                <div key={raffle.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                    {raffle.coverImageUrl ? (
                      <img 
                        src={raffle.coverImageUrl} 
                        alt={raffle.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Gift className="w-12 h-12 text-purple-400" />
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{raffle.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{raffle.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500">
                        <DollarSign className="w-4 h-4 inline" />
                        {formatCurrency(raffle.ticketPrice)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(raffle.status)}`}>
                        {getStatusText(raffle.status)}
                      </span>
                    </div>
                    
                    <Link 
                      to={`/raffle/${raffle.id}`}
                      className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Participar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My Tickets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Meus Bilhetes Recentes</h2>
            <Link 
              to="/dashboard/tickets" 
              className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {myTickets.length === 0 ? (
            <div className="text-center py-8">
              <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">Você ainda não comprou nenhum bilhete</p>
              <Link 
                to="/rifas"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Explorar Rifas
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myTickets.slice(0, 5).map(ticket => (
                <div key={ticket.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{ticket.raffleTitle}</p>
                      <p className="text-sm text-gray-500">
                        Bilhete #{ticket.ticketNumber} • {formatDate(ticket.purchaseDate)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      ticket.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status === 'active' ? 'Ativo' : 'Aguardando'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}