import { useState, useContext } from 'react'
import { Layout } from '../../components/Layout'
import { ShoppingCartContext } from '../../Context'
import { buildApiUrl, API_CONFIG } from '../../config/api'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

function Checkout() {
  const navigate = useNavigate()
  const { cartProducts, user, token, setOrder, setCartProducts, closeCheckoutSideMenu } = useContext(ShoppingCartContext)
  
  const [formData, setFormData] = useState({
    metodoPago: 'efectivo',
    direccion: '',
    ciudad: '',
    telefono: '',
    notas: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Calcular total
  const getTotalPrice = () => {
    return cartProducts.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida'
    }
    
    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es requerida'
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    if (cartProducts.length === 0) {
      toast.error('Tu carrito está vacío')
      return
    }

    setLoading(true)

    try {
      // Verificar que tenemos el token
      if (!token) {
        toast.error('Error de autenticación', {
          description: 'Por favor inicia sesión nuevamente',
          duration: 4000,
        })
        navigate('/signin')
        return
      }

      // Preparar datos según el formato de tu API
      const purchaseData = {
        productos: cartProducts.map(product => ({
          id: product.id,
          nombre: product.title,
          precio: product.price,
          cantidad: product.quantity || 1,
          imagen: product.image
        })),
        metodoPago: formData.metodoPago,
        envio: {
          direccion: formData.direccion,
          ciudad: formData.ciudad,
          codigoPostal: "0000", // Valor por defecto (backend lo requiere)
          telefono: formData.telefono
        },
        notas: formData.notas || ''
      }

      console.log('Datos de compra a enviar:', purchaseData)
      console.log('Token usado:', token)
      console.log('📦 Productos en el carrito:', cartProducts)
      console.log('💰 Método de pago seleccionado:', formData.metodoPago)
      console.log('📍 Datos de envío:', {
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        telefono: formData.telefono
      })

      // Hacer la petición directamente con el token del contexto
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ORDERS.CREATE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(purchaseData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error del servidor:', errorData)
        throw new Error(errorData.message || `Error ${response.status}`)
      }

      const result = await response.json()
      console.log('Respuesta de compra:', result)

      // Guardar orden en el contexto
      const newOrder = {
        id: result.id || Date.now(),
        date: new Date().toLocaleDateString(),
        products: cartProducts,
        totalProducts: cartProducts.length,
        totalPrice: getTotalPrice(),
        status: 'Procesando'
      }

      setOrder(prevOrder => [...prevOrder, newOrder])
      
      // Crear mensaje para WhatsApp con detalles del pedido
      const phoneNumber = "59167439775" // Número de la empresa sin + ni espacios
      
      const productDetails = cartProducts.map((product, index) => 
        `${index + 1}. ${product.title}\n   • Precio: Bs ${product.price}\n   • Cantidad: ${product.quantity || 1}\n   • Subtotal: Bs ${(product.price * (product.quantity || 1)).toFixed(2)}`
      ).join('\n\n')

      const whatsappMessage = `🛒 *NUEVO PEDIDO - MASTER CLEAN*\n\n` +
        `📋 *Detalles del Pedido:*\n` +
        `• ID: ${result.id || newOrder.id}\n` +
        `• Fecha: ${new Date().toLocaleString()}\n\n` +
        
        `🛍️ *Productos:*\n${productDetails}\n\n` +
        
        `💰 *Resumen:*\n` +
        `• Total de productos: ${cartProducts.length}\n` +
        `• Total a pagar: Bs ${getTotalPrice().toFixed(2)}\n` +
        `• Método de pago: ${formData.metodoPago === 'efectivo' ? '💵 Efectivo al momento de entrega' : formData.metodoPago}\n\n` +
        
        `📍 *Datos de Entrega:*\n` +
        `• Dirección: ${formData.direccion}\n` +
        `• Ciudad: ${formData.ciudad}\n` +
        `• Teléfono: ${formData.telefono}\n` +
        `${formData.notas ? `• Notas: ${formData.notas}\n` : ''}` +
        
        `\n✅ *Confirmación requerida*\n` +
        `Hola, acabo de realizar este pedido en Master Clean. Por favor confirmen la disponibilidad y procedan con el proceso de entrega. ¡Gracias!`

      // Codificar mensaje para URL
      const encodedMessage = encodeURIComponent(whatsappMessage)
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

      // Limpiar carrito
      setCartProducts([])
      
      // Cerrar checkout
      closeCheckoutSideMenu()

      // Abrir WhatsApp inmediatamente
      window.open(whatsappUrl, '_blank')

      toast.success('¡Compra realizada exitosamente!', {
        description: 'Se ha abierto WhatsApp para confirmar tu pedido',
        duration: 4000,
      })

      // Redirigir a mis pedidos después de un momento
      setTimeout(() => {
        navigate('/my-orders')
      }, 2000)

    } catch (error) {
      console.error('Error al procesar compra:', error)
      toast.error('Error al procesar la compra', {
        description: 'Por favor intenta nuevamente',
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  if (cartProducts.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Carrito Vacío
            </h2>
            <p className="text-gray-600 mb-6">
              Agrega algunos productos antes de proceder al checkout.
            </p>
            <button
              onClick={() => navigate('/ventas')}
              className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Ir a Comprar
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Finalizar Compra
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Checkout */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Información de Envío
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.direccion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Av. Siempre Viva 123"
                />
                {errors.direccion && (
                  <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>
                )}
              </div>

              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.ciudad ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="La Paz"
                  />
                  {errors.ciudad && (
                    <p className="text-red-500 text-sm mt-1">{errors.ciudad}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.telefono ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="67443153"
                />
                {errors.telefono && (
                  <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de Pago
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-gray-900">� Efectivo</span>
                </div>
                <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 mb-2">
                    💰 Pago en efectivo al momento de la entrega
                  </p>
                  <p className="text-xs text-green-600">
                    Asegúrate de tener el monto exacto disponible.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas Adicionales
                </label>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Entrega preferible por la mañana"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    💵 Confirmar Compra - Bs {getTotalPrice().toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Resumen del Pedido */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Resumen del Pedido
            </h2>
            
            <div className="space-y-4 mb-6">
              {cartProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 text-sm">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Cantidad: {product.quantity || 1}
                    </p>
                    <p className="text-green-600 font-semibold">
                      Bs {(product.price * (product.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">Bs {getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Envío:</span>
                <span className="font-medium text-green-600">Gratis</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-gray-800 border-t border-gray-200 pt-2">
                <span>Total:</span>
                <span>Bs {getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">
                📦 Información de Entrega
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Entrega en 2-3 días hábiles</li>
                <li>• Envío gratuito en toda la ciudad</li>
                <li>• Seguimiento en tiempo real</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export { Checkout }
