import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService, userService, User } from '../services/api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getCurrentUser()
      if (storedUser && authService.isAuthenticated()) {
        setUser(storedUser)
        
        try {
          const freshUser = await userService.getById(storedUser.id)
          if (freshUser) {
            const updatedUser = { ...storedUser, ...freshUser }
            setUser(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser))
          }
        } catch (err) {
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password)
    setUser(response.user)
  }

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const response = await authService.register({ name, email, password, phone })
    setUser(response.user)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}