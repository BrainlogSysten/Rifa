import { useState, useEffect } from 'react'
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  ShieldOff,
  X,
  Save,
  Mail,
  Phone,
  Calendar,
  Ban,
  CheckCircle,
} from 'lucide-react'
import { userService, User } from '../../../services/api'
import toast from 'react-hot-toast'

interface UserModalData {
  id: string
  name: string
  email: string
  phone: string
  isAdmin: boolean
  isEnabled: boolean
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewMode, setIsViewMode] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<UserModalData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterRole, setFilterRole] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, filterStatus, filterRole])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const data = await userService.getAll()
      setUsers(data)
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Erro ao carregar usuários')
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
      )
    }

    if (filterStatus) {
      filtered = filtered.filter(user =>
        filterStatus === 'enabled' ? user.isEnabled : !user.isEnabled
      )
    }

    if (filterRole) {
      filtered = filtered.filter(user =>
        filterRole === 'admin' ? user.isAdmin : !user.isAdmin
      )
    }

    setFilteredUsers(filtered)
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsViewMode(true)
    setIsModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditingUser({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      isAdmin: user.isAdmin,
      isEnabled: user.isEnabled
    })
    setIsViewMode(false)
    setIsModalOpen(true)
  }

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar o usuário "${name}"? Esta ação não pode ser desfeita.`)) {
      return
    }

    try {
      await userService.delete(id)
      toast.success('Usuário deletado com sucesso')
      loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Erro ao deletar usuário')
    }
  }

  const handleToggleEnabled = async (user: User) => {
    try {
      const updatedUser = { ...user, isEnabled: !user.isEnabled }
      await userService.update(user.id, updatedUser)
      toast.success(
        user.isEnabled 
          ? 'Usuário desabilitado com sucesso' 
          : 'Usuário habilitado com sucesso'
      )
      loadUsers()
    } catch (error) {
      console.error('Error toggling user status:', error)
      toast.error('Erro ao alterar status do usuário')
    }
  }

  const handleToggleAdmin = async (user: User) => {
    try {
      const updatedUser = { ...user, isAdmin: !user.isAdmin }
      await userService.update(user.id, updatedUser)
      toast.success(
        user.isAdmin 
          ? 'Privilégios de admin removidos com sucesso' 
          : 'Usuário promovido a admin com sucesso'
      )
      loadUsers()
    } catch (error) {
      console.error('Error toggling admin status:', error)
      toast.error('Erro ao alterar privilégios do usuário')
    }
  }

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingUser) return

    try {
      await userService.update(editingUser.id, editingUser)
      toast.success('Usuário atualizado com sucesso')
      setIsModalOpen(false)
      setEditingUser(null)
      loadUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Erro ao atualizar usuário')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
    setEditingUser(null)
    setIsViewMode(false)
  }

  const getStatusBadge = (user: User) => {
    if (!user.isEnabled) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <Ban className="w-3 h-3 mr-1" />
          Desabilitado
        </span>
      )
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Ativo
      </span>
    )
  }

  const getRoleBadge = (user: User) => {
    return user.isAdmin ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        <Shield className="w-3 h-3 mr-1" />
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <Users className="w-3 h-3 mr-1" />
        Usuário
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-gray-200 rounded-lg h-96"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
          <p className="text-gray-600">Gerencie todos os usuários da plataforma</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {users.length} usuários
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ativos</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.isEnabled).length}
              </p>
            </div>
            <UserCheck className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Desabilitados</p>
              <p className="text-2xl font-bold text-red-600">
                {users.filter(u => !u.isEnabled).length}
              </p>
            </div>
            <UserX className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.isAdmin).length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos os status</option>
            <option value="enabled">Ativos</option>
            <option value="disabled">Desabilitados</option>
          </select>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos os tipos</option>
            <option value="admin">Administradores</option>
            <option value="user">Usuários</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum usuário encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Papel
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-600">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.phone || 'Não informado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Editar usuário"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleEnabled(user)}
                          className={user.isEnabled ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                          title={user.isEnabled ? 'Desabilitar' : 'Habilitar'}
                        >
                          {user.isEnabled ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleToggleAdmin(user)}
                          className={user.isAdmin ? 'text-orange-600 hover:text-orange-900' : 'text-purple-600 hover:text-purple-900'}
                          title={user.isAdmin ? 'Remover admin' : 'Tornar admin'}
                        >
                          {user.isAdmin ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="text-red-600 hover:text-red-900"
                          title="Deletar usuário"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleCloseModal}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {isViewMode ? (
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Detalhes do Usuário
                    </h3>
                    <button
                      onClick={handleCloseModal}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-xl font-semibold text-purple-600">
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(selectedUser)}
                          {getRoleBadge(selectedUser)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="text-sm text-gray-900">{selectedUser.email}</p>
                        </div>
                      </div>

                      {selectedUser.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Telefone</p>
                            <p className="text-sm text-gray-900">{selectedUser.phone}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">ID do Usuário</p>
                          <p className="text-xs text-gray-600 font-mono">{selectedUser.id}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleEditUser(selectedUser)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Editar</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveUser}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Editar Usuário
                      </h3>
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome
                        </label>
                        <input
                          type="text"
                          required
                          value={editingUser?.name || ''}
                          onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={editingUser?.email || ''}
                          onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          value={editingUser?.phone || ''}
                          onChange={(e) => setEditingUser(prev => prev ? { ...prev, phone: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="(11) 99999-9999"
                        />
                      </div>

                      <div className="flex items-center space-x-6">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editingUser?.isEnabled || false}
                            onChange={(e) => setEditingUser(prev => prev ? { ...prev, isEnabled: e.target.checked } : null)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-900">Usuário ativo</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editingUser?.isAdmin || false}
                            onChange={(e) => setEditingUser(prev => prev ? { ...prev, isAdmin: e.target.checked } : null)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-900">É administrador</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}