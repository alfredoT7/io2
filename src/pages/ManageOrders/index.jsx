import { useState, useEffect, useContext } from 'react'
import { toast } from 'sonner'
import { 
  EyeIcon, 
  CheckCircleIcon, 
  ClockIcon,
  TruckIcon,
  XCircleIcon,
  ShoppingBagIcon,
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../Context'
import { buildApiUrl } from '../../config/api'
import './ManageOrders.css'

function ManageOrders() {
  const { token } = useContext(ShoppingCartContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [verifyingOrder, setVerifyingOrder] = useState(null)
  const [filters, setFilters] = useState({
    estado: '',
    usuario: '',
    fechaInicio: '',
    fechaFin: '',
    page: 1,
    limit: 10
  })
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  // Obtener todas las compras
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key])
        }
      })

      const response = await fetch(buildApiUrl(`/api/compras?${queryParams.toString()}`), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const result = await response.json()
      console.log('Orders received:', result)
      
      setOrders(result.compras || result.data || [])
      setTotalPages(result.totalPages || 1)
      
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Error al cargar las compras', {
        description: 'No se pudieron cargar las compras del sistema',
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  // Verificar una compra (cambiar de pendiente a verificado)
  const verifyOrder = async (orderId) => {
    try {
      setVerifyingOrder(orderId)
      
      const response = await fetch(buildApiUrl(`/api/compras/${orderId}/verificar`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error HTTP: ${response.status}`)
      }

      const result = await response.json()
      console.log('Order verified:', result)
      
      toast.success('Compra verificada exitosamente', {
        description: 'El estado ha sido actualizado a verificado',
        duration: 3000,
      })
      
      // Actualizar la lista de compras
      await fetchOrders()
      
    } catch (error) {
      console.error('Error verifying order:', error)
      toast.error('Error al verificar la compra', {
        description: error.message || 'No se pudo verificar la compra',
        duration: 4000,
      })
    } finally {
      setVerifyingOrder(null)
    }
  }

  // Obtener el icono según el estado
  const getStatusIcon = (status) => {
    const iconClass = "h-5 w-5"
    switch (status) {
      case 'pendiente':
        return <ClockIcon className={iconClass} />
      case 'verificado':
        return <CheckCircleIconSolid className={`${iconClass} text-green-600`} />
      case 'procesando':
        return <ShoppingBagIcon className={iconClass} />
      case 'enviado':
        return <TruckIcon className={iconClass} />
      case 'entregado':
        return <CheckCircleIcon className={`${iconClass} text-green-600`} />
      case 'cancelado':
        return <XCircleIcon className={`${iconClass} text-red-600`} />
      default:
        return <ClockIcon className={iconClass} />
    }
  }

  // Obtener color según el estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'verificado':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'procesando':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'enviado':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'entregado':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Manejar cambios en filtros
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page when filtering
    }))
  }

  // Aplicar filtros
  const applyFilters = () => {
    fetchOrders()
  }

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      estado: '',
      usuario: '',
      fechaInicio: '',
      fechaFin: '',
      page: 1,
      limit: 10
    })
  }

  // Cambiar página
  const changePage = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }

  useEffect(() => {
    fetchOrders()
  }, [filters.page])

  useEffect(() => {
    // Fetch inicial
    fetchOrders()
  }, [])

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestión de Compras
        </h1>
        <p className="text-gray-600">
          Administra todas las compras del sistema y verifica pedidos pendientes
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <FunnelIcon className="h-5 w-5" />
            Filtros
            {showFilters ? '▼' : '▶'}
          </button>
        </div>
        
        {showFilters && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.estado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="verificado">Verificado</option>
                <option value="procesando">Procesando</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            {/* Usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                type="text"
                value={filters.usuario}
                onChange={(e) => handleFilterChange('usuario', e.target.value)}
                placeholder="Buscar por usuario..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Fecha Inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filters.fechaInicio}
                onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Fecha Fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={filters.fechaFin}
                onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Botones */}
            <div className="lg:col-span-4 flex gap-2">
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Aplicar Filtros
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Limpiar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lista de compras */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 text-lg mt-4">Cargando compras...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay compras</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron compras con los filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Header de la orden */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.estado)}`}>
                    {getStatusIcon(order.estado)}
                    {order.estado}
                  </div>
                  <span className="text-sm text-gray-500">
                    ID: {order._id}
                  </span>
                </div>
                
                {/* Botón de verificar */}
                {order.estado === 'pendiente' && (
                  <button
                    onClick={() => verifyOrder(order._id)}
                    disabled={verifyingOrder === order._id}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {verifyingOrder === order._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Verificando...
                      </>
                    ) : (
                      <>
                        <CheckCircleIconSolid className="h-4 w-4" />
                        Verificar Compra
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Información del cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Cliente</p>
                    <p className="font-medium">{order.usuario?.nombre || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-medium">{formatDate(order.fecha)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium">Bs {order.total}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <ShoppingBagIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Productos</p>
                    <p className="font-medium">{order.productos?.length || 0} items</p>
                  </div>
                </div>
              </div>

              {/* Productos */}
              {order.productos && order.productos.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Productos:</h4>
                  <div className="space-y-2">
                    {order.productos.map((producto, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {producto.imagen && (
                          <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{producto.nombre}</p>
                          <p className="text-sm text-gray-500">
                            Cantidad: {producto.cantidad} × Bs {producto.precio}
                          </p>
                        </div>
                        <p className="font-medium text-sm">
                          Bs {(producto.cantidad * producto.precio).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Información adicional */}
              {order.direccionEnvio && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Dirección de envío:</h4>
                  <p className="text-sm text-gray-600">{order.direccionEnvio}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => changePage(filters.page - 1)}
              disabled={filters.page <= 1}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <span className="px-4 py-2 text-sm text-gray-700">
              Página {filters.page} de {totalPages}
            </span>
            
            <button
              onClick={() => changePage(filters.page + 1)}
              disabled={filters.page >= totalPages}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}

export { ManageOrders }
