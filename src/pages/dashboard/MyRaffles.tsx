import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Eye, Edit2, Trash2, Copy, Calendar, Users, DollarSign } from 'lucide-react'
import { raffleService, Raffle } from '../../services/api'
import toast from 'react-hot-toast'

export default function MyRaffles() {
  const [raffles, setRaffles] = useState<Raffle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadRaffles()
  }, [])

  const loadRaffles = async () => {
    try {
      const data = await raffleService.getAll()
      setRaffles(data)
    } catch (error) {
      toast.error('Erro ao carregar rifas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta rifa?')) return
    
    try {
      await raffleService.delete(id)
      toast.success('Rifa excluída com sucesso!')
      loadRaffles()
    } catch (error) {
      toast.error('Erro ao excluir rifa')
    }
  }

  const handleDuplicate = async (raffle: Raffle) => {
    try {
      const newRaffle = {
        ...raffle,
        title: `${raffle.title} (Cópia)`,
        status: 'Draft' as const
      }
      await raffleService.create(newRaffle)
      toast.success('Rifa duplicada com sucesso!')
      loadRaffles()
    } catch (error) {
      toast.error('Erro ao duplicar rifa')
    }
  }

  const filteredRaffles = raffles.filter(raffle => {
    const matchesSearch = raffle.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || raffle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-success-100 text-success-700'
      case 'Draft': return 'bg-gray-100 text-gray-700'
      case 'Finished': return 'bg-primary-100 text-primary-700'
      case 'Cancelled': return 'bg-danger-100 text-danger-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Active': return 'Ativa'
      case 'Draft': return 'Rascunho'
      case 'Finished': return 'Finalizada'
      case 'Cancelled': return 'Cancelada'
      default: return status
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Rifas</h1>
          <p className="text-gray-600 mt-2">Gerencie suas rifas e acompanhe o desempenho</p>
        </div>
        <Link
          to="/dashboard/raffles/create"
          className="mt-4 sm:mt-0 btn btn-primary btn-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Criar Nova Rifa
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar rifas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Todos os status</option>
              <option value="Draft">Rascunho</option>
              <option value="Active">Ativa</option>
              <option value="Finished">Finalizada</option>
              <option value="Cancelled">Cancelada</option>
            </select>
          </div>
        </div>
      </div>

      {filteredRaffles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Filter className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma rifa encontrada</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando sua primeira rifa'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link
              to="/dashboard/raffles/create"
              className="btn btn-primary btn-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Primeira Rifa
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRaffles.map((raffle) => (
            <div key={raffle.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-600 relative">
                {raffle.images?.[0] ? (
                  <img src={raffle.images[0]} alt={raffle.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Calendar className="w-12 h-12 text-white/50" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(raffle.status)}`}>
                    {getStatusLabel(raffle.status)}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{raffle.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{raffle.description}</p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <DollarSign className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Valor</p>
                    <p className="text-sm font-semibold">R$ {raffle.ticketPrice?.toFixed(2) || '0,00'}</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Participantes</p>
                    <p className="text-sm font-semibold">0</p>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Término</p>
                    <p className="text-sm font-semibold">
                      {raffle.endDate ? new Date(raffle.endDate).toLocaleDateString('pt-BR') : '-'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/raffle/${raffle.id}`}
                    className="flex-1 btn btn-sm btn-ghost justify-center"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/dashboard/raffles/${raffle.id}/edit`}
                    className="flex-1 btn btn-sm btn-ghost justify-center"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDuplicate(raffle)}
                    className="flex-1 btn btn-sm btn-ghost justify-center"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(raffle.id)}
                    className="flex-1 btn btn-sm btn-ghost justify-center text-danger-600 hover:text-danger-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}