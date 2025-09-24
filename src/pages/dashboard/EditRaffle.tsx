import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  Ticket,
  Palette
} from 'lucide-react'
import { raffleService, Raffle } from '../../services/api'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/ImageUpload'
import ThemeCustomizer from '../../components/ThemeCustomizer'

interface RaffleFormData {
  title: string
  description: string
  type: string | number
  images: string[]
  startDate: string
  endDate: string
  terms: string
  ticketPrice: number
  maxTicketPerUser: number
  maxParticipants: number
  paymentMethod: string | number
  status: string | number
  numberOfTickets: number
  theme: any
}

export default function EditRaffle() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingRaffle, setIsLoadingRaffle] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5
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
    paymentMethod: 'pix',
    status: 'Draft',
    numberOfTickets: 100,
    theme: {
      primaryColor: '#DC2626',
      secondaryColor: '#000000',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      gradientEnabled: true,
      gradientType: 'linear',
      gradientAngle: 45,
      gradientColors: ['#DC2626', '#F59E0B'],
      fontFamily: 'Inter',
      headingFont: 'Poppins',
      fontSize: 'medium',
      buttonStyle: 'rounded',
      buttonEffect: 'shadow',
      animations: true,
      animationSpeed: 'normal',
      particleEffects: false,
      borderRadius: 8,
      spacing: 'normal',
      pattern: 'none',
      patternOpacity: 0.1,
      specialIcon: 'star'
    }
  })

  const steps = [
    { number: 1, title: 'Básico', icon: FileText, description: 'Nome e descrição' },
    { number: 2, title: 'Imagens', icon: Image, description: 'Fotos da rifa' },
    { number: 3, title: 'Datas', icon: Calendar, description: 'Período da rifa' },
    { number: 4, title: 'Valores', icon: DollarSign, description: 'Preços e limites' },
    { number: 5, title: 'Tema', icon: Palette, description: 'Personalização visual' }
  ]

  useEffect(() => {
    if (id) {
      loadRaffle()
    }
  }, [id])
  

  const loadRaffle = async () => {
    try {
      const raffle = await raffleService.getById(id!)
      
      // Converter status numérico para string se necessário
      const getStatusString = (status: string | number): string => {
        if (typeof status === 'number') {
          switch (status) {
            case 0: return 'Draft'
            case 1: return 'Active'
            case 2: return 'Finished'
            case 3: return 'Cancelled'
            default: return 'Draft'
          }
        }
        return status
      }
      
      // Função para formatar data para datetime-local input
      const formatDateForInput = (dateString: string | null | undefined, isStartDate: boolean = false): string => {
        // Se não tem data ou é a data padrão do C#, define uma data padrão razoável
        if (!dateString || dateString.startsWith('0001-')) {
          
          const now = new Date()
          let defaultDate: Date
          
          if (isStartDate) {
            // Para data de início, usa a data/hora atual
            defaultDate = now
          } else {
            // Para data de fim, usa 7 dias a partir de agora
            defaultDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
          }
          
          const year = defaultDate.getFullYear()
          const month = String(defaultDate.getMonth() + 1).padStart(2, '0')
          const day = String(defaultDate.getDate()).padStart(2, '0')
          const hours = String(defaultDate.getHours()).padStart(2, '0')
          const minutes = String(defaultDate.getMinutes()).padStart(2, '0')
          
          const formatted = `${year}-${month}-${day}T${hours}:${minutes}`
          return formatted
        }
        
        try {
          const date = new Date(dateString)
          
          // Verifica se a data é válida
          if (isNaN(date.getTime())) {
            const now = new Date()
            const defaultDate = isStartDate ? now : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
            
            const year = defaultDate.getFullYear()
            const month = String(defaultDate.getMonth() + 1).padStart(2, '0')
            const day = String(defaultDate.getDate()).padStart(2, '0')
            const hours = String(defaultDate.getHours()).padStart(2, '0')
            const minutes = String(defaultDate.getMinutes()).padStart(2, '0')
            
            return `${year}-${month}-${day}T${hours}:${minutes}`
          }
          
          // Formata para yyyy-MM-ddTHH:mm
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          const hours = String(date.getHours()).padStart(2, '0')
          const minutes = String(date.getMinutes()).padStart(2, '0')
          
          const formatted = `${year}-${month}-${day}T${hours}:${minutes}`
          return formatted
        } catch (error) {
          // Em caso de erro, retorna data padrão
          const now = new Date()
          const defaultDate = isStartDate ? now : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
          
          const year = defaultDate.getFullYear()
          const month = String(defaultDate.getMonth() + 1).padStart(2, '0')
          const day = String(defaultDate.getDate()).padStart(2, '0')
          const hours = String(defaultDate.getHours()).padStart(2, '0')
          const minutes = String(defaultDate.getMinutes()).padStart(2, '0')
          
          return `${year}-${month}-${day}T${hours}:${minutes}`
        }
      }
      
      const newFormData = {
        title: raffle.title || '',
        description: raffle.description || '',
        type: raffle.type || 'product',
        images: raffle.images || [],
        startDate: formatDateForInput(raffle.startDate, true),
        endDate: formatDateForInput(raffle.endDate, false),
        terms: raffle.terms || '',
        ticketPrice: Number(raffle.ticketPrice) || 0, // Usar o valor do banco, 0 se não existir
        maxTicketPerUser: Number(raffle.maxTicketPerUser) || 0,
        maxParticipants: Number(raffle.maxParticipants) || 0,
        paymentMethod: raffle.paymentMethod || 'pix',
        status: getStatusString(raffle.status),
        numberOfTickets: Number(raffle.numberOfTickets) || 0,
        theme: raffle.themeConfig ? 
          JSON.parse(raffle.themeConfig) : 
          {
            primaryColor: '#DC2626',
            secondaryColor: '#000000',
            accentColor: '#F59E0B',
            backgroundColor: '#FFFFFF',
            textColor: '#1F2937',
            gradientEnabled: true,
            gradientType: 'linear',
            gradientAngle: 45,
            gradientColors: ['#DC2626', '#F59E0B'],
            fontFamily: 'Inter',
            headingFont: 'Poppins',
            fontSize: 'medium',
            buttonStyle: 'rounded',
            buttonEffect: 'shadow',
            animations: true,
            animationSpeed: 'normal',
            particleEffects: false,
            borderRadius: 8,
            spacing: 'normal',
            pattern: 'none',
            patternOpacity: 0.1,
            specialIcon: 'star'
          }
      }
      
      setFormData(newFormData)
    } catch (error) {
      toast.error('Erro ao carregar rifa')
      navigate('/dashboard/raffles')
    } finally {
      setIsLoadingRaffle(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ticketPrice' || name === 'maxTicketPerUser' || name === 'maxParticipants' 
        ? parseFloat(value) || 0 
        : value
    }))
  }

  const handleImageChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: images
    }))
  }

  const handleThemeChange = (theme: any) => {
    setFormData(prev => ({
      ...prev,
      theme: theme
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      setCurrentStep(1)
      return
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error('Por favor, defina as datas de início e término')
      setCurrentStep(3)
      return
    }

    // Só validar preço se estiver vazio ou zero
    if (!formData.ticketPrice || formData.ticketPrice <= 0) {
      toast.error('Por favor, defina um valor válido para o bilhete')
      setCurrentStep(4)
      return
    }

    setIsLoading(true)
    try {
      // Converter status para número antes de enviar
      const getStatusNumber = (status: string | number): number => {
        if (typeof status === 'string') {
          switch (status) {
            case 'Draft': return 0
            case 'Active': return 1
            case 'Finished': return 2
            case 'Cancelled': return 3
            default: return 0
          }
        }
        return status
      }
      
      // Formatar datas para ISO 8601 antes de enviar
      const formatDateForBackend = (dateString: string): string => {
        if (!dateString) return new Date().toISOString()
        const date = new Date(dateString)
        return date.toISOString()
      }
      
      const dataToSend = {
        ...formData,
        startDate: formatDateForBackend(formData.startDate),
        endDate: formatDateForBackend(formData.endDate),
        status: getStatusNumber(formData.status),
        type: typeof formData.type === 'string' ? 0 : formData.type, // Converter type também
        paymentMethod: typeof formData.paymentMethod === 'string' ? 0 : formData.paymentMethod,
        themeConfig: JSON.stringify(formData.theme) // Convert theme object to JSON string for backend
      }
      delete dataToSend.theme // Remove theme object as we're sending themeConfig instead
      
      await raffleService.update(id!, dataToSend)
      toast.success('Rifa atualizada com sucesso!')
      navigate('/dashboard/raffles')
    } catch (error) {
      toast.error('Erro ao atualizar rifa')
    } finally {
      setIsLoading(false)
    }
  }

  const handleActivate = async () => {
    if (!formData.title || !formData.description || !formData.startDate || !formData.endDate || formData.ticketPrice <= 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios antes de ativar')
      return
    }

    setIsLoading(true)
    try {
      const dataToSend = {
        ...formData,
        status: 1, // Active = 1
        type: typeof formData.type === 'string' ? 0 : formData.type,
        paymentMethod: typeof formData.paymentMethod === 'string' ? 0 : formData.paymentMethod,
        themeConfig: JSON.stringify(formData.theme) // Convert theme object to JSON string for backend
      }
      delete dataToSend.theme // Remove theme object as we're sending themeConfig instead
      await raffleService.update(id!, dataToSend)
      toast.success('Rifa ativada com sucesso!')
      navigate('/dashboard/raffles')
    } catch (error) {
      toast.error('Erro ao ativar rifa')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingRaffle) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-gray-900">Editar Rifa</h1>
            <p className="text-gray-600 mt-1">Atualize os detalhes da sua rifa</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn btn-white btn-md"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </button>
          {formData.status === 'Draft' && (
            <button
              onClick={handleActivate}
              disabled={isLoading}
              className="btn btn-primary btn-md"
            >
              <Ticket className="w-4 h-4 mr-2" />
              Ativar Rifa
            </button>
          )}
        </div>
      </div>

      {formData.status && (
        <div className="mb-6">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold
            ${formData.status === 'Active' ? 'bg-success-100 text-success-700' : ''}
            ${formData.status === 'Draft' ? 'bg-gray-100 text-gray-700' : ''}
            ${formData.status === 'Finished' ? 'bg-primary-100 text-primary-700' : ''}
            ${formData.status === 'Cancelled' ? 'bg-danger-100 text-danger-700' : ''}
          `}>
            Status: {formData.status === 'Active' ? 'Ativa' : 
                    formData.status === 'Draft' ? 'Rascunho' :
                    formData.status === 'Finished' ? 'Finalizada' :
                    formData.status === 'Cancelled' ? 'Cancelada' : formData.status}
          </span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {steps[currentStep - 1].title}
            </h2>
            <span className="text-sm text-gray-500">
              Passo {currentStep} de {totalSteps}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                    ${currentStep >= step.number
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {currentStep > step.number ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <div className="ml-2 text-sm">
                  <div className={`font-medium ${currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'}`}>
                    {step.title}
                  </div>
                  <div className="text-gray-400 text-xs">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`ml-4 w-12 h-0.5 ${currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {currentStep === 1 && (
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

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagens da Rifa
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Faça upload de até 5 imagens para sua rifa. A primeira imagem será usada como principal.
                </p>
                <ImageUpload
                  images={formData.images}
                  onChange={handleImageChange}
                  maxImages={5}
                  maxFileSize={5 * 1024 * 1024}
                  showPreview={true}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
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

          {currentStep === 4 && (
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

              <div>
                <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-2">
                  Termos e Condições
                </label>
                <textarea
                  id="terms"
                  name="terms"
                  value={formData.terms}
                  onChange={handleInputChange}
                  rows={6}
                  className="input"
                  placeholder="Descreva as regras, termos e condições da sua rifa..."
                />
              </div>
            </div>
          )}


          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Personalização do Tema da Rifa
                </label>
                <p className="text-sm text-gray-500 mb-6">
                  Configure cores, tipografia, efeitos e layout para criar uma experiência única para os participantes.
                </p>
                <ThemeCustomizer
                  theme={formData.theme}
                  onChange={handleThemeChange}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                ${currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }
              `}
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>

            <div className="flex items-center gap-3">
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary btn-lg flex items-center gap-2"
                >
                  Próximo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary btn-lg flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar Alterações
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}