import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Image,
  Calendar,
  DollarSign,
  FileText,
  Gift,
  Ticket,
  Sparkles,
  AlertCircle,
  Palette
} from 'lucide-react'
import { raffleService } from '../../services/api'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/ImageUpload'
import ThemeCustomizer from '../../components/ThemeCustomizer'

interface RaffleFormData {
  title: string
  description: string
  images: string[]
  terms: string
  ticketPrice: number
  maxTicketPerUser: number
  numberOfTickets: number
  startDate: string
  endDate: string
  paymentMethod: string
  type: string
  theme: any
}

export default function CreateRaffleSimple() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const totalSteps = 5

  // Função para obter data/hora formatada para input datetime-local
  const getDefaultDateTime = (daysToAdd: number = 0): string => {
    const date = new Date()
    if (daysToAdd > 0) {
      date.setDate(date.getDate() + daysToAdd)
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const [formData, setFormData] = useState<RaffleFormData>({
    title: '',
    description: '',
    images: [],
    terms: '',
    ticketPrice: 10,
    maxTicketPerUser: 10,
    numberOfTickets: 100,
    startDate: getDefaultDateTime(),
    endDate: getDefaultDateTime(30),
    paymentMethod: 'pix',
    type: 'product',
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

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ticketPrice' || name === 'numberOfTickets' || name === 'maxTicketPerUser'
        ? parseFloat(value) || 0
        : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }))
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }))
    }
  }

  const handleThemeChange = (theme: any) => {
    setFormData(prev => ({ ...prev, theme }))
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch(step) {
      case 1: // Informações Básicas
        if (!formData.title.trim()) {
          newErrors.title = 'Digite o nome da rifa'
        }
        if (!formData.description.trim()) {
          newErrors.description = 'Descreva a rifa'
        }
        break

      case 2: // Imagens
        if (!formData.images || formData.images.length === 0) {
          newErrors.images = 'Adicione pelo menos uma imagem'
        }
        break

      case 3: // Configurações
        if (formData.ticketPrice <= 0) {
          newErrors.ticketPrice = 'O preço do bilhete deve ser maior que zero'
        }
        if (formData.numberOfTickets <= 0) {
          newErrors.numberOfTickets = 'O número de bilhetes deve ser maior que zero'
        }
        if (formData.maxTicketPerUser <= 0) {
          newErrors.maxTicketPerUser = 'O limite por usuário deve ser maior que zero'
        }
        break

      case 4: // Datas
        if (!formData.startDate) {
          newErrors.startDate = 'Defina a data de início'
        }
        if (!formData.endDate) {
          newErrors.endDate = 'Defina a data de término'
        }
        if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
          newErrors.endDate = 'A data de término deve ser após a data de início'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsLoading(true)
    try {
      const raffleData = {
        title: formData.title,
        description: formData.description,
        type: formData.type === 'product' ? 0 : 1,
        images: formData.images,
        startDate: formData.startDate,
        endDate: formData.endDate,
        terms: formData.terms || 'Consulte os termos gerais da plataforma.',
        ticketPrice: formData.ticketPrice,
        maxTicketPerUser: formData.maxTicketPerUser,
        maxParticipants: formData.numberOfTickets,
        numberOfTickets: formData.numberOfTickets,
        paymentMethod: formData.paymentMethod === 'pix' ? 0 : formData.paymentMethod === 'credit_card' ? 1 : 2,
        status: 0, // Draft
        themeConfig: JSON.stringify(formData.theme)
      }

      const response = await raffleService.create(raffleData)
      toast.success('Rifa criada com sucesso!')
      navigate(`/dashboard/admin/raffles/${response.id}/edit`)
    } catch (error: any) {
      console.error('Erro ao criar rifa:', error)
      toast.error(error.response?.data?.message || 'Erro ao criar rifa')
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Básico', icon: FileText, description: 'Nome e descrição' },
    { number: 2, title: 'Imagens', icon: Image, description: 'Fotos da rifa' },
    { number: 3, title: 'Valores', icon: DollarSign, description: 'Preços e quantidade' },
    { number: 4, title: 'Datas', icon: Calendar, description: 'Período da rifa' },
    { number: 5, title: 'Tema', icon: Palette, description: 'Personalização visual' }
  ]

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Gift className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Informações Básicas</h2>
              <p className="text-gray-600">Vamos começar com o nome e descrição da sua rifa</p>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Rifa *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: iPhone 15 Pro Max 256GB"
                className={`input ${errors.title ? 'border-red-500' : ''}`}
                maxLength={100}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
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
                placeholder="Descreva a rifa, o prêmio e seus diferenciais..."
                className={`input resize-none ${errors.description ? 'border-red-500' : ''}`}
                maxLength={500}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              <p className="mt-1 text-sm text-gray-500">{formData.description.length}/500 caracteres</p>
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
                <option value="product">Produto Físico</option>
                <option value="service">Serviço/Digital</option>
              </select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Image className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Imagens da Rifa</h2>
              <p className="text-gray-600">Adicione fotos atrativas do prêmio para atrair mais participantes</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagens do Prêmio *
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Adicione até 5 imagens. A primeira será usada como capa.
              </p>
              <ImageUpload
                images={formData.images}
                onChange={handleImageChange}
                maxImages={5}
                maxFileSize={5 * 1024 * 1024}
                showPreview={true}
              />
              {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <DollarSign className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Valores e Quantidade</h2>
              <p className="text-gray-600">Defina o preço dos bilhetes e quantos estarão disponíveis</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Preço do Bilhete (R$) *
                </label>
                <input
                  type="number"
                  id="ticketPrice"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0.01"
                  className={`input ${errors.ticketPrice ? 'border-red-500' : ''}`}
                />
                {errors.ticketPrice && <p className="mt-1 text-sm text-red-600">{errors.ticketPrice}</p>}
              </div>

              <div>
                <label htmlFor="numberOfTickets" className="block text-sm font-medium text-gray-700 mb-2">
                  Total de Bilhetes *
                </label>
                <input
                  type="number"
                  id="numberOfTickets"
                  name="numberOfTickets"
                  value={formData.numberOfTickets}
                  onChange={handleInputChange}
                  min="1"
                  className={`input ${errors.numberOfTickets ? 'border-red-500' : ''}`}
                />
                {errors.numberOfTickets && <p className="mt-1 text-sm text-red-600">{errors.numberOfTickets}</p>}
              </div>

              <div>
                <label htmlFor="maxTicketPerUser" className="block text-sm font-medium text-gray-700 mb-2">
                  Limite por Usuário *
                </label>
                <input
                  type="number"
                  id="maxTicketPerUser"
                  name="maxTicketPerUser"
                  value={formData.maxTicketPerUser}
                  onChange={handleInputChange}
                  min="1"
                  className={`input ${errors.maxTicketPerUser ? 'border-red-500' : ''}`}
                />
                {errors.maxTicketPerUser && <p className="mt-1 text-sm text-red-600">{errors.maxTicketPerUser}</p>}
                <p className="mt-1 text-sm text-gray-500">Máximo de bilhetes que um usuário pode comprar</p>
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
                  <option value="both">PIX e Cartão</option>
                </select>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">Resumo Financeiro</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-700">Arrecadação máxima:</span>
                  <span className="font-medium text-purple-900">
                    R$ {(formData.ticketPrice * formData.numberOfTickets).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Valor por bilhete:</span>
                  <span className="font-medium text-purple-900">R$ {formData.ticketPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Total de bilhetes:</span>
                  <span className="font-medium text-purple-900">{formData.numberOfTickets}</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Calendar className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Período da Rifa</h2>
              <p className="text-gray-600">Defina quando a rifa começará e terminará</p>
            </div>

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
                  className={`input ${errors.startDate ? 'border-red-500' : ''}`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
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
                  className={`input ${errors.endDate ? 'border-red-500' : ''}`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-2">
                Termos e Condições (Opcional)
              </label>
              <textarea
                id="terms"
                name="terms"
                value={formData.terms}
                onChange={handleInputChange}
                rows={4}
                placeholder="Regras específicas desta rifa (opcional)"
                className="input resize-none"
                maxLength={1000}
              />
              <p className="mt-1 text-sm text-gray-500">
                Se não preenchido, serão usados os termos gerais da plataforma
              </p>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Palette className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Personalização Visual</h2>
              <p className="text-gray-600">Customize as cores e estilo da página da sua rifa</p>
            </div>

            <ThemeCustomizer
              theme={formData.theme}
              onChange={handleThemeChange}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar ao Dashboard
            </button>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">Criar Nova Rifa</h1>
              <p className="text-gray-600">Passo {currentStep} de {totalSteps}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                  ${currentStep >= step.number
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                `}>
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3 hidden md:block">
                  <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-purple-600' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    ml-4 md:ml-8 w-8 md:w-16 h-0.5 transition-colors
                    ${currentStep > step.number ? 'bg-purple-600' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Próximo
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Criar Rifa
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}