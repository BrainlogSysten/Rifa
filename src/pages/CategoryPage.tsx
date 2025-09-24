import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import raffleService from '../services/raffleService';
import {
  Car,
  Smartphone,
  Home,
  Gift,
  DollarSign,
  Gamepad2,
  Monitor,
  Watch,
  Plane,
  ShoppingBag,
  Search,
  Filter,
  SortAsc,
  Calendar,
  Users,
  Ticket,
  Clock,
  TrendingUp,
  ChevronRight
} from 'lucide-react';

interface Raffle {
  id: string;
  title: string;
  description: string;
  prize: string;
  prizeValue: number;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  drawDate: string;
  imageUrl: string;
  organizationName: string;
  category: string;
}

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'date' | 'popularity'>('date');
  const [filterPrice, setFilterPrice] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = {
    cars: {
      name: 'Carros e Motos',
      icon: <Car className="w-8 h-8" />,
      color: 'from-red-600 to-orange-600',
      description: 'Veículos 0km e seminovos'
    },
    electronics: {
      name: 'Eletrônicos',
      icon: <Smartphone className="w-8 h-8" />,
      color: 'from-blue-600 to-cyan-600',
      description: 'Smartphones, notebooks, TVs e mais'
    },
    home: {
      name: 'Casa e Decoração',
      icon: <Home className="w-8 h-8" />,
      color: 'from-green-600 to-teal-600',
      description: 'Móveis, eletrodomésticos e decoração'
    },
    games: {
      name: 'Games e Consoles',
      icon: <Gamepad2 className="w-8 h-8" />,
      color: 'from-purple-600 to-pink-600',
      description: 'PlayStation, Xbox, Nintendo e jogos'
    },
    fashion: {
      name: 'Moda e Acessórios',
      icon: <Watch className="w-8 h-8" />,
      color: 'from-pink-600 to-rose-600',
      description: 'Roupas, calçados, relógios e joias'
    },
    travel: {
      name: 'Viagens e Experiências',
      icon: <Plane className="w-8 h-8" />,
      color: 'from-indigo-600 to-blue-600',
      description: 'Pacotes de viagem e experiências únicas'
    },
    vouchers: {
      name: 'Vale Compras',
      icon: <ShoppingBag className="w-8 h-8" />,
      color: 'from-yellow-600 to-orange-600',
      description: 'Vales compras e gift cards'
    },
    others: {
      name: 'Outros Prêmios',
      icon: <Gift className="w-8 h-8" />,
      color: 'from-gray-600 to-gray-700',
      description: 'Diversos outros prêmios incríveis'
    }
  };

  const currentCategory = categories[category as keyof typeof categories] || categories.others;

  // Helper function to map backend category to frontend
  const mapCategoryToBackend = (frontendCategory: string): string => {
    const categoryMap: Record<string, string> = {
      'cars': 'Car',
      'electronics': 'Electronic',
      'home': 'Home',
      'games': 'Games',
      'fashion': 'Fashion',
      'travel': 'Travel',
      'vouchers': 'Vouchers',
      'others': 'Other'
    };
    return categoryMap[frontendCategory] || 'Other';
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchCategoryRaffles = async () => {
      try {
        setLoading(true);
        const backendCategory = mapCategoryToBackend(category || 'others');
        const response = await raffleService.getRafflesByCategory(backendCategory);

        // Transform backend data to frontend format
        const transformedRaffles: Raffle[] = response.map((raffle: any) => ({
          id: raffle.id,
          title: raffle.title,
          description: raffle.description,
          prize: raffle.prizes?.[0]?.title || raffle.title,
          prizeValue: raffle.prizes?.[0]?.value || 0,
          ticketPrice: raffle.ticketPrice,
          totalTickets: raffle.numberOfTickets || raffle.totalTickets || 100,
          soldTickets: raffle.ticketsSold || 0,
          drawDate: raffle.drawDate,
          imageUrl: raffle.coverImageUrl || raffle.images?.[0] || '/images/placeholder.jpg',
          organizationName: raffle.user?.tradeName || raffle.user?.name || 'Organização',
          category: category || 'others'
        }));

        setRaffles(transformedRaffles);
      } catch (error) {
        console.error('Error fetching category raffles:', error);
        setRaffles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryRaffles();
  }, [category]);

  // Aplicar filtros e ordenação
  const processedRaffles = raffles
    .filter(raffle => {
      const matchesSearch = raffle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           raffle.prize.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesPrice = true;
      if (filterPrice === 'low') matchesPrice = raffle.ticketPrice <= 20;
      else if (filterPrice === 'medium') matchesPrice = raffle.ticketPrice > 20 && raffle.ticketPrice <= 50;
      else if (filterPrice === 'high') matchesPrice = raffle.ticketPrice > 50;

      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.ticketPrice - b.ticketPrice;
      if (sortBy === 'date') return new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime();
      if (sortBy === 'popularity') return b.soldTickets - a.soldTickets;
      return 0;
    });

  const stats = {
    totalRaffles: processedRaffles.length,
    avgPrice: processedRaffles.reduce((acc, r) => acc + r.ticketPrice, 0) / processedRaffles.length || 0,
    totalPrizeValue: processedRaffles.reduce((acc, r) => acc + r.prizeValue, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-900 via-surface-800 to-surface-900 pt-20">
      {/* Category Header */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${currentCategory.color} py-16`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-sm">
                {currentCategory.icon}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {currentCategory.name}
                </h1>
                <p className="text-white/90 text-lg">
                  {currentCategory.description}
                </p>
              </div>
            </div>
            <div className="hidden lg:flex gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.totalRaffles}</p>
                <p className="text-white/80 text-sm">Sorteios Ativos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  R$ {Math.round(stats.avgPrice)}
                </p>
                <p className="text-white/80 text-sm">Preço Médio</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">
            Início
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/raffles" className="hover:text-white transition-colors">
            Sorteios Promocionais
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{currentCategory.name}</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 mb-8">
        <div className="card p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar sorteios promocionais..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-modern w-full pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value as any)}
                className="input-modern min-w-[150px]"
              >
                <option value="all">Todos os preços</option>
                <option value="low">Até R$ 20</option>
                <option value="medium">R$ 20 - R$ 50</option>
                <option value="high">Acima de R$ 50</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="input-modern min-w-[150px]"
              >
                <option value="date">Data do sorteio</option>
                <option value="price">Menor preço</option>
                <option value="popularity">Mais vendidos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Raffles Grid */}
      <div className="container mx-auto px-4 pb-16">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="bg-white/10 h-48 rounded-lg mb-4"></div>
                <div className="bg-white/10 h-6 rounded mb-2"></div>
                <div className="bg-white/10 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : processedRaffles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedRaffles.map((raffle, index) => (
              <motion.div
                key={raffle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 relative">
                  <img
                    src={raffle.imageUrl}
                    alt={raffle.title}
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    R$ {raffle.ticketPrice}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {raffle.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {raffle.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Valor do Prêmio</span>
                      <span className="text-green-400 font-semibold">
                        R$ {raffle.prizeValue.toLocaleString('pt-BR')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Vendidos</span>
                      <span className="text-white">
                        {raffle.soldTickets}/{raffle.totalTickets}
                      </span>
                    </div>

                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                        style={{ width: `${(raffle.soldTickets / raffle.totalTickets) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Sorteio</span>
                      <span className="text-white flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(raffle.drawDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-white/10">
                      <p className="text-xs text-gray-500 mb-1">Organização</p>
                      <p className="text-sm text-white">{raffle.organizationName}</p>
                    </div>
                  </div>

                  <Link
                    to={`/raffle/${raffle.id}`}
                    className="btn-primary w-full mt-4 text-center"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum sorteio promocional encontrado
            </h3>
            <p className="text-gray-400 mb-8">
              Não há sorteios promocionais disponíveis nesta categoria no momento
            </p>
            <Link to="/raffles" className="btn-secondary">
              Ver todos os sorteios promocionais
            </Link>
          </div>
        )}
      </div>

      {/* Related Categories */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white mb-8">
          Outras Categorias
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {Object.entries(categories)
            .filter(([key]) => key !== category)
            .map(([key, cat]) => (
              <Link
                key={key}
                to={`/category/${key}`}
                className="card p-4 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white`}>
                  {cat.icon}
                </div>
                <p className="text-sm text-gray-300">{cat.name}</p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;