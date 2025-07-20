import { useState, useContext } from 'react'
import { Layout } from '../../components/Layout'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { buildApiUrl, API_CONFIG } from '../../config/api'
import { ShoppingCartContext } from '../../Context'

function CreateProduct() {
  const navigate = useNavigate()
  const { user, token, refreshProducts } = useContext(ShoppingCartContext)
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: 'limpieza ecológica',
    image: '',
    stock: '',
    rating: {
      rate: 0,
      count: 0
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'price' || name === 'stock') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Verificar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen es muy grande', {
          description: 'Por favor selecciona una imagen menor a 5MB',
          duration: 4000,
        })
        return
      }

      // Verificar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Formato no válido', {
          description: 'Por favor selecciona un archivo de imagen',
          duration: 4000,
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        setFormData(prev => ({
          ...prev,
          image: base64String
        }))
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('El título es requerido')
      return false
    }
    if (!formData.price || formData.price <= 0) {
      setError('El precio debe ser mayor a 0')
      return false
    }
    if (!formData.description.trim()) {
      setError('La descripción es requerida')
      return false
    }
    if (!formData.image) {
      setError('La imagen es requerida')
      return false
    }
    if (!formData.stock || formData.stock < 0) {
      setError('El stock debe ser 0 o mayor')
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
        title: formData.title,
        price: formData.price,
        description: formData.description,
        category: formData.category,
        image: formData.image,
        stock: formData.stock,
        rating: {
          rate: 4.5, // Valor inicial
          count: 0   // Sin reviews iniciales
        }
      }

      console.log('Datos del producto a enviar:', dataToSend)

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.CREATE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      })

      const result = await response.json()
      console.log('Respuesta del servidor:', result)

      if (response.ok) {
        toast.success('¡Producto creado exitosamente!', {
          description: 'Tu producto ya está disponible para la venta',
          duration: 4000,
        })
        
        // Refresh products list
        await refreshProducts()
        
        navigate('/ventas')
      } else {
        console.error('Error del servidor:', result)
        toast.error('Error al crear producto', {
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Crear Nuevo Producto
            </h1>
            <p className="text-gray-600">
              Agrega un nuevo producto a tu catálogo de ventas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título del Producto *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Ej: Pastillas Efervescentes Limón - Pack 20 unidades"
              />
            </div>

            {/* Precio */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Precio (USD) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="15.99"
              />
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="limpieza ecológica">Limpieza Ecológica</option>
                <option value="electronics">Electrónicos</option>
                <option value="hogar">Hogar</option>
                <option value="salud">Salud y Belleza</option>
                <option value="otros">Otros</option>
              </select>
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                Stock Disponible *
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="25"
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Producto *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Describe las características, beneficios y usos de tu producto..."
              />
            </div>

            {/* Imagen */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Imagen del Producto *
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Formato: JPG, PNG, WebP. Tamaño máximo: 5MB
              </p>
              
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/ventas')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </div>
                ) : (
                  'Crear Producto'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export { CreateProduct }
