import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import raffleService from '../services/raffleService';
import { api } from '../services/api';
import PurchaseSection from '../components/PurchaseSection';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Trophy,
  Shield,
  Building2,
  MapPin,
  Share2,
  Heart,
  AlertCircle,
  CheckCircle,
  Gift,
  Ticket,
  TrendingUp,
  Star,
  DollarSign,
  ChevronRight,
  Copy,
  Facebook,
  Twitter,
  MessageCircle,
  Info,
  FileText,
  Award,
  Timer,
  Plus,
  Minus,
  X,
  CreditCard,
  QrCode,
  FileText as FileTextIcon,
  ShoppingCart
} from 'lucide-react';


const RaffleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [raffle, setRaffle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedRaffles, setRelatedRaffles] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // Purchase states
  const [showPurchaseSection, setShowPurchaseSection] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [soldNumbers, setSoldNumbers] = useState<number[]>([]);
  const [searchNumber, setSearchNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Helper function to get estimated prize value based on product type
  const getEstimatedPrizeValue = (data: any): number => {
    const title = data.title?.toLowerCase() || '';
    if (title.includes('iphone 15 pro max')) return 8000;
    if (title.includes('iphone')) return 5000;
    if (title.includes('samsung')) return 3000;
    if (title.includes('car') || title.includes('carro')) return 50000;
    if (title.includes('moto')) return 15000;
    return 2000; // Default value
  };

  // Helper function to get enhanced description
  const getEnhancedDescription = (data: any): string => {
    const title = data.title || 'Produto';
    const baseDesc = data.description || `Concorra a um ${title}`;
    return `${baseDesc}\n\nEste sorteio promocional é 100% legal e autorizado pelos órgãos competentes. Todos os recursos arrecadados serão destinados a finalidades beneficentes, conforme regulamento do sorteio promocional.\n\nO sorteio será realizado de forma transparente e pública, com transmissão ao vivo para garantir a idoneidade do processo.`;
  };

  // Helper function to process images with fallback
  const getProcessedImages = (data: any): string[] => {
    // Check if there are real images from API
    if (data.images && data.images.length > 0) {
      return data.images;
    }

    // Check for cover image URL
    if (data.coverImageUrl && data.coverImageUrl !== 'https://example.com/iphone.jpg') {
      return [data.coverImageUrl];
    }

    // Fallback to category-based placeholder
    const getCategoryFromType = (type: any): string => {
      const typeMap: Record<string, string> = {
        'Car': 'cars',
        'Electronic': 'electronics',
        'Property': 'home',
        'Travel': 'travel',
        'Experience': 'travel',
        'Fashion': 'fashion',
        'Home': 'home',
        'Games': 'games',
        'Vouchers': 'vouchers',
        'Other': 'others'
      };
      return typeMap[type] || 'others';
    };

    const category = getCategoryFromType(data.type);
    const imageMap: Record<string, string> = {
      'cars': '/images/placeholders/car1.jpg',
      'electronics': '/images/placeholders/electronics1.jpg',
      'home': '/images/placeholders/house1.jpg',
      'games': '/images/placeholders/gaming1.jpg',
      'travel': '/images/placeholders/car2.jpg',
      'fashion': '/images/placeholders/electronics1.jpg',
      'vouchers': '/images/placeholders/house1.jpg'
    };

    return [imageMap[category] || '/images/placeholders/electronics1.jpg'];
  };

  // Fetch raffle data from backend
  useEffect(() => {
    const fetchRaffleDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await raffleService.getRaffleById(id || '');

        // Transform backend data to frontend format
        const transformedData = {
          ...data,
          soldTickets: Number((data as any).ticketsSold || data.soldTickets || 0),
          totalTickets: Number((data as any).numberOfTickets || data.totalTickets || 1000),
          prizeValue: Number((data as any).prizes?.[0]?.value || data.prizeValue || getEstimatedPrizeValue(data)),
          organizationName: (data as any).user?.tradeName || (data as any).user?.name || 'Organização Beneficente',
          organizationDescription: 'Organização sem fins lucrativos devidamente autorizada pela SPA/MF',
          scpcAuthorization: (data as any).scpcAuthorizationNumber || (data as any).sCPCAuthorizationNumber || 'SCPC123456',
          authorizationDate: (data as any).scpcAuthorizationDate || (data as any).sCPCAuthorizationDate || new Date().toISOString(),
          images: getProcessedImages(data),
          fullDescription: data.fullDescription || data.description || getEnhancedDescription(data),
          status: (() => {
            const statusMap: { [key: number]: string } = {
              1: 'draft',
              2: 'pending',
              3: 'cancelled',
              4: 'active',
              5: 'completed'
            };
            const statusNum = Number(data.status);
            return statusMap[statusNum] || 'active';
          })(),
          drawDate: data.drawDate,
          startDate: data.startDate,
          endDate: data.endDate,
          regulation: data.regulation || '',
          fundraisingPurpose: data.fundraisingPurpose || '',
          drawLocation: data.drawLocation || '',
          prizes: (data as any).prizes?.length > 0
            ? (data as any).prizes.map((p: any, index: number) => ({
                position: index + 1,
                description: p.title || p.description,
                value: p.value
              }))
            : [{
                position: 1,
                description: data.title || 'Prêmio Principal',
                value: getEstimatedPrizeValue(data)
              }]
        };

        setRaffle(transformedData);
      } catch (error: any) {
        console.error('Error fetching raffle details:', error);
        setError(error.message || 'Erro ao carregar detalhes do sorteio promocional');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRaffleDetails();
      fetchAvailableNumbers();
    }
  }, [id]);

  // Buscar sorteios relacionados quando o raffle principal for carregado
  useEffect(() => {
    if (raffle && !loadingRelated) {
      fetchRelatedRaffles();
    }
  }, [raffle]);

  const fetchAvailableNumbers = async () => {
    try {
      const response = await api.get(`/api/raffles/${id}/available-numbers`);
      const availableNumbers = response.data;

      // Calculate sold numbers (all numbers from 1-1000 that are not available)
      const allNumbers = Array.from({ length: 1000 }, (_, i) => i + 1);
      const sold = allNumbers.filter(num => !availableNumbers.includes(num));
      setSoldNumbers(sold);
    } catch (error) {
      console.error('Error fetching available numbers:', error);
      // Fallback: simulate some sold numbers
      const mockSoldNumbers = Array.from({ length: 150 }, () =>
        Math.floor(Math.random() * 1000) + 1
      );
      setSoldNumbers(mockSoldNumbers);
    }
  };

  const fetchRelatedRaffles = async () => {
    if (!raffle) return;

    setLoadingRelated(true);
    try {
      // Buscar sorteios ativos
      const activeRaffles = await raffleService.getActiveRaffles();

      // Filtrar para remover o sorteio atual e pegar até 4 sorteios
      const filtered = activeRaffles
        .filter((r: any) => r.id !== id)
        .slice(0, 4);

      setRelatedRaffles(filtered);
    } catch (error) {
      console.error('Error fetching related raffles:', error);
      // Em caso de erro, manter array vazio
      setRelatedRaffles([]);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handlePurchase = () => {
    // Show purchase section instead of navigating
    setShowPurchaseSection(true);
  };

  const handleNumberSelect = (number: number) => {
    if (soldNumbers.includes(number)) return;

    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(prev => prev.filter(n => n !== number));
    } else {
      if (selectedNumbers.length < (raffle?.maxTicketPerUser || 30)) {
        setSelectedNumbers(prev => [...prev, number]);
      }
    }
  };

  const getNumberStatus = (number: number): 'available' | 'selected' | 'sold' => {
    if (soldNumbers.includes(number)) return 'sold';
    if (selectedNumbers.includes(number)) return 'selected';
    return 'available';
  };

  const selectRandomNumbers = (count: number) => {
    const available = [];
    for (let i = 1; i <= (raffle?.totalTickets || 1000); i++) {
      if (!soldNumbers.includes(i) && !selectedNumbers.includes(i)) {
        available.push(i);
      }
    }

    const maxToSelect = Math.min(
      count,
      available.length,
      (raffle?.maxTicketPerUser || 30) - selectedNumbers.length
    );

    const randomSelected: number[] = [];
    for (let i = 0; i < maxToSelect; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      randomSelected.push(available[randomIndex]);
      available.splice(randomIndex, 1);
    }

    setSelectedNumbers(prev => [...prev, ...randomSelected]);
  };

  const searchAndSelectNumber = () => {
    const num = parseInt(searchNumber);
    if (num > 0 && num <= (raffle?.totalTickets || 1000)) {
      handleNumberSelect(num);
      setSearchNumber('');
    }
  };

  const handleCheckout = () => {
    if (selectedNumbers.length > 0 && termsAccepted) {
      setShowCheckout(true);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // First, reserve the tickets
      const reserveResponse = await api.post(`/api/raffles/${id}/reserve-tickets`, {
        ticketNumbers: selectedNumbers
      });

      // Then process the purchase
      const purchaseResponse = await api.post(`/api/raffles/${id}/purchase-tickets`, {
        ticketNumbers: selectedNumbers,
        paymentMethod: paymentMethod,
        customerInfo: {
          name: 'User Name',
          email: 'user@email.com',
          phone: '11999999999',
          cpf: '12345678900'
        }
      });

      const purchase = purchaseResponse.data;

      if (paymentMethod === 'pix' && purchase.paymentDetails?.pixQrCode) {
        alert(`PIX QR Code gerado! Chave PIX: ${purchase.paymentDetails.pixKey}\nTotal: R$ ${purchase.totalAmount.toFixed(2)}`);
      } else if (paymentMethod === 'boleto' && purchase.paymentDetails?.boletoUrl) {
        window.open(purchase.paymentDetails.boletoUrl, '_blank');
      }

      alert(`Compra realizada com sucesso! ID: ${purchase.purchaseId}\nNúmeros: ${selectedNumbers.join(', ')}`);
      setShowPurchaseSection(false);
      setShowCheckout(false);
      setSelectedNumbers([]);
      setTermsAccepted(false);

      // Refresh available numbers
      fetchAvailableNumbers();
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.response?.data?.message || 'Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Participe do sorteio promocional: ${raffle?.title}`;

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copiado!');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
    }
    setShowShareMenu(false);
  };

  const calculateTimeLeft = () => {
    if (!raffle) return null;
    const now = new Date().getTime();
    const drawTime = new Date(raffle.drawDate).getTime();
    const difference = drawTime - now;

    if (difference <= 0) return null;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

  const timeLeft = calculateTimeLeft();
  const progressPercentage = raffle ? (raffle.soldTickets / raffle.totalTickets) * 100 : 0;

  // Show purchase section when activated
  if (showPurchaseSection && raffle) {
    return (
      <PurchaseSection
        raffleId={raffle.id}
        raffleTitle={raffle.title}
        raffleImage={raffle.images[0]}
        ticketPrice={raffle.ticketPrice}
        maxTicketsPerUser={raffle.maxTicketsPerUser || 30}
        totalTickets={raffle.totalTickets}
        ticketsSold={raffle.soldTickets}
        endDate={raffle.endDate}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-surface-900 via-surface-800 to-surface-900 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-96 bg-white/10 rounded-xl mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-32 bg-white/10 rounded-xl"></div>
                <div className="h-48 bg-white/10 rounded-xl"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-white/10 rounded-xl"></div>
                <div className="h-32 bg-white/10 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !raffle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-surface-900 via-surface-800 to-surface-900 pt-20">
        <div className="container mx-auto px-4 py-12 text-center">
          <Gift className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {error || 'Sorteio promocional não encontrado'}
          </h2>
          <p className="text-gray-400 mb-8">
            {error ? 'Ocorreu um erro ao carregar o sorteio promocional.' : 'O sorteio promocional que você está procurando não existe ou foi removido.'}
          </p>
          <Link to="/raffles" className="btn-primary">
            Ver todos os sorteios promocionais
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-900 via-surface-800 to-surface-900 pt-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
            Início
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <Link to="/raffles" className="text-gray-400 hover:text-white transition-colors">
            Sorteios Promocionais
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="text-white">{raffle.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-0 overflow-hidden"
            >
              <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 relative">
                <img
                  src={raffle.images[selectedImage]}
                  alt={raffle.title}
                  className="w-full h-full object-cover"
                />
                {raffle.status === 'ending_soon' && (
                  <div className="absolute top-4 left-4 px-3 py-2 bg-yellow-500 text-white rounded-lg font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Termina em breve!
                  </div>
                )}
              </div>
              {raffle.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {raffle.images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary-500'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Title and Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{raffle.title}</h1>
                  <p className="text-gray-400">{raffle.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-lg transition-colors ${
                      isFavorite
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="p-3 bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-0 mt-2 w-48 bg-surface-700 rounded-lg shadow-xl border border-white/10 overflow-hidden z-10"
                      >
                        <button
                          onClick={() => handleShare('copy')}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-white"
                        >
                          <Copy className="w-4 h-4" />
                          Copiar Link
                        </button>
                        <button
                          onClick={() => handleShare('whatsapp')}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-white"
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </button>
                        <button
                          onClick={() => handleShare('facebook')}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-white"
                        >
                          <Facebook className="w-4 h-4" />
                          Facebook
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-white"
                        >
                          <Twitter className="w-4 h-4" />
                          Twitter
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    R$ {raffle.prizeValue.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-400">Valor do Prêmio</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {raffle.soldTickets.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">Participantes</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <Ticket className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {(raffle.totalTickets - raffle.soldTickets).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">Disponíveis</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Progresso do Sorteio</span>
                  <span className="text-white font-semibold">
                    {progressPercentage.toFixed(1)}% vendido
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                  />
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-gray-500">
                    {raffle.soldTickets.toLocaleString()} vendidos
                  </span>
                  <span className="text-gray-500">
                    Meta: {raffle.totalTickets.toLocaleString()} bilhetes
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary-400" />
                Sobre este Sorteio Promocional
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-line">
                  {raffle.fullDescription}
                </p>
              </div>
            </motion.div>

            {/* Prizes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Prêmios
              </h2>
              <div className="space-y-3">
                {raffle.prizes.map((prize: any) => (
                  <div
                    key={prize.position}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          prize.position === 1
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : prize.position === 2
                            ? 'bg-gray-400/20 text-gray-300'
                            : 'bg-orange-600/20 text-orange-400'
                        }`}
                      >
                        {prize.position}º
                      </div>
                      <div>
                        <p className="text-white font-medium">{prize.description}</p>
                        <p className="text-green-400 text-sm">
                          R$ {prize.value.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    {prize.position === 1 && (
                      <Award className="w-6 h-6 text-yellow-400" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Organization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-secondary-400" />
                Organização Responsável
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-secondary-500/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-secondary-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {raffle.organizationName}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {raffle.organizationDescription}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    Organização verificada e autorizada
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Legal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-6 border border-secondary-500/30"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-secondary-400" />
                Informações Legais
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Autorização SCPC/SPA</span>
                  <span className="text-green-400 font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {raffle.scpcAuthorization}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Data da Autorização</span>
                  <span className="text-white">
                    {new Date(raffle.authorizationDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Finalidade</span>
                  <span className="text-white text-sm text-right max-w-xs">
                    {raffle.fundraisingPurpose}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Local do Sorteio</span>
                  <span className="text-white text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {raffle.drawLocation}
                  </span>
                </div>
                <a
                  href={raffle.regulation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full p-3 bg-secondary-500/20 text-secondary-400 rounded-lg hover:bg-secondary-500/30 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Ver Regulamento Completo
                </a>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Purchase Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6"
              >
                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm mb-2">Valor do Bilhete</p>
                  <p className="text-4xl font-bold text-white">
                    R$ {raffle.ticketPrice}
                  </p>
                </div>

                {/* Time Left */}
                {timeLeft && (
                  <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-xs text-yellow-400 mb-2 flex items-center gap-2">
                      <Timer className="w-4 h-4" />
                      TEMPO RESTANTE
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-2xl font-bold text-white">{timeLeft.days}</p>
                        <p className="text-xs text-gray-400">dias</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{timeLeft.hours}</p>
                        <p className="text-xs text-gray-400">horas</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{timeLeft.minutes}</p>
                        <p className="text-xs text-gray-400">min</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="text-sm text-gray-400 mb-2 block">
                    Quantidade de Bilhetes
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      className="w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={raffle.maxTicketsPerUser}
                      value={ticketQuantity}
                      onChange={(e) => setTicketQuantity(parseInt(e.target.value) || 1)}
                      className="flex-1 text-center input-modern"
                    />
                    <button
                      onClick={() =>
                        setTicketQuantity(Math.min(raffle.maxTicketsPerUser, ticketQuantity + 1))
                      }
                      className="w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Máximo: {raffle.maxTicketsPerUser} bilhetes por pessoa
                  </p>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between mb-6 p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Total</span>
                  <span className="text-2xl font-bold text-white">
                    R$ {(raffle.ticketPrice * ticketQuantity).toFixed(2)}
                  </span>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={handlePurchase}
                  className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
                  disabled={raffle.status !== 'active'}
                >
                  <Ticket className="w-5 h-5" />
                  {raffle.status === 'active' ? 'Comprar Bilhetes' : 'Sorteio Encerrado'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Compra 100% segura com certificado SSL
                </p>
              </motion.div>

              {/* Draw Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-400" />
                  Informações do Sorteio
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Data</span>
                    <span className="text-white font-medium">
                      {new Date(raffle.drawDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Horário</span>
                    <span className="text-white font-medium">
                      {new Date(raffle.drawDate).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Local</span>
                    <span className="text-white text-sm text-right max-w-[150px]">
                      {raffle.drawLocation}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Security Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-4 bg-green-500/10 border border-green-500/30"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-400">
                      Sorteio Autorizado
                    </p>
                    <p className="text-xs text-gray-300">
                      Conforme Lei 5.768/71 e regulamentada pela SPA
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>


        {/* Related Raffles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Sorteios Relacionados
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingRelated ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded mb-3 w-3/4"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-700 rounded w-16"></div>
                      <div className="h-3 bg-gray-700 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : relatedRaffles.length > 0 ? (
              relatedRaffles.map((relatedRaffle) => (
                <Link
                  key={relatedRaffle.id}
                  to={`/raffle/${relatedRaffle.id}`}
                  className="card overflow-hidden hover:scale-105 transition-transform duration-300"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800">
                    <img
                      src={relatedRaffle.imageUrl || relatedRaffle.coverImageUrl || '/images/placeholders/electronics1.jpg'}
                      alt={relatedRaffle.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholders/electronics1.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-2 line-clamp-2">
                      {relatedRaffle.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {relatedRaffle.description || 'Participe deste sorteio promocional autorizado'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-400 font-bold">
                        R$ {relatedRaffle.ticketPrice?.toFixed(2) || '25,00'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {relatedRaffle.soldTickets || 0} vendidos
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Fallback quando não há sorteios relacionados
              <div className="col-span-full text-center py-8">
                <Gift className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">
                  Nenhum sorteio relacionado encontrado no momento
                </p>
                <Link
                  to="/raffles"
                  className="text-primary-400 hover:text-primary-300 mt-2 inline-block"
                >
                  Ver todos os sorteios disponíveis
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RaffleDetailsPage;