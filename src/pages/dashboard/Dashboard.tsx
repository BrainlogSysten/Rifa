import { useState, useEffect } from 'react'
import { 
  Trophy, 
  Users, 
  DollarSign,
  Ticket,
  Plus,
  ArrowRight,
  Calendar,
  Gift,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { raffleService } from '../../services/api'

interface RaffleData {
  id: number
  title: string
  description: string
  prizeTitle: string
  prizeDescription: string
  imageUrl: string
  ticketPrice: number
  numberOfTickets: number
  startDate: string
  endDate: string
  status: number
  creatorId: string
  soldTickets?: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [myRaffles, setMyRaffles] = useState<RaffleData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    totalSold: 0,
    activeRaffles: 0,
    totalParticipants: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const allRaffles = await raffleService.getAll()
      
      const userRaffles = allRaffles.filter(
        (raffle: RaffleData) => raffle.creatorId === user?.id
      )

      const rafflesWithSales = await Promise.all(
        userRaffles.map(async (raffle: RaffleData) => {
          try {
            const tickets = await raffleService.getTickets(raffle.id)
            return {
              ...raffle,
              soldTickets: tickets.length
            }
          } catch {
            return {
              ...raffle,
              soldTickets: 0
            }
          }
        })
      )

      setMyRaffles(rafflesWithSales)

      const stats = rafflesWithSales.reduce((acc, raffle) => {
        const revenue = (raffle.soldTickets || 0) * raffle.ticketPrice
        return {
          totalRevenue: acc.totalRevenue + revenue,
          totalSold: acc.totalSold + (raffle.soldTickets || 0),
          activeRaffles: acc.activeRaffles + (raffle.status === 1 ? 1 : 0),
          totalParticipants: 0
        }
      }, {
        totalRevenue: 0,
        totalSold: 0,
        activeRaffles: 0,
        totalParticipants: 0
      })

      setStatistics(stats)
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err)
      setError('Erro ao carregar seus dados. Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando seus dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Olá, {user?.name || 'Usuário'} 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Veja como estão suas rifas hoje
              </p>
            </div>
            <Link
              to="/dashboard/raffles/create"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Criar Nova Rifa
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Arrecadado</p>
            <p className="text-3xl font-bold text-gray-900">
              R$ {statistics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <Ticket className="w-8 h-8 text-purple-500" />
              {statistics.activeRaffles > 0 && (
                <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded">
                  {statistics.activeRaffles} {statistics.activeRaffles === 1 ? 'ativa' : 'ativas'}
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-1">Bilhetes Vendidos</p>
            <p className="text-3xl font-bold text-gray-900">{statistics.totalSold}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Participantes</p>
            <p className="text-3xl font-bold text-gray-900">{statistics.totalParticipants}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Minhas Rifas</h2>
              <Link 
                to="/dashboard/raffles" 
                className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1"
              >
                Ver todas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {myRaffles.length > 0 ? (
              <div className="space-y-4">
                {myRaffles.map((raffle) => {
                  const progressPercent = raffle.numberOfTickets > 0 
                    ? ((raffle.soldTickets || 0) / raffle.numberOfTickets) * 100 
                    : 0
                  const revenue = (raffle.soldTickets || 0) * raffle.ticketPrice
                  
                  return (
                    <div key={raffle.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <img 
                        src={raffle.imageUrl || 'https://via.placeholder.com/300x200'} 
                        alt={raffle.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{raffle.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>R$ {raffle.ticketPrice.toFixed(2)}/bilhete</span>
                          <span>•</span>
                          <span>{raffle.soldTickets || 0}/{raffle.numberOfTickets} vendidos</span>
                          <span>•</span>
                          <span className="text-green-600 font-medium">
                            R$ {revenue.toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(progressPercent, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/dashboard/raffles/${raffle.id}`}
                        className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
                      >
                        Gerenciar
                      </Link>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Você ainda não criou nenhuma rifa</p>
                <Link
                  to="/dashboard/raffles/create"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Criar Primeira Rifa
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/dashboard/raffles/create" className="group">
            <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md hover:border-purple-200 transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Criar Rifa</h3>
              <p className="text-sm text-gray-600">Comece uma nova rifa agora</p>
            </div>
          </Link>

          <Link to="/dashboard/tickets" className="group">
            <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md hover:border-purple-200 transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Ticket className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Meus Bilhetes</h3>
              <p className="text-sm text-gray-600">Veja seus bilhetes comprados</p>
            </div>
          </Link>

          <Link to="/dashboard/winners" className="group">
            <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md hover:border-purple-200 transition-all">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Ganhadores</h3>
              <p className="text-sm text-gray-600">Histórico de sorteios</p>
            </div>
          </Link>

          <Link to="/dashboard/help" className="group">
            <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md hover:border-purple-200 transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Ajuda</h3>
              <p className="text-sm text-gray-600">Dúvidas frequentes</p>
            </div>
          </Link>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900">
                Dica: Complete seu perfil para passar mais confiança
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Rifas de vendedores verificados vendem 3x mais. 
                <Link to="/dashboard/profile" className="font-medium underline ml-1">
                  Completar perfil
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}