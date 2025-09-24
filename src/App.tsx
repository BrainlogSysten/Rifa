import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'

import HomePage from './pages/Home'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import RaffleDetailsPage from './pages/public/RaffleDetailsPage'
import PublicRaffles from './pages/public/PublicRaffles'
import PublicRafflePageThemed from './modules/client-system/pages/PublicRafflePageThemed'

import Dashboard from './pages/dashboard/Dashboard'
import MyRaffles from './pages/dashboard/MyRaffles'
import MyTickets from './pages/dashboard/MyTickets'
import CreateRaffleSimple from './pages/dashboard/CreateRaffleSimple'
import EditRaffle from './pages/dashboard/EditRaffle'
import Profile from './pages/dashboard/Profile'
import Settings from './pages/dashboard/Settings'

import AdminDashboard from './pages/dashboard/admin/AdminDashboard'
import PrizeManagement from './pages/dashboard/admin/PrizeManagement'
import UserManagement from './pages/dashboard/admin/UserManagement'

function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
  }, [])

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="rifas" element={<PublicRaffles />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="raffle/:id" element={<RaffleDetailsPage />} />
        </Route>

        <Route path="/r/:uniqueLink" element={<PublicRafflePageThemed />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="raffles" element={<MyRaffles />} />
          <Route path="tickets" element={<MyTickets />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />

          <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="admin/prizes" element={<AdminRoute><PrizeManagement /></AdminRoute>} />
          <Route path="admin/raffles/create" element={<AdminRoute><CreateRaffleSimple /></AdminRoute>} />
          <Route path="admin/raffles/:id/edit" element={<AdminRoute><EditRaffle /></AdminRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
    </ErrorBoundary>
  )
}

export default App