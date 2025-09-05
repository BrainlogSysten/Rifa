import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface AdminRouteProps {
  children: React.ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}