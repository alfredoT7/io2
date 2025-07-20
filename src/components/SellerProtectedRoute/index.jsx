import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { ShoppingCartContext } from '../../Context'
import { Layout } from '../Layout'

const SellerProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading, user } = useContext(ShoppingCartContext)

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando permisos...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  // Si no es vendedor, mostrar mensaje de acceso denegado
  if (user?.tipoUsuario !== 'vendedor') {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Acceso Restringido
            </h2>
            <p className="text-gray-600 mb-6">
              Esta funcionalidad está disponible únicamente para usuarios vendedores.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Volver Atrás
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Ir al Inicio
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return children
}

export { SellerProtectedRoute }
