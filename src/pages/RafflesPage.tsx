import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import raffleService from '../services/raffleService';
import {
  Search,
  Filter,
  Grid,
  List,
  Clock,
  Users,
  Calendar,
  Car,
  Smartphone,
  Home,
  Gift,
  DollarSign,
  Gamepad2,
  Watch,
  Plane,
  ShoppingBag,
  Building2,
  Trophy,
  TrendingUp,
  Shield,
  ChevronDown,
  SortAsc,
  Ticket
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Raffle {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryIcon: React.ReactNode;
  price: number;
  prizeValue: number;
  soldTickets: number;
  totalTickets: number;
  drawDate: string;
  organizationName: string;
  organizationCNPJ: string;
  organizationLogo?: string;
  scpcAuthorization: string;
  scpcProtocol: string;
  loteriaFederalNumber: string;
  status: 'active' | 'ending_soon' | 'new' | 'hot';
  imageUrl?: string;
}

const RafflesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'popularity'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRaffles: 0,
    totalParticipants: 0,
    totalOrganizations: 0
  });

  // Calculate category counts dynamically
  const getCategoryCounts = () => {
    const counts: Record<string, number> = {};
    raffles.forEach(raffle => {
      counts[raffle.category] = (counts[raffle.category] || 0) + 1;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();
  const categories = [
    { id: 'all', name: 'Todos os Sorteios', icon: <Grid className="w-4 h-4" />, count: raffles.length },
    { id: 'cars', name: 'Veículos', icon: <Car className="w-4 h-4" />, count: categoryCounts.cars || 0 },
    { id: 'electronics', name: 'Eletrônicos', icon: <Smartphone className="w-4 h-4" />, count: categoryCounts.electronics || 0 },
    { id: 'home', name: 'Casa e Decoração', icon: <Home className="w-4 h-4" />, count: categoryCounts.home || 0 },
    { id: 'games', name: 'Games', icon: <Gamepad2 className="w-4 h-4" />, count: categoryCounts.games || 0 },
    { id: 'fashion', name: 'Moda e Acessórios', icon: <Watch className="w-4 h-4" />, count: categoryCounts.fashion || 0 },
    { id: 'travel', name: 'Viagens e Experiências', icon: <Plane className="w-4 h-4" />, count: categoryCounts.travel || 0 },
    { id: 'vouchers', name: 'Vales e Vouchers', icon: <ShoppingBag className="w-4 h-4" />, count: categoryCounts.vouchers || 0 }
  ];

  // Fetch data from backend
  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        setLoading(true);
        const response = await raffleService.getAllRaffles({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          sortBy: sortBy as any,
          search: searchTerm || undefined
        });

        // Transform backend data to frontend format
        const transformedRaffles: Raffle[] = response.raffles.map((raffle: any) => ({
          id: raffle.id,
          title: raffle.title,
          description: raffle.description,
          category: getCategoryFromType(raffle.type),
          categoryIcon: getCategoryIcon(raffle.type),
          price: raffle.ticketPrice,
          prizeValue: raffle.prizes?.[0]?.value || 0,
          soldTickets: raffle.ticketsSold || 0,
          totalTickets: raffle.numberOfTickets || raffle.totalTickets || 100,
          drawDate: raffle.drawDate,
          organizationName: raffle.user?.tradeName || raffle.user?.name || 'Organização',
          organizationCNPJ: raffle.user?.cnpj || '00.000.000/0001-00',
          scpcAuthorization: raffle.scpcAuthorizationNumber || raffle.sCPCAuthorizationNumber || 'Em processo',
          scpcProtocol: raffle.scpcProtocol || `SCPC/${new Date().getFullYear()}/000000`,
          loteriaFederalNumber: raffle.loteriaFederalNumber || '001/2024',
          status: getStatus(raffle),
          imageUrl: getImageUrl(raffle)
        }));

        setRaffles(transformedRaffles);

        // Calculate real stats
        const uniqueOrganizations = new Set(transformedRaffles.map(r => r.organizationName)).size;
        const totalParticipants = transformedRaffles.reduce((sum, r) => sum + r.soldTickets, 0);

        setStats({
          totalRaffles: transformedRaffles.length,
          totalParticipants,
          totalOrganizations: uniqueOrganizations
        });
      } catch (error) {
        console.error('Error fetching raffles:', error);
        setRaffles([]);
        setStats({ totalRaffles: 0, totalParticipants: 0, totalOrganizations: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchRaffles();
  }, [selectedCategory, sortBy, searchTerm]);

  // Helper functions
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

  const getCategoryIcon = (type: any): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      'Car': <Car className="w-5 h-5" />,
      'Electronic': <Smartphone className="w-5 h-5" />,
      'Property': <Home className="w-5 h-5" />,
      'Travel': <Plane className="w-5 h-5" />,
      'Experience': <Gift className="w-5 h-5" />,
      'Fashion': <Watch className="w-5 h-5" />,
      'Home': <Home className="w-5 h-5" />,
      'Games': <Gamepad2 className="w-5 h-5" />,
      'Vouchers': <ShoppingBag className="w-5 h-5" />,
      'Other': <Gift className="w-5 h-5" />
    };
    return iconMap[type] || <Gift className="w-5 h-5" />;
  };

  const getStatus = (raffle: any): 'active' | 'ending_soon' | 'new' | 'hot' => {
    const now = new Date();
    const drawDate = new Date(raffle.drawDate);
    const daysDiff = Math.ceil((drawDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 3) return 'ending_soon';
    if (raffle.ticketsSold / (raffle.numberOfTickets || 100) > 0.8) return 'hot';

    const createdDate = new Date(raffle.createdAt);
    const daysSinceCreation = Math.ceil((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceCreation <= 7) return 'new';

    return 'active';
  };

  const getImageUrl = (raffle: any): string => {
    // Check if there's a real image URL from API
    if (raffle.coverImageUrl && raffle.coverImageUrl !== 'https://example.com/iphone.jpg') {
      return raffle.coverImageUrl;
    }

    if (raffle.images && raffle.images.length > 0) {
      return raffle.images[0];
    }

    // Map category to appropriate placeholder
    const category = getCategoryFromType(raffle.type);
    const imageMap: Record<string, string> = {
      'cars': '/images/placeholders/car1.jpg',
      'electronics': '/images/placeholders/electronics1.jpg',
      'home': '/images/placeholders/house1.jpg',
      'games': '/images/placeholders/gaming1.jpg',
      'travel': '/images/placeholders/car2.jpg', // Using car2 as travel placeholder
      'fashion': '/images/placeholders/electronics1.jpg',
      'vouchers': '/images/placeholders/house1.jpg'
    };

    return imageMap[category] || '/images/placeholders/electronics1.jpg';
  };

  // Filtrar sorteios promocionais
  const filteredRaffles = raffles.filter(raffle => {
    const matchesSearch = raffle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          raffle.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          raffle.organizationName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || raffle.category === selectedCategory;

    let matchesPrice = true;
    if (priceRange === 'low') matchesPrice = raffle.price <= 20;
    else if (priceRange === 'medium') matchesPrice = raffle.price > 20 && raffle.price <= 50;
    else if (priceRange === 'high') matchesPrice = raffle.price > 50;

    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'date') return new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime();
    if (sortBy === 'popularity') return b.soldTickets - a.soldTickets;
    return 0;
  });

  const getStatusBadge = (status: Raffle['status']) => {
    switch (status) {
      case 'hot':
        return <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-semibold">EM ALTA</span>;
      case 'ending_soon':
        return <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-semibold">TERMINA BREVE</span>;
      case 'new':
        return <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-semibold">NOVO</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-900 via-surface-800 to-surface-900 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Sorteios Promocionais Autorizados
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Participe de promoções comerciais 100% regulamentadas.
              Todos os sorteios são autorizados pelo SCPC e vinculados à Loteria Federal.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-surface-800/50 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">{stats.totalRaffles}</span>
                <span className="text-gray-400">Sorteios Ativos</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">
                  {stats.totalParticipants > 999
                    ? `${(stats.totalParticipants / 1000).toFixed(1)}k`
                    : stats.totalParticipants}
                </span>
                <span className="text-gray-400">Participantes</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">{stats.totalOrganizations}</span>
                <span className="text-gray-400">Empresas Promotoras</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-secondary-400" />
              <span className="text-sm text-gray-300">
                Todos os sorteios com autorização SCPC
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="card p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar sorteios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-modern w-full pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="input-modern min-w-[150px]"
                >
                  <option value="date">Data do Sorteio</option>
                  <option value="price">Menor Preço</option>
                  <option value="popularity">Mais Populares</option>
                </select>
                <div className="flex rounded-lg bg-white/10 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-all ${
                      viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-all ${
                      viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-white/10"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Categoria</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="input-modern w-full"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} ({cat.count})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Faixa de Preço</label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value as any)}
                      className="input-modern w-full"
                    >
                      <option value="all">Todos os preços</option>
                      <option value="low">Até R$ 20</option>
                      <option value="medium">R$ 20 - R$ 50</option>
                      <option value="high">Acima de R$ 50</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Categories Quick Filter */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                }`}
              >
                {cat.icon}
                <span>{cat.name}</span>
                <span className="text-xs opacity-70">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Raffles Grid/List */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="bg-white/10 h-48 rounded-lg mb-4"></div>
                <div className="bg-white/10 h-6 rounded mb-2"></div>
                <div className="bg-white/10 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRaffles.map((raffle, index) => (
              <motion.div
                key={raffle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="overflow-hidden hover:scale-105 transition-transform duration-300 flex flex-col"
              >
                {/* Card Content */}
                <div className="card flex-1">
                  <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 relative">
                    {raffle.imageUrl && (
                      <img
                        src={raffle.imageUrl}
                        alt={raffle.title}
                        className="w-full h-full object-cover opacity-50"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      {getStatusBadge(raffle.status)}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                      <p className="text-white font-bold text-lg">R$ {raffle.price}</p>
                      <p className="text-gray-300 text-xs">por bilhete</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-green-400 font-semibold">Autorizado SCPC</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Building2 className="w-3 h-3" />
                        <span>{raffle.organizationName}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {raffle.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {raffle.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Valor do Prêmio</span>
                        <span className="text-green-400 font-semibold">
                          R$ {raffle.prizeValue.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-500">Vendidos</span>
                          <span className="text-white">
                            {raffle.soldTickets.toLocaleString()}/{raffle.totalTickets.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(raffle.soldTickets / raffle.totalTickets) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Sorteio</span>
                        <span className="text-white flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(raffle.drawDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <div className="border-t border-white/10 pt-3 mt-3">
                        <p className="text-xs text-gray-500">Vinculado à Loteria Federal</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button Container */}
                <div className="p-4 bg-surface-800/50 border-t border-white/10">
                  <Link
                    to={`/raffle/${raffle.id}`}
                    className="btn-primary w-full text-center"
                  >
                    <Ticket className="w-4 h-4 inline mr-2" />
                    Comprar Bilhetes
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRaffles.map((raffle, index) => (
              <motion.div
                key={raffle.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card p-6 hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-64 aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden">
                    {raffle.imageUrl && (
                      <img
                        src={raffle.imageUrl}
                        alt={raffle.title}
                        className="w-full h-full object-cover opacity-50"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(raffle.status)}
                          <span className="text-sm text-gray-400">
                            {raffle.organizationName}
                          </span>
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-2">
                          {raffle.title}
                        </h3>
                        <p className="text-gray-400 mb-4">
                          {raffle.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-white">R$ {raffle.price}</p>
                        <p className="text-sm text-gray-400">por bilhete</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Valor do Prêmio</p>
                        <p className="text-green-400 font-semibold">
                          R$ {raffle.prizeValue.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bilhetes Vendidos</p>
                        <p className="text-white">
                          {raffle.soldTickets.toLocaleString()}/{raffle.totalTickets.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Data do Sorteio</p>
                        <p className="text-white">
                          {new Date(raffle.drawDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Autorização SPA</p>
                        <p className="text-white flex items-center gap-1">
                          <Shield className="w-4 h-4 text-green-400" />
                          {raffle.scpcAuthorization}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="w-full bg-white/10 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(raffle.soldTickets / raffle.totalTickets) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {Math.round((raffle.soldTickets / raffle.totalTickets) * 100)}% vendido
                        </p>
                      </div>
                      <Link
                        to={`/raffle/${raffle.id}`}
                        className="btn-primary"
                      >
                        <Ticket className="w-4 h-4 inline mr-2" />
                        Comprar Bilhetes
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredRaffles.length === 0 && !loading && (
          <div className="text-center py-16">
            <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum sorteio promocional encontrado
            </h3>
            <p className="text-gray-400">
              Tente ajustar os filtros ou realizar uma nova busca
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RafflesPage;