import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  Shield,
  Bell,
  CreditCard,
  Lock,
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
  Save,
  AlertTriangle,
  CheckCircle,
  FileText,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';

const DashboardSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form states
  const [companyData, setCompanyData] = useState({
    tradeName: 'Empresa Exemplo LTDA',
    legalName: 'Empresa Exemplo Limitada',
    cnpj: '12.345.678/0001-90',
    stateRegistration: '123.456.789.110',
    email: 'contato@empresaexemplo.com.br',
    phone: '(11) 98765-4321',
    address: 'Rua Exemplo, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    website: 'www.empresaexemplo.com.br'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newPurchases: true,
    withdrawals: true,
    complianceAlerts: true,
    promotionUpdates: true,
    weeklyReport: true
  });

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'company', label: 'Dados da Empresa', icon: <Building2 className="w-4 h-4" /> },
    { id: 'security', label: 'Segurança', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notificações', icon: <Bell className="w-4 h-4" /> },
    { id: 'payment', label: 'Pagamento', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'documents', label: 'Documentos', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Configurações</h1>
          <p className="text-gray-400 mt-1">Gerencie as configurações da sua conta</p>
        </div>
        {saved && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg"
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400">Configurações salvas!</span>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="card p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Company Data */}
          {activeTab === 'company' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-400" />
                Dados da Empresa
              </h2>

              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-white font-semibold">Logo da Empresa</p>
                  <p className="text-gray-400 text-sm">JPG, PNG ou GIF. Máximo 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Nome Fantasia</label>
                  <input
                    type="text"
                    value={companyData.tradeName}
                    onChange={(e) => setCompanyData({ ...companyData, tradeName: e.target.value })}
                    className="input-modern w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Razão Social</label>
                  <input
                    type="text"
                    value={companyData.legalName}
                    onChange={(e) => setCompanyData({ ...companyData, legalName: e.target.value })}
                    className="input-modern w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">CNPJ</label>
                  <input
                    type="text"
                    value={companyData.cnpj}
                    onChange={(e) => setCompanyData({ ...companyData, cnpj: e.target.value })}
                    className="input-modern w-full"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Inscrição Estadual</label>
                  <input
                    type="text"
                    value={companyData.stateRegistration}
                    onChange={(e) => setCompanyData({ ...companyData, stateRegistration: e.target.value })}
                    className="input-modern w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={companyData.email}
                      onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                      className="input-modern w-full pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                      className="input-modern w-full pl-10"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-400 mb-2 block">Endereço</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={companyData.address}
                      onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                      className="input-modern w-full pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Cidade</label>
                  <input
                    type="text"
                    value={companyData.city}
                    onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                    className="input-modern w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Estado</label>
                  <select
                    value={companyData.state}
                    onChange={(e) => setCompanyData({ ...companyData, state: e.target.value })}
                    className="input-modern w-full"
                  >
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    {/* Add more states */}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">CEP</label>
                  <input
                    type="text"
                    value={companyData.zipCode}
                    onChange={(e) => setCompanyData({ ...companyData, zipCode: e.target.value })}
                    className="input-modern w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={companyData.website}
                      onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                      className="input-modern w-full pl-10"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-400" />
                Segurança da Conta
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Senha Atual</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                      className="input-modern w-full pl-10 pr-10"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Nova Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                      className="input-modern w-full pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Confirmar Nova Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                      className="input-modern w-full pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary-400" />
                  Autenticação de Dois Fatores
                </h3>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">2FA Ativado</p>
                    <p className="text-gray-400 text-sm">Adiciona uma camada extra de segurança</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityData.twoFactor}
                      onChange={(e) => setSecurityData({ ...securityData, twoFactor: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>

              <button onClick={handleSave} className="btn-primary">
                <Save className="w-5 h-5" />
                Atualizar Segurança
              </button>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary-400" />
                Preferências de Notificação
              </h2>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Canais de Notificação</h3>
                {[
                  { id: 'emailNotifications', label: 'Notificações por E-mail', icon: <Mail className="w-5 h-5" /> },
                  { id: 'smsNotifications', label: 'Notificações por SMS', icon: <Phone className="w-5 h-5" /> },
                  { id: 'pushNotifications', label: 'Notificações Push', icon: <Bell className="w-5 h-5" /> }
                ].map((channel) => (
                  <div key={channel.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400">{channel.icon}</div>
                      <p className="text-white">{channel.label}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings[channel.id as keyof typeof notificationSettings] as boolean}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          [channel.id]: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Tipos de Notificação</h3>
                {[
                  { id: 'newPurchases', label: 'Novas compras de bilhetes' },
                  { id: 'withdrawals', label: 'Saques processados' },
                  { id: 'complianceAlerts', label: 'Alertas de compliance' },
                  { id: 'promotionUpdates', label: 'Atualizações de sorteios' },
                  { id: 'weeklyReport', label: 'Relatório semanal' }
                ].map((type) => (
                  <div key={type.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <p className="text-white">{type.label}</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings[type.id as keyof typeof notificationSettings] as boolean}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          [type.id]: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                ))}
              </div>

              <button onClick={handleSave} className="btn-primary">
                <Save className="w-5 h-5" />
                Salvar Preferências
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;