import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface PurchaseSectionProps {
  raffleId: string;
  raffleTitle: string;
  raffleImage?: string;
  ticketPrice: number;
  maxTicketsPerUser: number;
  totalTickets: number;
  ticketsSold: number;
  endDate: string;
}

const PurchaseSection: React.FC<PurchaseSectionProps> = ({
  raffleId,
  raffleTitle,
  raffleImage,
  ticketPrice,
  maxTicketsPerUser,
  totalTickets,
  ticketsSold,
  endDate
}) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [soldNumbers, setSoldNumbers] = useState<number[]>([]);
  const [searchNumber, setSearchNumber] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchAvailableNumbers();
  }, [raffleId]);

  const fetchAvailableNumbers = async () => {
    try {
      const response = await api.get(`/api/raffles/${raffleId}/available-numbers`);
      const availableNumbers = response.data;

      const allNumbers = Array.from({ length: totalTickets }, (_, i) => i + 1);
      const sold = allNumbers.filter(num => !availableNumbers.includes(num));
      setSoldNumbers(sold);
    } catch (error) {
      console.error('Error fetching available numbers:', error);
      // Fallback: simulate some sold numbers
      const mockSoldNumbers = Array.from({ length: 150 }, () =>
        Math.floor(Math.random() * totalTickets) + 1
      );
      setSoldNumbers(mockSoldNumbers);
    }
  };

  const handleNumberSelect = (number: number) => {
    if (soldNumbers.includes(number)) return;

    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(prev => prev.filter(n => n !== number));
    } else {
      if (selectedNumbers.length < maxTicketsPerUser) {
        setSelectedNumbers(prev => [...prev, number]);
      }
    }
  };

  const selectRandomNumbers = (count: number) => {
    const available = [];
    for (let i = 1; i <= totalTickets; i++) {
      if (!soldNumbers.includes(i) && !selectedNumbers.includes(i)) {
        available.push(i);
      }
    }

    const maxToSelect = Math.min(count, available.length, maxTicketsPerUser - selectedNumbers.length);
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
    if (num > 0 && num <= totalTickets) {
      handleNumberSelect(num);
      setSearchNumber('');
    }
  };

  const getNumberStatus = (number: number): 'available' | 'selected' | 'sold' => {
    if (soldNumbers.includes(number)) return 'sold';
    if (selectedNumbers.includes(number)) return 'selected';
    return 'available';
  };

  const handleParticipate = () => {
    const numbersGridElement = document.querySelector('.grid.grid-cols-10');
    if (numbersGridElement) {
      numbersGridElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegulations = () => {
    alert(`Regulamento do Sorteio Promocional - ${raffleTitle}\n\n1. O sorteio promocional é válido até ${new Date(endDate).toLocaleDateString()}\n2. Máximo de ${maxTicketsPerUser} números por participante\n3. Valor por número: R$ ${ticketPrice.toFixed(2)}\n4. Total de números: ${totalTickets}\n5. O sorteio será realizado na data limite\n6. O ganhador será notificado por email e telefone\n7. O prêmio deve ser retirado em até 30 dias\n8. Em caso de dúvidas, entre em contato conosco`);
  };

  const handleWinners = () => {
    alert('Página de ganhadores em desenvolvimento.\nEm breve você poderá consultar todos os ganhadores dos sorteios promocionais anteriores!');
  };

  const handlePurchase = async () => {
    if (selectedNumbers.length === 0) return;

    setIsProcessing(true);
    try {
      const purchaseResponse = await api.post(`/api/raffles/${raffleId}/purchase-tickets`, {
        ticketNumbers: selectedNumbers,
        paymentMethod: paymentMethod,
        customerInfo: customerInfo
      });

      const purchase = purchaseResponse.data;

      if (paymentMethod === 'pix' && purchase.paymentDetails?.pixQrCode) {
        alert(`PIX gerado! Chave: ${purchase.paymentDetails.pixKey}\nTotal: R$ ${purchase.totalAmount.toFixed(2)}`);
      }

      alert(`Compra realizada! ID: ${purchase.purchaseId}\nNúmeros: ${selectedNumbers.join(', ')}`);
      setSelectedNumbers([]);
      fetchAvailableNumbers();
    } catch (error: any) {
      console.error('Payment error:', error);
      alert('Erro ao processar pagamento');
    } finally {
      setIsProcessing(false);
    }
  };

  const progressPercentage = (ticketsSold / totalTickets) * 100;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-cyan-400 pb-4 mb-6">
          <div className="flex items-center gap-2 text-sm mb-2">
            <span>Início</span>
            <span>/</span>
            <span>Sorteio</span>
            <span>/</span>
            <span>Carro</span>
          </div>
          <h1 className="text-2xl font-bold">{raffleTitle}</h1>
          <p className="text-gray-400">Carro | R$ {ticketPrice.toFixed(2)} | Número até {totalTickets.toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Car Image Placeholder */}
            <div className="bg-gray-800 rounded-lg p-8 mb-6 min-h-[300px] flex items-center justify-center">
              <div className="text-gray-500">Imagem do Carro</div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={handleParticipate}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
              >
                Participar
              </button>
              <button
                onClick={handleRegulations}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
              >
                Regulamento
              </button>
              <button
                onClick={handleWinners}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm"
              >
                Ganhadores
              </button>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso</span>
                <span>Data limite: {new Date(endDate).toLocaleDateString()}</span>
              </div>
              <div className="bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-400 h-2 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-green-400 text-sm mt-1">
                {ticketsSold.toLocaleString()} vendidos
              </div>
            </div>

            {/* Number Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Selecione seus números</h3>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mb-4">
                <input
                  type="number"
                  placeholder="Buscar número"
                  value={searchNumber}
                  onChange={(e) => setSearchNumber(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm w-32"
                  min="1"
                  max={totalTickets}
                />
                <button
                  onClick={searchAndSelectNumber}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                >
                  Buscar
                </button>
                <button
                  onClick={() => selectRandomNumbers(1)}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                >
                  +1
                </button>
                <button
                  onClick={() => selectRandomNumbers(5)}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                >
                  +5
                </button>
                <button
                  onClick={() => selectRandomNumbers(10)}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                >
                  +10
                </button>
                <button
                  onClick={() => setSelectedNumbers([])}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                >
                  Limpar
                </button>
              </div>

              {/* Numbers Grid */}
              <div className="grid grid-cols-10 gap-1 mb-6 max-h-96 overflow-y-auto">
                {Array.from({ length: Math.min(totalTickets, 1000) }, (_, i) => i + 1).map((number) => {
                  const status = getNumberStatus(number);
                  return (
                    <button
                      key={number}
                      onClick={() => handleNumberSelect(number)}
                      disabled={status === 'sold'}
                      className={`
                        w-12 h-12 rounded text-xs font-medium transition-colors
                        ${status === 'sold'
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : status === 'selected'
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                        }
                      `}
                    >
                      {number}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Checkout Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Checkout</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Valor por cota</span>
                  <span className="text-green-400">R$ {ticketPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Tickets selecionados ({selectedNumbers.length})</span>
                </div>

                <div className="text-gray-400 text-sm">
                  Números selecionados:
                  {selectedNumbers.length === 0 && (
                    <div className="mt-1">Nenhum número selecionado</div>
                  )}
                </div>

                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-green-400">R$ {(selectedNumbers.length * ticketPrice).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                disabled={selectedNumbers.length === 0 || isProcessing}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 rounded font-semibold text-white transition-colors"
              >
                {isProcessing ? 'Processando...' : 'Finalizar pagamento'}
              </button>

              <div className="text-xs text-gray-400 mt-2 text-center">
                PIX • Cartão • Boleto
              </div>

              {/* Guarantee */}
              <div className="mt-6 p-3 bg-gray-700 rounded">
                <h4 className="font-semibold mb-2">Garantia e Transparência</h4>
                <p className="text-xs text-gray-300">
                  Sorteio autorizado na data limite. Comprove e questione.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSection;