import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Ticket,
  Plus,
  Wallet,
  BarChart3,
  FileText,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Building2,
  Shield,
  TrendingUp,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Logo from '../components/common/Logo';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number | string;
  badgeColor?: string;
}

const DashboardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Mock user data - replace with real data from context
  const user = {
    name: 'Empresa Exemplo LTDA',
    cnpj: '12.345.678/0001-90',
    avatar: null,
    verificationStatus: 'verified' as 'verified' | 'pending' | 'rejected',
    scpcStatus: 'active' as 'active' | 'pending' | 'expired',
    scpcProtocol: 'SCPC/2024/001234',
    loteriaFederalVinculo: '001/2024'
  };

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/dashboard'
    },
    {
      id: 'my-promotions',
      label: 'Meus Sorteios',
      icon: <Ticket className="w-5 h-5" />,
      path: '/dashboard/my-promotions',
      badge: '3',
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'create',
      label: 'Criar Sorteio',
      icon: <Plus className="w-5 h-5" />,
      path: '/dashboard/create-promotion'
    },
    {
      id: 'my-tickets',
      label: 'Meus Bilhetes',
      icon: <Ticket className="w-5 h-5" />,
      path: '/dashboard/my-tickets',
      badge: '12'
    },
    {
      id: 'wallet',
      label: 'Carteira',
      icon: <Wallet className="w-5 h-5" />,
      path: '/dashboard/wallet',
      badge: 'R$ 1.2k',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'analytics',
      label: 'Análise',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/dashboard/analytics'
    },
    {
      id: 'compliance',
      label: 'SCPC/SECAP',
      icon: <Shield className="w-5 h-5" />,
      path: '/dashboard/compliance',
      badge: '!',
      badgeColor: 'bg-yellow-500'
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: <Settings className="w-5 h-5" />,
      path: '/dashboard/settings'
    }
  ];

  const bottomMenuItems: MenuItem[] = [
    {
      id: 'notifications',
      label: 'Notificações',
      icon: <Bell className="w-5 h-5" />,
      path: '/dashboard/notifications',
      badge: '5',
      badgeColor: 'bg-red-500'
    },
    {
      id: 'support',
      label: 'Suporte',
      icon: <HelpCircle className="w-5 h-5" />,
      path: '/dashboard/support'
    }
  ];

  const handleLogout = () => {
    // Implement logout logic
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-surface-800/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMobileSidebarOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
          <Logo size="small" />
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      <div className="flex h-screen pt-16 lg:pt-0">
        {/* Desktop Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: isSidebarCollapsed ? 80 : 280 }}
          className={`hidden lg:flex flex-col bg-surface-800/50 backdrop-blur-xl border-r border-white/10 relative`}
        >
          {/* Logo Section */}
          <div className="p-6 border-b border-white/10">
            {isSidebarCollapsed ? (
              <Logo size="small" showText={false} />
            ) : (
              <Logo size="medium" />
            )}
          </div>

          {/* User Info */}
          {!isSidebarCollapsed && (
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-primary-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{user.name}</p>
                  <p className="text-gray-400 text-xs">CNPJ: {user.cnpj}</p>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex gap-2">
                {user.verificationStatus === 'verified' ? (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    <CheckCircle className="w-3 h-3" />
                    Verificado
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    Pendente
                  </span>
                )}
                {user.scpcStatus === 'active' ? (
                  <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                    <Shield className="w-3 h-3" />
                    SCPC Ativo
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    SCPC Expirado
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    {!isSidebarCollapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className={`px-2 py-1 text-xs rounded-full ${item.badgeColor || 'bg-gray-600'} text-white`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Menu */}
          <div className="p-4 border-t border-white/10">
            <ul className="space-y-1">
              {bottomMenuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    {!isSidebarCollapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className={`px-2 py-1 text-xs rounded-full ${item.badgeColor || 'bg-gray-600'} text-white`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all w-full"
                >
                  <LogOut className="w-5 h-5" />
                  {!isSidebarCollapsed && <span>Sair</span>}
                </button>
              </li>
            </ul>
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 bg-surface-700 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </motion.aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-surface-800 z-50 flex flex-col"
              >
                {/* Mobile sidebar content - similar to desktop */}
                <div className="p-6 border-b border-white/10">
                  <Logo size="medium" />
                </div>

                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-primary-600 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{user.name}</p>
                      <p className="text-gray-400 text-xs">CNPJ: {user.cnpj}</p>
                    </div>
                  </div>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                  <ul className="space-y-1">
                    {menuItems.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                            isActive(item.path)
                              ? 'bg-primary-500/20 text-primary-400'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {item.icon}
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className={`px-2 py-1 text-xs rounded-full ${item.badgeColor || 'bg-gray-600'} text-white`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="p-4 border-t border-white/10">
                  <ul className="space-y-1">
                    {bottomMenuItems.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                            isActive(item.path)
                              ? 'bg-primary-500/20 text-primary-400'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {item.icon}
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className={`px-2 py-1 text-xs rounded-full ${item.badgeColor || 'bg-gray-600'} text-white`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all w-full"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sair</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;