import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Users, DollarSign, Clock, ShoppingCart, Star, Trophy, Gift } from 'lucide-react';
import { Raffle } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/format';
import publicRaffleService from '../services/publicRaffleService';
import toast from 'react-hot-toast';
import { RaffleTheme, getThemeById, RAFFLE_THEMES } from '../../../constants/themes';
import ThemedRafflePage from '../../../components/ThemedRafflePage';

const PublicRafflePageThemed = () => {
  const { uniqueLink } = useParams<{ uniqueLink: string }>();
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [availableTickets, setAvailableTickets] = useState<number[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<RaffleTheme>(RAFFLE_THEMES[1]);

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
      
      const theme = getThemeById(raffleData.themeId) || RAFFLE_THEMES[1];
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

  const getButtonClass = (isSelected: boolean, isAvailable: boolean) => {
    const baseClass = "aspect-square font-bold text-sm transition-all duration-200 border-2 cursor-pointer";
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
      <ThemedRafflePage theme={currentTheme}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-32 w-32 border-b-4 mx-auto" 
              style={{borderBottomColor: currentTheme.primaryColor}}
            ></div>
            <p className="mt-4 text-lg font-medium">Carregando rifa...</p>
          </div>
        </div>
      </ThemedRafflePage>
    );
  }

  if (!raffle) {
    return (
      <ThemedRafflePage theme={currentTheme}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Rifa não encontrada</h1>
            <p>Verifique o link e tente novamente.</p>
          </div>
        </div>
      </ThemedRafflePage>
    );
  }

  const totalValue = selectedTickets.length * raffle.ticketPrice;

  return (
    <ThemedRafflePage theme={currentTheme}>
      <div className="min-h-screen">
        {/* Header Hero */}
        <div className="relative overflow-hidden" style={{
          background: currentTheme.backgroundImage || `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
          minHeight: '60vh'
        }}>
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative max-w-6xl mx-auto px-4 py-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" 
                 style={{backgroundColor: currentTheme.accentColor, color: 'white'}}>
              <Star className="w-5 h-5" />
              <span className="font-semibold">RIFA ATIVA</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-4" style={{
              fontFamily: currentTheme.fontFamily,
              color: currentTheme.textColor === '#ffffff' ? '#ffffff' : '#ffffff'
            }}>
              {currentTheme.headerTitle}
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{
              color: currentTheme.textColor === '#ffffff' ? currentTheme.accentColor : '#ffffff'
            }}>
              {raffle.title}
            </h2>
            
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90" style={{
              color: currentTheme.textColor === '#ffffff' ? '#ffffff' : '#ffffff'
            }}>
              {raffle.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" 
                     style={{backgroundColor: currentTheme.accentColor}}>
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{formatCurrency(raffle.ticketPrice)}</h3>
                <p className="text-white text-opacity-80">Por número</p>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" 
                     style={{backgroundColor: currentTheme.accentColor}}>
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{availableTickets.length}</h3>
                <p className="text-white text-opacity-80">Disponíveis</p>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" 
                     style={{backgroundColor: currentTheme.accentColor}}>
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {raffle.endDate ? formatDate(raffle.endDate) : 'Em breve'}
                </h3>
                <p className="text-white text-opacity-80">Sorteio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Numbers Selection */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{fontFamily: currentTheme.fontFamily}}>
              Escolha Seus Números da Sorte
            </h2>
            <p className="text-lg opacity-80">
              {selectedTickets.length > 0 ? (
                <span>
                  <strong>{selectedTickets.length}</strong> números selecionados • 
                  <strong style={{color: currentTheme.primaryColor}}> {formatCurrency(totalValue)}</strong>
                </span>
              ) : (
                'Clique nos números para selecioná-los'
              )}
            </p>
          </div>

          {/* Numbers Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-3 mb-12">
            {Array.from({ length: 100 }, (_, i) => i + 1).map((number) => {
              const isAvailable = availableTickets.includes(number);
              const isSelected = selectedTickets.includes(number);
              
              return (
                <button
                  key={number}
                  onClick={() => isAvailable && handleTicketSelect(number)}
                  disabled={!isAvailable}
                  className={getButtonClass(isSelected, isAvailable)}
                  style={{
                    backgroundColor: isSelected 
                      ? currentTheme.primaryColor 
                      : isAvailable 
                      ? 'white' 
                      : '#f3f4f6',
                    color: isSelected 
                      ? 'white' 
                      : isAvailable 
                      ? currentTheme.primaryColor 
                      : '#9ca3af',
                    borderColor: isSelected 
                      ? currentTheme.primaryColor 
                      : isAvailable 
                      ? currentTheme.primaryColor 
                      : '#d1d5db'
                  }}
                >
                  {number.toString().padStart(2, '0')}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          {selectedTickets.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setSelectedTickets([])}
                className="px-8 py-4 border-2 rounded-xl font-bold transition-all hover:scale-105"
                style={{
                  borderColor: currentTheme.primaryColor,
                  color: currentTheme.primaryColor,
                  backgroundColor: 'transparent'
                }}
              >
                Limpar Seleção
              </button>
              
              <button
                onClick={() => setShowPurchaseForm(true)}
                className="px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 flex items-center justify-center gap-3"
                style={{
                  backgroundColor: currentTheme.primaryColor,
                  color: 'white',
                  boxShadow: `0 10px 30px ${currentTheme.primaryColor}40`
                }}
              >
                <ShoppingCart className="w-6 h-6" />
                {currentTheme.purchaseButtonText} ({selectedTickets.length})
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-8" style={{backgroundColor: currentTheme.primaryColor}}>
          <p className="text-white text-lg font-medium" style={{fontFamily: currentTheme.fontFamily}}>
            {currentTheme.footerText}
          </p>
        </div>

        {/* Purchase Modal */}
        {showPurchaseForm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="p-6 text-white relative overflow-hidden" 
                   style={{background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`}}>
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <button 
                  onClick={() => setShowPurchaseForm(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all z-10"
                >
                  <span className="text-white text-xl font-bold">×</span>
                </button>
                <div className="relative">
                  <h3 className="text-2xl font-bold text-center mb-2">
                    Finalizar Compra
                  </h3>
                  <p className="text-center opacity-90 text-sm">
                    Preencha seus dados para reservar os números
                  </p>
                </div>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full p-4 border-2 rounded-xl focus:outline-none text-gray-900 bg-gray-50 focus:bg-white transition-colors"
                    style={{
                      borderColor: currentTheme.primaryColor + '30',
                      '--tw-ring-color': currentTheme.primaryColor
                    } as any}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    WhatsApp *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full p-4 border-2 rounded-xl focus:outline-none text-gray-900 bg-gray-50 focus:bg-white transition-colors"
                    style={{
                      borderColor: currentTheme.primaryColor + '30'
                    }}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    CPF (opcional)
                  </label>
                  <input
                    type="text"
                    value={customerInfo.cpf}
                    onChange={(e) => setCustomerInfo({...customerInfo, cpf: e.target.value})}
                    className="w-full p-4 border-2 rounded-xl focus:outline-none text-gray-900 bg-gray-50 focus:bg-white transition-colors"
                    style={{
                      borderColor: currentTheme.primaryColor + '30'
                    }}
                    placeholder="000.000.000-00"
                  />
                </div>

                {/* Purchase Summary */}
                <div className="rounded-xl border-2 overflow-hidden" 
                     style={{borderColor: currentTheme.primaryColor + '20'}}>
                  <div className="px-4 py-3" 
                       style={{background: `linear-gradient(135deg, ${currentTheme.primaryColor}15, ${currentTheme.secondaryColor}10)`}}>
                    <h4 className="font-bold text-sm uppercase tracking-wider" 
                        style={{color: currentTheme.primaryColor}}>
                      Resumo da Compra
                    </h4>
                  </div>
                  <div className="p-4 space-y-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Números escolhidos:</span>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                        {selectedTickets.sort((a, b) => a - b).map(num => (
                          <span 
                            key={num}
                            className="px-2 py-1 text-xs font-bold rounded text-white"
                            style={{backgroundColor: currentTheme.primaryColor}}
                          >
                            {num.toString().padStart(2, '0')}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Quantidade:</span>
                      <span className="font-semibold text-gray-900">{selectedTickets.length} números</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Valor unitário:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(raffle.ticketPrice)}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold" style={{color: currentTheme.primaryColor}}>
                        {formatCurrency(totalValue)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowPurchaseForm(false)}
                    className="flex-1 border-2 py-4 rounded-xl font-bold transition-all hover:bg-gray-50 text-gray-700"
                    style={{borderColor: '#e5e7eb'}}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handlePurchase}
                    className="flex-1 py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
                      boxShadow: `0 4px 15px ${currentTheme.primaryColor}40`
                    }}
                  >
                    Confirmar Compra
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ThemedRafflePage>
  );
};

export default PublicRafflePageThemed;