import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import {
  Menu,
  X,
  User,
  LogIn,
  Plus,
  ChevronDown,
  Home,
  Grid,
  Trophy,
  HelpCircle,
  Bell,
  Settings,
  LogOut,
  Sparkles,
  Wallet,
  Car,
  Bike,
  Smartphone,
  Plane,
  Building2,
  Scale
} from 'lucide-react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/raffles', label: 'Sorteios Ativos', icon: <Grid className="w-4 h-4" /> },
    { href: '/how-it-works', label: 'Como Funciona', icon: <HelpCircle className="w-4 h-4" /> },
    { href: '/winners', label: 'Ganhadores', icon: <Trophy className="w-4 h-4" /> },
    { href: '/legal-terms', label: 'Compliance SCPC', icon: <Scale className="w-4 h-4" /> },
  ];

  const categories = [
    { href: '/category/cars', label: 'Carros', icon: <Car className="w-4 h-4" /> },
    { href: '/category/motorcycles', label: 'Motos', icon: <Bike className="w-4 h-4" /> },
    { href: '/category/electronics', label: 'Eletrônicos', icon: <Smartphone className="w-4 h-4" /> },
    { href: '/category/travel', label: 'Viagens', icon: <Plane className="w-4 h-4" /> },
    { href: '/category/experiences', label: 'Experiências', icon: <Trophy className="w-4 h-4" /> },
    { href: '/category/real-estate', label: 'Imóveis', icon: <Building2 className="w-4 h-4" /> },
  ];

  const userMenuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { href: '/my-raffles', label: 'Meus Sorteios', icon: <Grid className="w-4 h-4" /> },
    { href: '/wallet', label: 'Carteira', icon: <Wallet className="w-4 h-4" /> },
    { href: '/settings', label: 'Configurações', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-dark-500/95 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="group"
            >
              <Logo size="medium" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Main Nav Links */}
              <div className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300
                      ${location.pathname === link.href
                        ? 'text-secondary-400 bg-secondary-500/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}

                {/* Categories Dropdown */}
                <div className="relative">
                  <button
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                  >
                    <Sparkles className="w-4 h-4" />
                    Categorias
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                        className="absolute top-full mt-2 w-56 glass rounded-xl p-2 shadow-2xl"
                      >
                        {categories.map((category) => (
                          <Link
                            key={category.href}
                            to={category.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300"
                          >
                            <span className="text-gray-400">{category.icon}</span>
                            <span className="text-gray-300 hover:text-white">{category.label}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <button className="relative p-2 rounded-lg hover:bg-white/5 transition-all duration-300">
                  <Bell className="w-5 h-5 text-gray-300" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </button>

                {/* Create Promotion Button */}
                <Link
                  to="/create-raffle"
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Cadastrar Sorteio</span>
                </Link>

                {/* User Menu / Login */}
                {isLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-300"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-secondary-400 to-primary-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full right-0 mt-2 w-64 glass rounded-xl p-2 shadow-2xl"
                        >
                          <div className="px-4 py-3 border-b border-white/10">
                            <p className="text-sm text-gray-400">Empresa</p>
                            <p className="font-semibold">Exemplo LTDA</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-1 bg-secondary-500/20 text-secondary-400 rounded-full">
                                CNPJ Verificado
                              </span>
                            </div>
                          </div>

                          {userMenuItems.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300"
                            >
                              {item.icon}
                              <span className="text-gray-300">{item.label}</span>
                            </Link>
                          ))}

                          <div className="border-t border-white/10 mt-2 pt-2">
                            <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-400 transition-all duration-300 w-full">
                              <LogOut className="w-4 h-4" />
                              <span>Sair</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="btn-secondary flex items-center gap-2"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Entrar</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-secondary-400" />
              ) : (
                <Menu className="w-6 h-6 text-secondary-400" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <nav className="absolute right-0 top-0 h-full w-full max-w-sm bg-surface-500/95 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col h-full pt-20 pb-6 px-6">
                {/* Mobile Nav Links */}
                <div className="flex-1 space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-300"
                    >
                      {link.icon}
                      <span className="text-gray-300">{link.label}</span>
                    </Link>
                  ))}

                  <div className="py-2">
                    <p className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500">
                      Categorias
                    </p>
                    {categories.map((category) => (
                      <Link
                        key={category.href}
                        to={category.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-300"
                      >
                        <span className="text-gray-400">{category.icon}</span>
                        <span className="text-gray-300">{category.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="space-y-3 pt-6 border-t border-white/10">
                  <Link
                    to="/create-raffle"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Cadastrar Sorteio</span>
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Entrar</span>
                  </Link>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;