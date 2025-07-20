import { useState, useContext } from 'react'
import { Layout } from '../../components/Layout'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { buildApiUrl, API_CONFIG } from '../../config/api'
import { ShoppingCartContext } from '../../Context'

function Register() {
  const navigate = useNavigate()
  const { login } = useContext(ShoppingCartContext)
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    numeroCelular: '',
    email: '',
    direccion: '',
    password: '',
    confirmPassword: '',
    tipoUsuario: 'comprador'
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

  const validateForm = () => {
    if (!formData.nombreCompleto.trim()) {
      setError('El nombre completo es requerido')
      return false
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Ingresa un email válido')
      return false
    }
    if (!formData.numeroCelular.trim()) {
      setError('El número de celular es requerido')
      return false
    }
    // Validar formato de celular boliviano (8 dígitos, empezando con 6, 7 u 8)
    const celularPattern = /^[678]\d{7}$/
    if (!celularPattern.test(formData.numeroCelular.trim())) {
      setError('El número de celular debe tener 8 dígitos y empezar con 6, 7 u 8')
      return false
    }
    if (formData.tipoUsuario === 'comprador' && !formData.direccion.trim()) {
      setError('La dirección es requerida para compradores')
      return false
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) return

    setLoading(true)
    
    try {
      const dataToSend = {
        nombreCompleto: formData.nombreCompleto,
        numeroCelular: formData.numeroCelular,
        email: formData.email,
        password: formData.password,
        tipoUsuario: formData.tipoUsuario
      }

      // Solo incluir dirección para compradores
      if (formData.tipoUsuario === 'comprador') {
        dataToSend.direccion = formData.direccion
      }

      console.log('Datos a enviar:', dataToSend)

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      })

      const result = await response.json()
      console.log('Respuesta del servidor:', result)

      if (response.ok) {
        // El backend ya devuelve token y usuario, entonces iniciamos sesión automáticamente
        login(result.usuario, result.token)
        
        toast.success(`¡Registro exitoso!`, {
          description: `Bienvenido ${result.usuario.nombreCompleto}, ya tienes tu cuenta activa`,
          duration: 4000,
        })
        
        // Redirigir al inicio después del registro y login automático
        navigate('/')
      } else {
        console.error('Error del servidor:', result)
        toast.error('Error en el registro', {
          description: result.message || 'Verifica los datos e intenta nuevamente',
          duration: 4000,
        })
      }
    } catch (err) {
      console.error('Error de conexión:', err)
      toast.error('Error de conexión', {
        description: 'Verifica que el servidor esté funcionando',
        duration: 4000,
      })
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Crear cuenta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => navigate('/signin')}
                className="font-medium text-green-600 hover:text-green-500"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
          
          <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Tipo de Usuario */}
            <div>
              <label htmlFor="tipoUsuario" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Usuario
              </label>
              <select
                id="tipoUsuario"
                name="tipoUsuario"
                value={formData.tipoUsuario}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="comprador">Comprador</option>
                <option value="vendedor">Vendedor</option>
              </select>
            </div>

            {/* Nombre Completo */}
            <div>
              <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                id="nombreCompleto"
                name="nombreCompleto"
                type="text"
                required
                value={formData.nombreCompleto}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Ingresa tu nombre completo"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
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

            {/* Número Celular */}
            <div>
              <label htmlFor="numeroCelular" className="block text-sm font-medium text-gray-700 mb-2">
                Número de Celular *
              </label>
              <input
                id="numeroCelular"
                name="numeroCelular"
                type="tel"
                required
                value={formData.numeroCelular}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="78901234"
              />
            </div>

            {/* Dirección (solo para compradores) */}
            {formData.tipoUsuario === 'comprador' && (
              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <textarea
                  id="direccion"
                  name="direccion"
                  required
                  value={formData.direccion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Calle Murillo #123, Zona Central, La Paz, Bolivia"
                />
              </div>
            )}

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Repite tu contraseña"
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
                    Registrando...
                  </div>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export { Register }
