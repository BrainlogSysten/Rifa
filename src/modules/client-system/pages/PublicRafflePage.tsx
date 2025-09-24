import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Users, DollarSign, Clock, ShoppingCart } from 'lucide-react';
import { Raffle } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/format';
import publicRaffleService from '../services/publicRaffleService';
import toast from 'react-hot-toast';
import { RaffleTheme, getThemeById, RAFFLE_THEMES } from '../../../constants/themes';
import ThemedRafflePage from '../../../components/ThemedRafflePage';

const PublicRafflePage = () => {
  const { uniqueLink } = useParams<{ uniqueLink: string }>();
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [availableTickets, setAvailableTickets] = useState<number[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<RaffleTheme>(RAFFLE_THEMES[0]);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    cpf: ''
  });

  useEffect(() => {
    if (uniqueLink) {
      loadRaffleData();
    }
  }, [uniqueLink]);

  const loadRaffleData = async () => {
    try {
      const raffleData = await publicRaffleService.getByUniqueLink(uniqueLink!);
      const tickets = await publicRaffleService.getAvailableTickets(uniqueLink!);
      
      setRaffle(raffleData);
      setAvailableTickets(tickets);
      
      const theme = getThemeById(raffleData.themeId) || RAFFLE_THEMES[0];
      setCurrentTheme(theme);
    } catch (error) {
      toast.error('Rifa não encontrada');
    } finally {
      setLoading(false);
    }
  };

  const handleTicketSelect = (ticketNumber: number) => {
    if (selectedTickets.includes(ticketNumber)) {
      setSelectedTickets(selectedTickets.filter(t => t !== ticketNumber));
    } else {
      setSelectedTickets([...selectedTickets, ticketNumber]);
    }
  };

  const handlePurchase = async () => {
    if (selectedTickets.length === 0) {
      toast.error('Selecione pelo menos um número');
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Preencha nome e telefone');
      return;
    }

    try {
      await publicRaffleService.purchaseTickets(uniqueLink!, selectedTickets, customerInfo);
      toast.success('Números reservados! Aguarde instruções de pagamento.');
      setSelectedTickets([]);
      setShowPurchaseForm(false);
      loadRaffleData();
    } catch (error) {
      toast.error('Erro na compra. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando rifa...</p>
        </div>
      </div>
    );
  }

  if (!raffle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Rifa não encontrada</h1>
          <p className="text-gray-600">Verifique o link e tente novamente.</p>
        </div>
      </div>
    );
  }

  const totalValue = selectedTickets.length * raffle.ticketPrice;

  const getButtonClass = (isSelected: boolean, isAvailable: boolean) => {
    const baseClass = "aspect-square font-bold text-sm transition-all duration-200 border-2";
    const shapeClass = currentTheme.buttonStyle === 'rounded' ? 'rounded-lg' : 
                      currentTheme.buttonStyle === 'square' ? 'rounded-none' : 'rounded-full';
    
    if (isSelected) {
      return `${baseClass} ${shapeClass} border-transparent shadow-lg transform scale-105`;
    } else if (isAvailable) {
      return `${baseClass} ${shapeClass} border-opacity-30 hover:border-opacity-70 hover:shadow-md hover:transform hover:scale-105`;
    } else {
      return `${baseClass} ${shapeClass} border-gray-300 opacity-50 cursor-not-allowed`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: currentTheme.backgroundColor}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 mx-auto" style={{borderBottomColor: currentTheme.primaryColor}}></div>
          <p className="mt-4 text-lg" style={{color: currentTheme.textColor}}>Carregando rifa...</p>
        </div>
      </div>
    );
  }

  if (!raffle) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: currentTheme.backgroundColor}}>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4" style={{color: currentTheme.textColor}}>Rifa não encontrada</h1>
          <p style={{color: currentTheme.textColor}}>Verifique o link e tente novamente.</p>
        </div>
      </div>
    );
  }

  const totalValue = selectedTickets.length * raffle.ticketPrice;

  return (
    <ThemedRafflePage theme={currentTheme}>
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="aspect-video bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center">
            {raffle.coverImageUrl ? (
              <img
                src={raffle.coverImageUrl}
                alt={raffle.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-white text-center">
                <h1 className="text-3xl font-bold mb-2">{raffle.title}</h1>
                <p className="text-purple-200">{raffle.prizeTitle}</p>
              </div>
            )}
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{raffle.title}</h1>
            <p className="text-gray-600 mb-6">{raffle.description}</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Valor por Número</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(raffle.ticketPrice)}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Disponíveis</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {availableTickets.length}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Sorteio</span>
                </div>
                <p className="text-lg font-bold text-blue-600">
                  {raffle.endDate ? formatDate(raffle.endDate) : 'A definir'}
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Status</span>
                </div>
                <p className="text-lg font-bold text-orange-600">Ativa</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Escolha seus números ({selectedTickets.length} selecionados)
                </h2>
                {selectedTickets.length > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(totalValue)}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 mb-6">
                {Array.from({ length: raffle.numberOfTickets }, (_, i) => i + 1).map((number) => {
                  const isAvailable = availableTickets.includes(number);
                  const isSelected = selectedTickets.includes(number);
                  
                  return (
                    <button
                      key={number}
                      onClick={() => isAvailable && handleTicketSelect(number)}
                      disabled={!isAvailable}
                      className={`
                        aspect-square rounded-lg font-medium text-sm transition-all
                        ${isSelected 
                          ? 'bg-purple-600 text-white shadow-md' 
                          : isAvailable 
                          ? 'bg-white border-2 border-gray-200 hover:border-purple-400 text-gray-700 hover:bg-purple-50' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {number.toString().padStart(2, '0')}
                    </button>
                  );
                })}
              </div>

              {selectedTickets.length > 0 && (
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedTickets([])}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Limpar Seleção
                  </button>
                  <button
                    onClick={() => setShowPurchaseForm(true)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Comprar Números ({selectedTickets.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {showPurchaseForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Finalizar Compra</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Telefone</label>
                  <input
                    type="text"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">CPF (opcional)</label>
                  <input
                    type="text"
                    value={customerInfo.cpf}
                    onChange={(e) => setCustomerInfo({...customerInfo, cpf: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700 mb-2">Resumo da compra:</p>
                  <p className="font-medium">Números: {selectedTickets.join(', ')}</p>
                  <p className="font-bold text-lg text-purple-600">Total: {formatCurrency(totalValue)}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPurchaseForm(false)}
                    className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handlePurchase}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicRafflePage;