import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Ticket as TicketIcon,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Filter,
  Search,
  Eye,
  Star
} from 'lucide-react'
import { ticketService, raffleService, Ticket, Raffle } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

type FilterStatus = 'all' | 'active' | 'finished' | 'winners'

interface TicketWithRaffle extends Ticket {
  raffle?: Raffle
}

export default function MyTickets() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<TicketWithRaffle[]>([])
  const [filteredTickets, setFilteredTickets] = useState<TicketWithRaffle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (user?.id) {
      loadMyTickets()
    }
  }, [user?.id])

  useEffect(() => {
    filterTickets()
  }, [tickets, activeFilter, searchTerm])

  const loadMyTickets = async () => {
    try {
      setIsLoading(true)
      const userTickets = await ticketService.getByUser(user!.id)
      
      const ticketsWithRaffles = await Promise.all(
        userTickets.map(async (ticket) => {
          try {
            const raffle = await raffleService.getById(ticket.raffleId)
            return { ...ticket, raffle }
          } catch (error) {
            console.error(`Error loading raffle ${ticket.raffleId}:`, error)
            return ticket
          }
        })
      )

      setTickets(ticketsWithRaffles)
    } catch (error) {
      toast.error('Erro ao carregar seus bilhetes')
      console.error('Error loading user tickets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterTickets = () => {
    let filtered = tickets

    switch (activeFilter) {
      case 'active':
        filtered = filtered.filter(ticket => ticket.raffle?.status === 'Active')
        break
      case 'finished':
        filtered = filtered.filter(ticket => 
          ticket.raffle?.status === 'Finished' || ticket.raffle?.status === 'Cancelled'
        )
        break
      case 'winners':
        filtered = filtered.filter(ticket => ticket.isWinner)
        break
      default:
        break
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(ticket => 
        ticket.raffle?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.value.toString().includes(searchTerm) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredTickets(filtered)
  }

  const getStatusBadge = (raffle?: Raffle) => {
    if (!raffle) return null

    switch (raffle.status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
            <Clock className="w-3 h-3 mr-1" />
            Ativa
          </span>
        )
      case 'Finished':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Finalizada
          </span>
        )
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelada
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {raffle.status}
          </span>
        )
    }
  }

  const calculateProgress = (raffle?: Raffle) => {
    if (!raffle?.maxParticipants) return 0
    const participants = 0
    return (participants / raffle.maxParticipants) * 100
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getWinnerBadge = (ticket: TicketWithRaffle) => {
    if (!ticket.isWinner) return null
    
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-secondary-400 to-secondary-500 text-white animate-pulse">
        <Trophy className="w-3 h-3 mr-1" />
        Bilhete Premiado!
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Bilhetes</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todos os seus bilhetes de rifa em um só lugar
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Bilhetes</p>
              <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <TicketIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bilhetes Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {tickets.filter(t => t.raffle?.status === 'Active').length}
              </p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <Clock className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bilhetes Premiados</p>
              <p className="text-2xl font-bold text-secondary-600">
                {tickets.filter(t => t.isWinner).length}
              </p>
            </div>
            <div className="p-3 bg-secondary-100 rounded-lg">
              <Trophy className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Investido</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {tickets.reduce((total, ticket) => total + (ticket.raffle?.ticketPrice || 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar bilhetes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {[
                { key: 'all', label: 'Todos' },
                { key: 'active', label: 'Ativos' },
                { key: 'finished', label: 'Finalizados' },
                { key: 'winners', label: 'Premiados' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key as FilterStatus)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeFilter === filter.key
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              {searchTerm || activeFilter !== 'all' ? 'Nenhum bilhete encontrado' : 'Nenhum bilhete ainda'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || activeFilter !== 'all' 
                ? 'Tente ajustar os filtros ou termo de busca'
                : 'Você ainda não comprou nenhum bilhete de rifa.'
              }
            </p>
            {!searchTerm && activeFilter === 'all' && (
              <div className="mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Ver Rifas Disponíveis
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                {filteredTickets.length} bilhete{filteredTickets.length !== 1 ? 's' : ''} encontrado{filteredTickets.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600 font-bold text-sm">
                              {ticket.value.toString().padStart(4, '0')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Bilhete #{ticket.value.toString().padStart(4, '0')}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ID: {ticket.id.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                        {getWinnerBadge(ticket)}
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {ticket.raffle?.title || 'Rifa não encontrada'}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Comprado em: {formatDate(ticket.purchaseDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>R$ {ticket.raffle?.ticketPrice?.toFixed(2) || '0,00'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(ticket.raffle)}
                          {ticket.isWinner && (
                            <Star className="w-4 h-4 text-secondary-500" />
                          )}
                        </div>

                        {ticket.raffle && (
                          <Link
                            to={`/raffle/${ticket.raffleId}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Ver Rifa
                          </Link>
                        )}
                      </div>

                      {ticket.raffle?.status === 'Active' && ticket.raffle.maxParticipants && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progresso da rifa</span>
                            <span>{calculateProgress(ticket.raffle).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${calculateProgress(ticket.raffle)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}