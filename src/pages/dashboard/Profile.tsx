import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Save,
  Camera,
  Key,
  AlertCircle,
  CheckCircle,
  Trophy,
  Ticket,
  DollarSign,
  TrendingUp,
  Edit2,
  X,
  Loader2
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { userService, raffleService, ticketService } from '../../services/api'
import toast from 'react-hot-toast'

interface UserStats {
  totalRaffles: number
  activeRaffles: number
  totalTickets: number
  totalSpent: number
  totalEarned: number
  rafflesWon: number
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function Profile() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(true)
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cpf: user?.cpf || '',
    birthDate: user?.birthDate || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || ''
  })

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [stats, setStats] = useState<UserStats>({
    totalRaffles: 0,
    activeRaffles: 0,
    totalTickets: 0,
    totalSpent: 0,
    totalEarned: 0,
    rafflesWon: 0
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadUserStats()
  }, [user])

  const loadUserStats = async () => {
    if (!user?.id) return
    
    try {
      setStatsLoading(true)
      
      const allRaffles = await raffleService.getAll()
      const userRaffles = allRaffles.filter((r: any) => r.creatorId === user.id)
      const activeRaffles = userRaffles.filter((r: any) => r.status === 1)
      
      const userTickets = await ticketService.getByUser(user.id)
      
      const totalSpent = userTickets.reduce((sum: number, ticket: any) => {
        return sum + (ticket.value || 0)
      }, 0)
      
      let totalEarned = 0
      for (const raffle of userRaffles) {
        try {
          const raffleTickets = await ticketService.getByRaffle(raffle.id)
          const raffleRevenue = raffleTickets.reduce((sum: number, ticket: any) => {
            return sum + (ticket.value || raffle.ticketPrice || 0)
          }, 0)
          totalEarned += raffleRevenue
        } catch (err) {
          console.error('Error calculating raffle revenue:', err)
        }
      }
      
      setStats({
        totalRaffles: userRaffles.length,
        activeRaffles: activeRaffles.length,
        totalTickets: userTickets.length,
        totalSpent,
        totalEarned,
        rafflesWon: 0
      })
    } catch (error) {
      console.error('Error loading user stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateProfile = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email inválido'
    }
    
    if (profileData.phone && !/^\d{10,11}$/.test(profileData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Telefone inválido'
    }
    
    if (profileData.cpf && !/^\d{11}$/.test(profileData.cpf.replace(/\D/g, ''))) {
      newErrors.cpf = 'CPF inválido'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePassword = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória'
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória'
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Senha deve ter pelo menos 6 caracteres'
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveProfile = async () => {
    if (!validateProfile() || !user?.id) return
    
    setIsLoading(true)
    try {
      const updatedUser = await userService.update(user.id, profileData)
      updateUser(updatedUser)
      toast.success('Perfil atualizado com sucesso!')
      setIsEditing(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!validatePassword() || !user?.id) return
    
    setIsLoading(true)
    try {
      await userService.changePassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      toast.success('Senha alterada com sucesso!')
      setIsChangingPassword(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao alterar senha')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCPF = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/)
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`
    }
    return cpf
  }

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return phone
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600 mt-1">Gerencie suas informações pessoais</p>
            </div>
            {!isEditing && !isChangingPassword && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                <Edit2 className="w-5 h-5" />
                Editar Perfil
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                    <span className="text-4xl font-bold text-purple-600">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mt-4">
                  {user?.name || 'Usuário'}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
                
                {user?.isAdmin && (
                  <div className="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    Administrador
                  </div>
                )}

                <div className="mt-4 text-sm text-gray-500">
                  <p className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Membro desde {new Date(user?.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Rifas criadas</span>
                  <span className="font-semibold">{stats.totalRaffles}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Rifas ativas</span>
                  <span className="font-semibold text-green-600">{stats.activeRaffles}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Bilhetes comprados</span>
                  <span className="font-semibold">{stats.totalTickets}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Rifas ganhas</span>
                  <span className="font-semibold text-yellow-600">{stats.rafflesWon}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Resumo Financeiro</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Total gasto</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(stats.totalSpent)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Total arrecadado</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(stats.totalEarned)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Informações Pessoais</h2>
                {isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setErrors({})
                      setProfileData({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        cpf: user?.cpf || '',
                        birthDate: user?.birthDate || '',
                        address: user?.address || '',
                        city: user?.city || '',
                        state: user?.state || '',
                        zipCode: user?.zipCode || ''
                      })
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      !isEditing ? 'bg-gray-50' : ''
                    } ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      !isEditing ? 'bg-gray-50' : ''
                    } ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="(00) 00000-0000"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      !isEditing ? 'bg-gray-50' : ''
                    } ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={profileData.cpf}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="000.000.000-00"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      !isEditing ? 'bg-gray-50' : ''
                    } ${errors.cpf ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.cpf && (
                    <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={profileData.birthDate}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      !isEditing ? 'bg-gray-50' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={profileData.zipCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="00000-000"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      !isEditing ? 'bg-gray-50' : ''
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Rua, número, complemento"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      !isEditing ? 'bg-gray-50' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      !isEditing ? 'bg-gray-50' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    name="state"
                    value={profileData.state}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      !isEditing ? 'bg-gray-50' : ''
                    }`}
                  >
                    <option value="">Selecione</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setErrors({})
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Segurança</h2>
                {!isChangingPassword && !isEditing && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1"
                  >
                    <Key className="w-4 h-4" />
                    Alterar Senha
                  </button>
                )}
              </div>

              {isChangingPassword ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.currentPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.newPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => {
                        setIsChangingPassword(false)
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        })
                        setErrors({})
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Alterando...
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4" />
                          Alterar Senha
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-600">
                  <p className="mb-3">Mantenha sua conta segura:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Use uma senha forte com pelo menos 6 caracteres
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Não compartilhe sua senha com ninguém
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Altere sua senha regularmente
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações da Conta</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Exportar Dados</p>
                    <p className="text-sm text-gray-600">Baixe todos os seus dados em formato JSON</p>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors">
                    Exportar
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-900">Desativar Conta</p>
                    <p className="text-sm text-red-600">Desative temporariamente sua conta</p>
                  </div>
                  <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                    Desativar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}