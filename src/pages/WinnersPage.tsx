import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Crown,
  Star,
  Calendar,
  MapPin,
  Gift,
  PartyPopper,
  Medal,
  Award,
  TrendingUp,
  Users,
  DollarSign,
  Search,
  Filter,
  ChevronDown
} from 'lucide-react';

interface Winner {
  id: string;
  name: string;
  city: string;
  state: string;
  raffleTitle: string;
  prize: string;
  prizeValue: number;
  ticketNumber: string;
  drawDate: string;
  organizationName: string;
  imageUrl?: string;
  testimonial?: string;
}

const WinnersPage: React.FC = () => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'month' | 'year'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data - substituir por dados reais da API
  const winners: Winner[] = [
    {
      id: '1',
      name: 'Carlos Silva',
      city: 'São Paulo',
      state: 'SP',
      raffleTitle: 'iPhone 15 Pro Max - ABC Solidária',
      prize: 'iPhone 15 Pro Max 256GB',
      prizeValue: 9500,
      ticketNumber: '001234',
      drawDate: '2024-01-15',
      organizationName: 'ABC Solidária',
      testimonial: 'Nunca imaginei que ganharia! Obrigado Sort.IO e ABC Solidária!'
    },
    {
      id: '2',
      name: 'Maria Santos',
      city: 'Rio de Janeiro',
      state: 'RJ',
      raffleTitle: 'Honda CG 160 - Instituto Esperança',
      prize: 'Honda CG 160 Titan 0km',
      prizeValue: 18000,
      ticketNumber: '005678',
      drawDate: '2024-01-10',
      organizationName: 'Instituto Esperança',
      testimonial: 'Agora posso ir trabalhar com mais facilidade. Muito grata!'
    },
    {
      id: '3',
      name: 'João Oliveira',
      city: 'Belo Horizonte',
      state: 'MG',
      raffleTitle: 'MacBook Pro - ONG Vida Nova',
      prize: 'MacBook Pro M3 14"',
      prizeValue: 15000,
      ticketNumber: '003456',
      drawDate: '2024-01-05',
      organizationName: 'ONG Vida Nova'
    },
    {
      id: '4',
      name: 'Ana Paula',
      city: 'Curitiba',
      state: 'PR',
      raffleTitle: 'Vale Compras R$ 5.000',
      prize: 'Vale Compras',
      prizeValue: 5000,
      ticketNumber: '007890',
      drawDate: '2023-12-25',
      organizationName: 'Associação Moradores Vila Rica'
    },
    {
      id: '5',
      name: 'Pedro Almeida',
      city: 'Salvador',
      state: 'BA',
      raffleTitle: 'PlayStation 5 - Instituto Esperança',
      prize: 'PlayStation 5 + 2 Jogos',
      prizeValue: 4500,
      ticketNumber: '002468',
      drawDate: '2023-12-20',
      organizationName: 'Instituto Esperança',
      testimonial: 'Meu filho ficou super feliz com o presente de Natal!'
    },
    {
      id: '6',
      name: 'Fernanda Costa',
      city: 'Brasília',
      state: 'DF',
      raffleTitle: 'Smart TV 65" - ABC Solidária',
      prize: 'Smart TV Samsung 65" 4K',
      prizeValue: 3500,
      ticketNumber: '009012',
      drawDate: '2023-12-15',
      organizationName: 'ABC Solidária'
    }
  ];

  const stats = {
    totalWinners: 1247,
    totalPrizes: 3500000,
    activeRaffles: 45,
    totalOrganizations: 23
  };

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'electronics', label: 'Eletrônicos' },
    { value: 'vehicles', label: 'Veículos' },
    { value: 'vouchers', label: 'Vale Compras' },
    { value: 'others', label: 'Outros' }
  ];

  const filteredWinners = winners.filter(winner => {
    const matchesSearch = winner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          winner.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          winner.prize.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesPeriod = true;
    if (filterPeriod === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      matchesPeriod = new Date(winner.drawDate) >= oneMonthAgo;
    } else if (filterPeriod === 'year') {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      matchesPeriod = new Date(winner.drawDate) >= oneYearAgo;
    }

    return matchesSearch && matchesPeriod;
  });

  const featuredWinner = winners[0]; // Vencedor em destaque

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-900 via-surface-800 to-surface-900 pt-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 to-orange-600 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 relative"
        >
          <div className="text-center max-w-4xl mx-auto">
            <Trophy className="w-20 h-20 text-white mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-white mb-6">
              Nossos Ganhadores
            </h1>
            <p className="text-xl text-white/90">
              Conheça as histórias de sucesso de quem já ganhou prêmios incríveis
              e ajudou causas sociais importantes
            </p>
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-10 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-yellow-400" />
              <span className="text-3xl font-bold text-white">
                {stats.totalWinners.toLocaleString()}
              </span>
            </div>
            <p className="text-gray-300">Total de Ganhadores</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-400" />
              <span className="text-3xl font-bold text-white">
                R$ {(stats.totalPrizes / 1000000).toFixed(1)}M
              </span>
            </div>
            <p className="text-gray-300">Em Prêmios Entregues</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <Gift className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-bold text-white">
                {stats.activeRaffles}
              </span>
            </div>
            <p className="text-gray-300">Sorteios Ativos</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-purple-400" />
              <span className="text-3xl font-bold text-white">
                {stats.totalOrganizations}
              </span>
            </div>
            <p className="text-gray-300">Organizações Beneficiadas</p>
          </motion.div>
        </div>
      </div>

      {/* Featured Winner */}
      {featuredWinner && (
        <div className="container mx-auto px-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30"
          >
            <div className="flex items-center gap-4 mb-6">
              <Crown className="w-8 h-8 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Ganhador em Destaque</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {featuredWinner.name}
                </h3>
                <p className="text-gray-400 mb-4">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  {featuredWinner.city}, {featuredWinner.state}
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Prêmio Ganho</p>
                    <p className="text-xl font-semibold text-white">
                      {featuredWinner.prize}
                    </p>
                    <p className="text-green-400">
                      R$ {featuredWinner.prizeValue.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Número Sorteado</p>
                    <p className="text-lg font-mono text-primary-400">
                      {featuredWinner.ticketNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data do Sorteio</p>
                    <p className="text-white">
                      {new Date(featuredWinner.drawDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                {featuredWinner.testimonial && (
                  <div className="bg-white/5 rounded-xl p-6">
                    <PartyPopper className="w-8 h-8 text-yellow-400 mb-4" />
                    <p className="text-lg text-gray-300 italic">
                      "{featuredWinner.testimonial}"
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                      - {featuredWinner.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="container mx-auto px-4 mb-8">
        <div className="card p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, cidade ou prêmio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-modern w-full pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-modern min-w-[180px]"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className="flex rounded-lg bg-white/10 p-1">
                <button
                  onClick={() => setFilterPeriod('all')}
                  className={`px-4 py-2 rounded transition-all ${
                    filterPeriod === 'all'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilterPeriod('month')}
                  className={`px-4 py-2 rounded transition-all ${
                    filterPeriod === 'month'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Mês
                </button>
                <button
                  onClick={() => setFilterPeriod('year')}
                  className={`px-4 py-2 rounded transition-all ${
                    filterPeriod === 'year'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Ano
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Winners List */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWinners.map((winner, index) => (
            <motion.div
              key={winner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {winner.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {winner.city}, {winner.state}
                    </p>
                  </div>
                </div>
                <Medal className="w-5 h-5 text-yellow-400" />
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Prêmio</p>
                  <p className="text-white font-medium">{winner.prize}</p>
                  <p className="text-green-400 text-sm">
                    R$ {winner.prizeValue.toLocaleString('pt-BR')}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Sorteio</p>
                  <p className="text-gray-300 text-sm">{winner.raffleTitle}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div>
                    <p className="text-xs text-gray-500">Número</p>
                    <p className="font-mono text-primary-400">
                      {winner.ticketNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Sorteio</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(winner.drawDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {winner.testimonial && (
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-sm text-gray-400 italic">
                      "{winner.testimonial}"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredWinners.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nenhum ganhador encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinnersPage;