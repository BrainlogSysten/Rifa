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
  AlertCircle
} from 'lucide-react'
import { raffleService } from '../../services/api'
import toast from 'react-hot-toast'

interface RaffleFormData {
  title: string
  description: string
  prizeTitle: string
  prizeDescription: string
  imageUrl: string
  ticketPrice: number
  numberOfTickets: number
  startDate: string
  endDate: string
}

export default function CreateRaffleSimple() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const totalSteps = 4
  
  const [formData, setFormData] = useState<RaffleFormData>({
    title: '',
    description: '',
    prizeTitle: '',
    prizeDescription: '',
    imageUrl: '',
    ticketPrice: 10,
    numberOfTickets: 100,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ticketPrice' || name === 'numberOfTickets' 
        ? parseFloat(value) || 0 
        : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}
    
    switch(step) {
      case 1:
        if (!formData.prizeTitle.trim()) {
          newErrors.prizeTitle = 'Digite o nome do prêmio'
        }
        if (!formData.prizeDescription.trim()) {
          newErrors.prizeDescription = 'Descreva o prêmio'
        }
        if (!formData.imageUrl.trim()) {
          newErrors.imageUrl = 'Adicione uma imagem do prêmio (obrigatório)'
        }
        break
      
      case 2:
        if (!formData.title.trim()) {
          newErrors.title = 'Dê um título para sua rifa'
        }
        if (!formData.description.trim()) {
          newErrors.description = 'Adicione uma descrição'
        }
        break
      
      case 3:
        if (formData.ticketPrice <= 0) {
          newErrors.ticketPrice = 'O valor deve ser maior que zero'
        }
        if (formData.numberOfTickets <= 0) {
          newErrors.numberOfTickets = 'Quantidade deve ser maior que zero'
        }
        break
      
      case 4:
        if (!formData.startDate) {
          newErrors.startDate = 'Selecione a data de início'
        }
        if (!formData.endDate) {
          newErrors.endDate = 'Selecione a data de término'
        }
        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
          newErrors.endDate = 'A data de término deve ser após o início'
        }
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return
    }

    setIsLoading(true)
    try {
      const defaultImage = 'https://via.placeholder.com/400x300?text=Rifa'
      const raffleData = {
        title: formData.title || 'Sem título',
        description: formData.description || 'Sem descrição',
        prizeTitle: formData.prizeTitle || 'Prêmio',
        prizeDescription: formData.prizeDescription || 'Descrição do prêmio',
        coverImageUrl: formData.imageUrl || defaultImage,
        imageBanner: formData.imageUrl || defaultImage,
        images: formData.imageUrl ? [formData.imageUrl] : [defaultImage],
        ticketPrice: Number(formData.ticketPrice) || 10,
        numberOfTickets: Number(formData.numberOfTickets) || 100,
        startDate: new Date(formData.startDate + 'T00:00:00').toISOString(),
        endDate: new Date(formData.endDate + 'T23:59:59').toISOString(),
        status: 1
      }
      
      console.log('Enviando dados da rifa:', JSON.stringify(raffleData, null, 2))
      await raffleService.create(raffleData)
      
      toast.success('Rifa criada com sucesso! 🎉')
      navigate('/dashboard/raffles')
    } catch (error: any) {
      console.error('Erro completo:', error)
      console.error('Response data:', error.response?.data)
      console.error('Response status:', error.response?.status)
      
      let errorMessage = 'Erro ao criar rifa. Tente novamente.'
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          if (error.response.data.includes('cannot be null')) {
            const match = error.response.data.match(/Column '([^']+)' cannot be null/)
            if (match) {
              errorMessage = `Campo obrigatório não preenchido: ${match[1]}`
            }
          } else if (error.response.data.includes('DbUpdateException')) {
            errorMessage = 'Erro ao salvar no banco de dados. Verifique os dados enviados.'
          } else {
            errorMessage = 'Erro no servidor. Verifique os dados e tente novamente.'
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        }
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Prêmio', icon: Gift },
    { number: 2, title: 'Detalhes', icon: FileText },
    { number: 3, title: 'Bilhetes', icon: Ticket },
    { number: 4, title: 'Datas', icon: Calendar }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Criar Nova Rifa</h1>
              <p className="text-gray-600 mt-1">Siga os passos para configurar sua rifa</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep > step.number
                        ? 'bg-green-500 text-white'
                        : currentStep === step.number
                        ? 'bg-purple-600 text-white ring-4 ring-purple-100'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">O que você vai sortear?</h2>
                <p className="text-gray-600 mt-2">Vamos começar com o prêmio da sua rifa</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Prêmio *
                </label>
                <input
                  type="text"
                  name="prizeTitle"
                  value={formData.prizeTitle}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.prizeTitle ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: iPhone 15 Pro Max 256GB"
                />
                {errors.prizeTitle && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.prizeTitle}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição do Prêmio *
                </label>
                <textarea
                  name="prizeDescription"
                  value={formData.prizeDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.prizeDescription ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Descreva o prêmio com detalhes: cor, modelo, condição (novo/usado), o que está incluso, etc."
                />
                {errors.prizeDescription && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.prizeDescription}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL da Imagem do Prêmio *
                </label>
                <div className="space-y-4">
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.imageUrl ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  {errors.imageUrl && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.imageUrl}
                    </p>
                  )}
                  
                  {formData.imageUrl && !errors.imageUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <img
                        src={formData.imageUrl}
                        alt="Preview do prêmio"
                        className="w-full max-w-md h-48 object-cover rounded-lg border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          setErrors(prev => ({ ...prev, imageUrl: 'URL da imagem inválida' }))
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Detalhes da Rifa</h2>
                <p className="text-gray-600 mt-2">Como você quer apresentar sua rifa?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título da Rifa *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Rifa Solidária - iPhone 15 Pro Max"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Este título aparecerá na lista de rifas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição da Rifa *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Explique como funcionará o sorteio, qual o objetivo da rifa, regras de participação, etc."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Seja claro e transparente para gerar confiança
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Ticket className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Configuração dos Bilhetes</h2>
                <p className="text-gray-600 mt-2">Defina o valor e quantidade de bilhetes</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor do Bilhete (R$) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      R$
                    </span>
                    <input
                      type="number"
                      name="ticketPrice"
                      value={formData.ticketPrice}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.ticketPrice ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                  {errors.ticketPrice && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.ticketPrice}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Valores populares: R$ 5, R$ 10, R$ 20
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade de Bilhetes *
                  </label>
                  <input
                    type="number"
                    name="numberOfTickets"
                    value={formData.numberOfTickets}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.numberOfTickets ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="1"
                  />
                  {errors.numberOfTickets && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.numberOfTickets}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Quantidades populares: 100, 200, 500
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-6 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Arrecadação Total Possível</p>
                    <p className="text-3xl font-bold text-purple-900 mt-1">
                      R$ {(formData.ticketPrice * formData.numberOfTickets).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>
                  <DollarSign className="w-12 h-12 text-purple-400" />
                </div>
                <p className="text-sm text-purple-700 mt-2">
                  Se todos os {formData.numberOfTickets} bilhetes forem vendidos a R$ {formData.ticketPrice.toFixed(2)} cada
                </p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Calendar className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Período da Rifa</h2>
                <p className="text-gray-600 mt-2">Quando sua rifa começa e termina?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Início *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.startDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data do Sorteio *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.endDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {formData.startDate && formData.endDate && (
                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                  <p className="text-sm text-blue-800">
                    <strong>Duração da rifa:</strong> {
                      Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))
                    } dias
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Dica: Rifas entre 7 e 30 dias costumam ter melhor desempenho
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Resumo da sua Rifa</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prêmio:</span>
                    <span className="font-medium">{formData.prizeTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor do bilhete:</span>
                    <span className="font-medium">R$ {formData.ticketPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de bilhetes:</span>
                    <span className="font-medium">{formData.numberOfTickets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arrecadação possível:</span>
                    <span className="font-medium text-green-600">
                      R$ {(formData.ticketPrice * formData.numberOfTickets).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Próximo
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Criando...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Criar Rifa
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Precisa de ajuda? Entre em contato com nosso suporte
          </p>
        </div>
      </div>
    </div>
  )
}