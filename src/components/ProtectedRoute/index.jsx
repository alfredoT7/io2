import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { ShoppingCartContext } from '../../Context'

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, authLoading } = useContext(ShoppingCartContext)

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  // Si requiere autenticación y no está autenticado, redirigir al login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  // Si no requiere autenticación y está autenticado, redirigir al inicio (para login/register)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export { ProtectedRoute }
