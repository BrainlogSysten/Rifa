import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Clock,
  Ticket,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { raffleService, ticketService } from '../../services/api'

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

export default function PublicRaffles() {
  const [raffles, setRaffles] = useState<RaffleData[]>([])
  const [filteredRaffles, setFilteredRaffles] = useState<RaffleData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    loadRaffles()
  }, [])

  useEffect(() => {
    filterAndSortRaffles()
  }, [raffles, searchTerm, priceFilter, sortBy])

  const loadRaffles = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const allRaffles = await raffleService.getAll()
      
      const activeRaffles = allRaffles.filter((raffle: RaffleData) => 
        raffle.status === 1 && new Date(raffle.endDate) > new Date()
      )

      const rafflesWithSales = await Promise.all(
        activeRaffles.map(async (raffle: RaffleData) => {
          try {
            const tickets = await ticketService.getByRaffle(raffle.id)
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

      setRaffles(rafflesWithSales)
      setFilteredRaffles(rafflesWithSales)
    } catch (err) {
      console.error('Erro ao carregar rifas:', err)
      setError('Erro ao carregar as rifas. Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortRaffles = () => {
    let filtered = [...raffles]

    if (searchTerm) {
      filtered = filtered.filter(raffle => 
        raffle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        raffle.prizeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        raffle.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    switch(priceFilter) {
      case 'under10':
        filtered = filtered.filter(r => r.ticketPrice < 10)
        break
      case '10to25':
        filtered = filtered.filter(r => r.ticketPrice >= 10 && r.ticketPrice <= 25)
        break
      case '25to50':
        filtered = filtered.filter(r => r.ticketPrice > 25 && r.ticketPrice <= 50)
        break
      case 'above50':
        filtered = filtered.filter(r => r.ticketPrice > 50)
        break
    }

    switch(sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        break
      case 'ending':
        filtered.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
        break
      case 'price_low':
        filtered.sort((a, b) => a.ticketPrice - b.ticketPrice)
        break
      case 'price_high':
        filtered.sort((a, b) => b.ticketPrice - a.ticketPrice)
        break
      case 'popular':
        filtered.sort((a, b) => (b.soldTickets || 0) - (a.soldTickets || 0))
        break
    }

    setFilteredRaffles(filtered)
  }

  const calculateProgress = (raffle: RaffleData) => {
    if (raffle.numberOfTickets === 0) return 0
    return Math.min(((raffle.soldTickets || 0) / raffle.numberOfTickets) * 100, 100)
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando rifas disponíveis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Rifas Disponíveis
            </h1>
            <p className="text-xl text-purple-100">
              Participe e concorra a prêmios incríveis!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar rifas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Todos os preços</option>
                <option value="under10">Até R$ 10</option>
                <option value="10to25">R$ 10 - R$ 25</option>
                <option value="25to50">R$ 25 - R$ 50</option>
                <option value="above50">Acima de R$ 50</option>
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="recent">Mais recentes</option>
                <option value="ending">Terminando em breve</option>
                <option value="popular">Mais populares</option>
                <option value="price_low">Menor preço</option>
                <option value="price_high">Maior preço</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredRaffles.length} {filteredRaffles.length === 1 ? 'rifa encontrada' : 'rifas encontradas'}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={loadRaffles}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : filteredRaffles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma rifa encontrada
            </h3>
            <p className="text-gray-600">
              {searchTerm || priceFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Não há rifas ativas no momento'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRaffles.map((raffle) => {
              const progress = calculateProgress(raffle)
              const daysRemaining = getDaysRemaining(raffle.endDate)
              
              return (
                <div
                  key={raffle.id}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={raffle.imageUrl || 'https://via.placeholder.com/400x300'}
                      alt={raffle.prizeTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://via.placeholder.com/400x300?text=Imagem+não+disponível'
                      }}
                    />
                    {daysRemaining <= 3 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {daysRemaining === 0 ? 'Último dia!' : `${daysRemaining} dias restantes`}
                      </div>
                    )}
                    {progress >= 80 && (
                      <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Quase esgotado!
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                      {raffle.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {raffle.prizeTitle}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Ticket className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-gray-600">Valor do bilhete</span>
                        </div>
                        <span className="font-bold text-lg text-purple-600">
                          R$ {raffle.ticketPrice.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Vendidos</span>
                        </div>
                        <span className="text-sm font-medium">
                          {raffle.soldTickets || 0}/{raffle.numberOfTickets}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Termina em</span>
                        </div>
                        <span className="text-sm font-medium">
                          {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {progress.toFixed(0)}% vendido
                      </p>
                    </div>

                    <Link
                      to={`/raffle/${raffle.id}`}
                      className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 group"
                    >
                      Ver Detalhes
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {!loading && !error && filteredRaffles.length > 0 && (
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Quer criar sua própria rifa?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Cadastre-se gratuitamente e comece a arrecadar hoje mesmo!
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Criar Conta Grátis
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}