import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  Image, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText,
  Plus,
  X,
  Upload,
  Ticket
} from 'lucide-react'
import { raffleService } from '../../services/api'
import toast from 'react-hot-toast'

interface RaffleFormData {
  title: string
  description: string
  type: string
  images: string[]
  startDate: string
  endDate: string
  terms: string
  ticketPrice: number
  maxTicketPerUser: number
  maxParticipants: number
  paymentMethod: string
}

export default function CreateRaffle() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [formData, setFormData] = useState<RaffleFormData>({
    title: '',
    description: '',
    type: 'product',
    images: [],
    startDate: '',
    endDate: '',
    terms: '',
    ticketPrice: 0,
    maxTicketPerUser: 0,
    maxParticipants: 0,
    paymentMethod: 'pix'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ticketPrice' || name === 'maxTicketPerUser' || name === 'maxParticipants' 
        ? parseFloat(value) || 0 
        : value
    }))
  }

  const handleImageAdd = (url: string) => {
    if (url && !formData.images.includes(url)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }))
    }
  }

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      setActiveTab('basic')
      return
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error('Por favor, defina as datas de início e término')
      setActiveTab('dates')
      return
    }

    if (formData.ticketPrice <= 0) {
      toast.error('Por favor, defina um valor válido para o bilhete')
      setActiveTab('pricing')
      return
    }

    setIsLoading(true)
    try {
      const raffleData = {
        ...formData,
        status: 'Draft'
      }
      await raffleService.create(raffleData)
      toast.success('Rifa criada com sucesso!')
      navigate('/dashboard/raffles')
    } catch (error) {
      toast.error('Erro ao criar rifa')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAndPublish = async () => {
    if (!formData.title || !formData.description || !formData.startDate || !formData.endDate || formData.ticketPrice <= 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios antes de publicar')
      return
    }

    setIsLoading(true)
    try {
      const raffleData = {
        ...formData,
        status: 'Active'
      }
      await raffleService.create(raffleData)
      toast.success('Rifa criada e publicada com sucesso!')
      navigate('/dashboard/raffles')
    } catch (error) {
      toast.error('Erro ao criar e publicar rifa')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/raffles')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Criar Nova Rifa</h1>
            <p className="text-gray-600 mt-1">Configure todos os detalhes da sua rifa</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn btn-white btn-md"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Rascunho
          </button>
          <button
            onClick={handleSaveAndPublish}
            disabled={isLoading}
            className="btn btn-primary btn-md"
          >
            <Ticket className="w-4 h-4 mr-2" />
            Salvar e Publicar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'basic', label: 'Informações Básicas', icon: FileText },
              { id: 'images', label: 'Imagens', icon: Image },
              { id: 'dates', label: 'Datas', icon: Calendar },
              { id: 'pricing', label: 'Preços e Limites', icon: DollarSign },
              { id: 'rules', label: 'Regras e Termos', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Título da Rifa *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Ex: Rifa do iPhone 15 Pro Max"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="input"
                  placeholder="Descreva detalhadamente o prêmio e como funcionará a rifa"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Rifa
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="product">Produto</option>
                  <option value="service">Serviço</option>
                  <option value="experience">Experiência</option>
                  <option value="money">Dinheiro</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagens da Rifa
                </label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Cole a URL da imagem aqui"
                      className="input flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const input = e.target as HTMLInputElement
                          handleImageAdd(input.value)
                          input.value = ''
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary btn-md"
                      onClick={() => {
                        const input = document.querySelector('input[type="url"]') as HTMLInputElement
                        if (input) {
                          handleImageAdd(input.value)
                          input.value = ''
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {formData.images.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Adicione URLs de imagens para sua rifa</p>
                      <p className="text-sm text-gray-500 mt-1">Recomendamos pelo menos 3 imagens</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Imagem ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'https://via.placeholder.com/300x200?text=Erro+ao+carregar'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleImageRemove(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dates' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Início *
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Término *
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="bg-primary-50 rounded-lg p-4">
                <p className="text-sm text-primary-700">
                  <strong>Dica:</strong> Rifas com duração entre 7 a 30 dias costumam ter melhor desempenho.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Valor do Bilhete (R$) *
                  </label>
                  <input
                    type="number"
                    id="ticketPrice"
                    name="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pagamento
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="pix">PIX</option>
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="boleto">Boleto</option>
                    <option value="all">Todos</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="maxTicketPerUser" className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de Bilhetes por Usuário
                  </label>
                  <input
                    type="number"
                    id="maxTicketPerUser"
                    name="maxTicketPerUser"
                    value={formData.maxTicketPerUser}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="0 = Sem limite"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Deixe 0 para sem limite</p>
                </div>

                <div>
                  <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                    Número Máximo de Participantes
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="0 = Sem limite"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Deixe 0 para sem limite</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-2">
                  Termos e Condições
                </label>
                <textarea
                  id="terms"
                  name="terms"
                  value={formData.terms}
                  onChange={handleInputChange}
                  rows={8}
                  className="input"
                  placeholder="Descreva as regras, termos e condições da sua rifa..."
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Sugestões de conteúdo:</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Como será realizado o sorteio</li>
                  <li>Data e hora do sorteio</li>
                  <li>Como o vencedor será notificado</li>
                  <li>Prazo para retirada do prêmio</li>
                  <li>Documentos necessários</li>
                  <li>Restrições de participação</li>
                </ul>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}