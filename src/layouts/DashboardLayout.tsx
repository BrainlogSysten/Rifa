import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  Menu,
  X,
  Home,
  Ticket,
  Plus,
  User,
  Settings,
  LogOut,
  Trophy,
  HelpCircle,
  Receipt,
  Shield,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/dashboard', label: 'Início', icon: Home },
    { path: '/dashboard/raffles', label: 'Minhas Rifas', icon: Trophy },
    { path: '/dashboard/tickets', label: 'Meus Bilhetes', icon: Receipt },
    { path: '/dashboard/raffles/create', label: 'Criar Rifa', icon: Plus, highlight: true },
    { path: '/dashboard/profile', label: 'Meu Perfil', icon: User },
    { path: '/dashboard/help', label: 'Ajuda', icon: HelpCircle },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col bg-white border-r">
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <Ticket className="h-8 w-8 text-purple-600" />
            <span className="font-bold text-xl text-gray-900">
              RIFAMODERNA
            </span>
          </Link>
        </div>

        <div className="px-4 py-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-sm text-gray-500">{user?.email || 'email@example.com'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-purple-50 text-purple-600'
                  : item.highlight
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          ))}
          
          {user?.isAdmin && (
            <>
              <div className="my-4 border-t border-gray-200" />
              <Link
                to="/dashboard/admin"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname.startsWith('/dashboard/admin')
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <Shield className="mr-3 h-5 w-5" />
                Painel Admin
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      <div className="md:hidden sticky top-0 z-40 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-700 hover:text-gray-900"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <Ticket className="h-6 w-6 text-purple-600" />
            <span className="font-bold text-lg text-gray-900">
              RIFAMODERNA
            </span>
          </Link>
          <Link to="/dashboard/profile">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </Link>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setIsSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-lg text-gray-900">Menu</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-4 py-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {user?.name || 'Usuário'}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email || 'email@example.com'}</p>
                </div>
              </div>
            </div>

            <nav className="px-4 py-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-purple-50 text-purple-600'
                      : item.highlight
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              ))}
              
              {user?.isAdmin && (
                <>
                  <div className="my-4 border-t border-gray-200" />
                  <Link
                    to="/dashboard/admin"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname.startsWith('/dashboard/admin')
                        ? 'bg-red-50 text-red-600'
                        : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    <Shield className="mr-3 h-5 w-5" />
                    Painel Admin
                  </Link>
                </>
              )}
            </nav>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sair
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="md:pl-64">
        <Outlet />
      </div>
    </div>
  )
}