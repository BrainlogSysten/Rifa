import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  Trophy,
  ShoppingCart,
  Share2,
  ArrowLeft,
  Check,
  Info,
  Ticket as TicketIcon,
  Grid3X3,
  Loader2,
  CreditCard,
  Smartphone
} from 'lucide-react'
import { raffleService, Raffle, Prize, ticketService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function RaffleDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [raffle, setRaffle] = useState<Raffle | null>(null)
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTickets, setSelectedTickets] = useState<number[]>([])
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [availableTickets, setAvailableTickets] = useState<number[]>([])
  const [purchasedTickets, setPurchasedTickets] = useState<number[]>([])
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [showTicketGrid, setShowTicketGrid] = useState(false)

  useEffect(() => {
    if (id) {
      loadRaffleDetails()
    }
  }, [id])

  const loadRaffleDetails = async () => {
    try {
      const [raffleData, prizesData] = await Promise.all([
        raffleService.getById(id!),
        raffleService.getPrizes(id!)
      ])
      setRaffle(raffleData)
      setPrizes(prizesData)
      await loadTicketStatus()
    } catch (error) {
      toast.error('Erro ao carregar detalhes da rifa')
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  const loadTicketStatus = async () => {
    try {
      const tickets = await ticketService.getByRaffle(id!)
      const purchased = tickets.map(ticket => ticket.value)
      const maxParticipants = raffle?.maxParticipants || 1000
      const available = Array.from({ length: maxParticipants }, (_, i) => i + 1)
        .filter(num => !purchased.includes(num))
      
      setPurchasedTickets(purchased)
      setAvailableTickets(available)
    } catch (error) {
      console.error('Error loading ticket status:', error)
    }
  }

  const handleTicketSelection = (ticketNumber: number) => {
    setSelectedTickets(prev => {
      if (prev.includes(ticketNumber)) {
        return prev.filter(t => t !== ticketNumber)
      } else {
        const maxTickets = raffle?.maxTicketPerUser || 10
        if (prev.length >= maxTickets) {
          toast.error(`Máximo de ${maxTickets} bilhetes por pessoa`)
          return prev
        }
        return [...prev, ticketNumber]
      }
    })
  }

  const handleRandomTicketSelection = () => {
    const maxTickets = Math.min(ticketQuantity, raffle?.maxTicketPerUser || 10)
    const shuffled = [...availableTickets].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, maxTickets)
    setSelectedTickets(selected)
    setShowTicketGrid(true)
  }

  const handleTicketPurchase = async () => {
    if (!isAuthenticated) {
      toast.error('Você precisa fazer login para comprar bilhetes')
      navigate('/login')
      return
    }

    if (selectedTickets.length === 0) {
      toast.error('Selecione pelo menos um bilhete')
      return
    }

    try {
      setIsPurchasing(true)
      
      const promises = selectedTickets.map(ticketNumber => 
        ticketService.purchase({
          raffleId: id!,
          ticketNumber,
          userId: user?.id
        })
      )

      await Promise.all(promises)
      
      toast.success(`${selectedTickets.length} bilhete(s) comprado(s) com sucesso!`)
      setShowPurchaseModal(false)
      setSelectedTickets([])
      setTicketQuantity(1)
      await loadTicketStatus()
    } catch (error) {
      toast.error('Erro ao comprar bilhetes')
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: raffle?.title,
        text: raffle?.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copiado para a área de transferência!')
    }
  }

  const calculateProgress = () => {
    if (!raffle?.maxParticipants) return 0
    const participants = purchasedTickets.length
    return (participants / raffle.maxParticipants) * 100
  }

  const calculateTimeLeft = () => {
    if (!raffle?.endDate) return 'Indefinido'
    const end = new Date(raffle.endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Encerrado'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days} dia${days > 1 ? 's' : ''}`
    return `${hours} hora${hours > 1 ? 's' : ''}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!raffle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Rifa não encontrada</h2>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Compartilhar
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-video relative bg-gray-100">
                {raffle.images && raffle.images.length > 0 ? (
                  <>
                    <img
                      src={raffle.images[activeImageIndex]}
                      alt={raffle.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://via.placeholder.com/800x450?text=Imagem+não+disponível'
                      }}
                    />
                    {raffle.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {raffle.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === activeImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <TicketIcon className="w-20 h-20 text-gray-300" />
                  </div>
                )}
              </div>
              {raffle.images && raffle.images.length > 1 && (
                <div className="p-4 border-t">
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {raffle.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          index === activeImageIndex ? 'border-primary-500' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'https://via.placeholder.com/150?text=Erro'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Descrição</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{raffle.description}</p>
            </div>

            {prizes.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-secondary-500" />
                  Prêmios
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prizes.map((prize, index) => (
                    <div key={prize.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                          <span className="text-secondary-600 font-bold">{index + 1}°</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{prize.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{prize.description}</p>
                          {prize.value > 0 && (
                            <p className="text-sm font-semibold text-primary-600 mt-2">
                              Valor: R$ {prize.value.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {raffle.terms && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Info className="w-6 h-6" />
                  Regras e Termos
                </h2>
                <div className="prose prose-sm max-w-none text-gray-600">
                  <p className="whitespace-pre-wrap">{raffle.terms}</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{raffle.title}</h1>
              
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold
                  ${raffle.status === 'Active' ? 'bg-success-100 text-success-700' : ''}
                  ${raffle.status === 'Draft' ? 'bg-gray-100 text-gray-700' : ''}
                  ${raffle.status === 'Finished' ? 'bg-primary-100 text-primary-700' : ''}
                  ${raffle.status === 'Cancelled' ? 'bg-danger-100 text-danger-700' : ''}
                `}>
                  {raffle.status === 'Active' ? 'Rifa Ativa' : 
                   raffle.status === 'Draft' ? 'Rascunho' :
                   raffle.status === 'Finished' ? 'Finalizada' :
                   raffle.status === 'Cancelled' ? 'Cancelada' : raffle.status}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Valor do bilhete</span>
                  </div>
                  <span className="font-bold text-lg text-gray-900">
                    R$ {raffle.ticketPrice?.toFixed(2) || '0,00'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Tempo restante</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {calculateTimeLeft()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Participantes</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {purchasedTickets.length}{raffle.maxParticipants ? ` / ${raffle.maxParticipants}` : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Sorteio</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {raffle.endDate ? new Date(raffle.endDate).toLocaleDateString('pt-BR') : 'A definir'}
                  </span>
                </div>
              </div>

              {raffle.maxParticipants && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-semibold">{calculateProgress().toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress()}%` }}
                    />
                  </div>
                </div>
              )}

              {raffle.status === 'Active' && (
                <>
                  <div className="mb-6 space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Selecione seus bilhetes
                    </label>
                    
                    <div className="mb-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                          className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={ticketQuantity}
                          onChange={(e) => setTicketQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, raffle.maxTicketPerUser || 100)))}
                          className="w-20 text-center border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          min="1"
                          max={raffle.maxTicketPerUser || 100}
                        />
                        <button
                          onClick={() => setTicketQuantity(Math.min(ticketQuantity + 1, raffle.maxTicketPerUser || 100))}
                          className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      {raffle.maxTicketPerUser > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Máximo: {raffle.maxTicketPerUser} bilhetes por pessoa
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleRandomTicketSelection}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
                      >
                        <Smartphone className="w-4 h-4" />
                        Escolher Aleatório
                      </button>
                      <button
                        onClick={() => setShowTicketGrid(!showTicketGrid)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                      >
                        <Grid3X3 className="w-4 h-4" />
                        Escolher Números
                      </button>
                    </div>
                  </div>

                  {selectedTickets.length > 0 && (
                    <div className="mb-4 p-3 bg-primary-50 rounded-lg">
                      <h4 className="text-sm font-medium text-primary-800 mb-2">
                        Bilhetes Selecionados ({selectedTickets.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedTickets.sort((a, b) => a - b).map(ticket => (
                          <span
                            key={ticket}
                            className="inline-flex items-center px-2 py-1 bg-primary-600 text-white text-xs rounded cursor-pointer hover:bg-primary-700 transition-colors"
                            onClick={() => handleTicketSelection(ticket)}
                          >
                            #{ticket.toString().padStart(4, '0')}
                            <button className="ml-1 text-primary-200 hover:text-white">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {showTicketGrid && (
                    <div className="mb-4 p-4 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                      <div className="grid grid-cols-8 gap-1 text-xs">
                        {Array.from({ length: Math.min(raffle.maxParticipants || 100, 200) }, (_, i) => i + 1).map(ticketNumber => {
                          const isPurchased = purchasedTickets.includes(ticketNumber)
                          const isSelected = selectedTickets.includes(ticketNumber)
                          
                          return (
                            <button
                              key={ticketNumber}
                              onClick={() => !isPurchased && handleTicketSelection(ticketNumber)}
                              disabled={isPurchased}
                              className={`
                                h-8 rounded text-xs font-medium transition-colors
                                ${isPurchased 
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                  : isSelected
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700 cursor-pointer'
                                }
                              `}
                            >
                              {ticketNumber.toString().padStart(2, '0')}
                            </button>
                          )
                        })}
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Disponíveis: {availableTickets.length} | Vendidos: {purchasedTickets.length}
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total</span>
                      <span className="text-2xl font-bold text-primary-600">
                        R$ {(selectedTickets.length * (raffle.ticketPrice || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleTicketPurchase}
                    disabled={selectedTickets.length === 0 || isPurchasing}
                    className="w-full btn btn-primary btn-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPurchasing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Comprar {selectedTickets.length > 0 ? `${selectedTickets.length} ` : ''}Bilhete{selectedTickets.length !== 1 ? 's' : ''}
                      </>
                    )}
                  </button>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-center gap-4 mb-2">
                      {raffle.paymentMethod !== 'credit_card' && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Smartphone className="w-4 h-4" />
                          PIX
                        </div>
                      )}
                      {raffle.paymentMethod !== 'pix' && raffle.paymentMethod !== 'boleto' && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <CreditCard className="w-4 h-4" />
                          Cartão
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Pagamento seguro via {
                        raffle.paymentMethod === 'pix' ? 'PIX' :
                        raffle.paymentMethod === 'credit_card' ? 'Cartão de Crédito' :
                        raffle.paymentMethod === 'boleto' ? 'Boleto' :
                        'PIX, Cartão ou Boleto'
                      }
                    </p>
                  </div>
                </>
              )}

              {raffle.status === 'Finished' && (
                <div className="text-center py-4">
                  <p className="text-gray-600">Esta rifa já foi finalizada</p>
                </div>
              )}

              {raffle.status === 'Cancelled' && (
                <div className="text-center py-4">
                  <p className="text-danger-600">Esta rifa foi cancelada</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}