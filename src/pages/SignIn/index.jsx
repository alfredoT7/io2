import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCartContext } from "../../Context";
import { toast } from 'sonner';
import { buildApiUrl, API_CONFIG } from '../../config/api';

function SignIn() {
  const navigate = useNavigate()
  const { login } = useContext(ShoppingCartContext)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    
    try {
      console.log('Datos del login:', formData)
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      console.log('Respuesta del login:', result)

      if (response.ok) {
        // Usar el sistema de auth del contexto
        login(result.usuario, result.token)
        navigate('/')
      } else {
        console.error('Error del servidor en login:', result)
        toast.error('Error al iniciar sesión', {
          description: result.message || 'Verifica tus credenciales',
          duration: 4000,
        })
      }
    } catch (err) {
      console.error('Error de conexión en login:', err)
      toast.error('Error de conexión', {
        description: 'Verifica que el servidor esté funcionando',
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => navigate('/register')}
                className="font-medium text-green-600 hover:text-green-500"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
          
          <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="ejemplo@correo.com"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Tu contraseña"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                className="font-medium text-sm text-green-600 hover:text-green-500"
                onClick={() => toast.info('Funcionalidad próximamente', {
                  description: 'La recuperación de contraseña estará disponible pronto',
                  duration: 3000,
                })}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        </div>
      </div>
  )
}

export { SignIn }