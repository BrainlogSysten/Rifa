import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import RafflesPage from './pages/RafflesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LegalTermsPage from './pages/LegalTermsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import MyPromotions from './pages/dashboard/MyPromotions';
import MyTickets from './pages/dashboard/MyTickets';
import Wallet from './pages/dashboard/Wallet';
import DashboardSettings from './pages/dashboard/DashboardSettings';
import Compliance from './pages/dashboard/Compliance';
import CreatePromotion from './pages/dashboard/CreatePromotion';
import Analytics from './pages/dashboard/Analytics';
import Notifications from './pages/dashboard/Notifications';
import Support from './pages/dashboard/Support';
import HowItWorksPage from './pages/HowItWorksPage';
import WinnersPage from './pages/WinnersPage';
import CategoryPage from './pages/CategoryPage';
import RaffleDetailsPage from './pages/RaffleDetailsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/raffles" element={<RafflesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/legal-terms" element={<LegalTermsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Dashboard Routes - Protected */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardHome />} />
              <Route path="my-promotions" element={<MyPromotions />} />
              <Route path="my-tickets" element={<MyTickets />} />
              <Route path="create-promotion" element={<CreatePromotion />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="compliance" element={<Compliance />} />
              <Route path="settings" element={<DashboardSettings />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="support" element={<Support />} />
            </Route>
            {/* Legacy Dashboard */}
            <Route path="/dashboard-old" element={<Dashboard />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/winners" element={<WinnersPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/raffle/:id" element={<RaffleDetailsPage />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
