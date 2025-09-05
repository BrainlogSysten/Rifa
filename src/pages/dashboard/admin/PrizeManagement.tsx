import { useState, useEffect } from 'react'
import {
  Gift,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  X,
  Save,
  Upload,
  DollarSign,
  Package,
} from 'lucide-react'
import { prizeService, raffleService, Prize, Raffle } from '../../../services/api'
import toast from 'react-hot-toast'

interface PrizeFormData {
  title: string
  description: string
  value: number
  imageUrl: string
  quantity: number
  type: string
  raffleId: string
}

const initialFormData: PrizeFormData = {
  title: '',
  description: '',
  value: 0,
  imageUrl: '',
  quantity: 1,
  type: 'physical',
  raffleId: ''
}

export default function PrizeManagement() {
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [raffles, setRaffles] = useState<Raffle[]>([])
  const [filteredPrizes, setFilteredPrizes] = useState<Prize[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null)
  const [formData, setFormData] = useState<PrizeFormData>(initialFormData)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRaffle, setFilterRaffle] = useState('')
  const [filterType, setFilterType] = useState('')

  useEffect(() => {
    loadPrizes()
    loadRaffles()
  }, [])

  useEffect(() => {
    filterPrizes()
  }, [prizes, searchTerm, filterRaffle, filterType])

  const loadPrizes = async () => {
    try {
      setIsLoading(true)
      const data = await prizeService.getAll()
      setPrizes(data)
    } catch (error) {
      console.error('Error loading prizes:', error)
      toast.error('Erro ao carregar prêmios')
    } finally {
      setIsLoading(false)
    }
  }

  const loadRaffles = async () => {
    try {
      const data = await raffleService.getAll()
      setRaffles(data)
    } catch (error) {
      console.error('Error loading raffles:', error)
    }
  }

  const filterPrizes = () => {
    let filtered = prizes

    if (searchTerm) {
      filtered = filtered.filter(prize =>
        prize.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prize.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterRaffle) {
      filtered = filtered.filter(prize => prize.raffleId === filterRaffle)
    }

    if (filterType) {
      filtered = filtered.filter(prize => prize.type === filterType)
    }

    setFilteredPrizes(filtered)
  }

  const handleAddPrize = () => {
    setEditingPrize(null)
    setFormData(initialFormData)
    setIsModalOpen(true)
  }

  const handleEditPrize = (prize: Prize) => {
    setEditingPrize(prize)
    setFormData({
      title: prize.title,
      description: prize.description,
      value: prize.value,
      imageUrl: prize.imageUrl,
      quantity: prize.quantity,
      type: prize.type,
      raffleId: prize.raffleId
    })
    setIsModalOpen(true)
  }

  const handleDeletePrize = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este prêmio?')) {
      return
    }

    try {
      await prizeService.delete(id)
      toast.success('Prêmio deletado com sucesso')
      loadPrizes()
    } catch (error) {
      console.error('Error deleting prize:', error)
      toast.error('Erro ao deletar prêmio')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingPrize) {
        await prizeService.update(editingPrize.id, formData)
        toast.success('Prêmio atualizado com sucesso')
      } else {
        await prizeService.create(formData)
        toast.success('Prêmio criado com sucesso')
      }
      
      setIsModalOpen(false)
      loadPrizes()
    } catch (error) {
      console.error('Error saving prize:', error)
      toast.error('Erro ao salvar prêmio')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPrize(null)
    setFormData(initialFormData)
  }

  const getRaffleName = (raffleId: string) => {
    const raffle = raffles.find(r => r.id === raffleId)
    return raffle?.title || 'Sem rifa'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const prizeTypes = [
    { value: 'physical', label: 'Físico' },
    { value: 'digital', label: 'Digital' },
    { value: 'money', label: 'Dinheiro' },
    { value: 'service', label: 'Serviço' }
  ]

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-gray-200 rounded-lg h-96"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Prêmios</h1>
          <p className="text-gray-600">Gerencie todos os prêmios das rifas</p>
        </div>
        <button
          onClick={handleAddPrize}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Prêmio</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar prêmios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterRaffle}
            onChange={(e) => setFilterRaffle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todas as rifas</option>
            {raffles.map(raffle => (
              <option key={raffle.id} value={raffle.id}>
                {raffle.title}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos os tipos</option>
            {prizeTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredPrizes.length === 0 ? (
          <div className="text-center py-12">
            <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum prêmio encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prêmio
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rifa
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrizes.map((prize) => (
                  <tr key={prize.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={prize.imageUrl || '/placeholder-prize.png'}
                            alt={prize.title}
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-prize.png'
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {prize.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {prize.description.length > 50
                              ? `${prize.description.substring(0, 50)}...`
                              : prize.description
                            }
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                        {formatCurrency(prize.value)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Package className="h-4 w-4 mr-1 text-blue-500" />
                        {prize.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        prize.type === 'physical' ? 'bg-blue-100 text-blue-800' :
                        prize.type === 'digital' ? 'bg-green-100 text-green-800' :
                        prize.type === 'money' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {prizeTypes.find(t => t.value === prize.type)?.label || prize.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getRaffleName(prize.raffleId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditPrize(prize)}
                        className="text-purple-600 hover:text-purple-900 mr-3"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePrize(prize.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleCloseModal}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editingPrize ? 'Editar Prêmio' : 'Novo Prêmio'}
                    </h3>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Prêmio
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ex: Smartphone Premium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                      </label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Descreva o prêmio em detalhes..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Valor (R$)
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={formData.value}
                          onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantidade
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo do Prêmio
                      </label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {prizeTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Associar à Rifa
                      </label>
                      <select
                        required
                        value={formData.raffleId}
                        onChange={(e) => setFormData({ ...formData, raffleId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Selecione uma rifa</option>
                        {raffles.map(raffle => (
                          <option key={raffle.id} value={raffle.id}>
                            {raffle.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL da Imagem
                      </label>
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingPrize ? 'Atualizar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}