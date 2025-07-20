import { useContext, useEffect, useState } from "react"
import { ShoppingCartContext } from "../../Context"
import { OrderCard } from "../../components/OrderCard";
import { Link, useParams } from "react-router-dom";
import { ChevronLeftIcon, ClockIcon, CheckCircleIcon, XCircleIcon, TruckIcon, CreditCardIcon, BanknotesIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/solid";
import { getUserPurchases } from "../../config/api";
import { toast } from 'sonner';

function MyOrder() {
  const { userInfo } = useContext(ShoppingCartContext);
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!userInfo?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await getUserPurchases(userInfo.id);
        if (response.success) {
          const orders = response.compras || [];
          const foundOrder = orders.find(order => order.id === id) || orders[parseInt(id)] || null;
          setOrder(foundOrder);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Error al cargar la orden');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [userInfo, id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completado':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'cancelado':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'tarjeta':
        return <CreditCardIcon className="h-5 w-5" />;
      case 'transferencia':
        return <BanknotesIcon className="h-5 w-5" />;
      default:
        return <CreditCardIcon className="h-5 w-5" />;
    }
  };

  const getPaymentText = (method) => {
    switch (method) {
      case 'tarjeta':
        return 'Tarjeta de crédito/débito';
      case 'transferencia':
        return 'Transferencia bancaria';
      default:
        return 'Tarjeta de crédito/débito';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded-md w-48 mb-8"></div>
            <div className="bg-white rounded-xl p-6 h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Orden no encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              La orden que buscas no existe o no tienes permisos para verla
            </p>
            <Link 
              to="/my-orders" 
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Volver a mis órdenes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/my-orders"
            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalle de Orden</h1>
            <p className="text-gray-600">{order.numeroOrden}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Estado de la Orden</h2>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.estado)}`}>
                  {getStatusIcon(order.estado)}
                  {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Fecha de creación</p>
                  <p className="font-medium">{new Date(order.fechaCreacion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div>
                  <p className="text-gray-600">Número de orden</p>
                  <p className="font-medium">{order.numeroOrden}</p>
                </div>
              </div>
              
              {order.notas && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-600 text-sm">Notas adicionales</p>
                  <p className="text-gray-900">{order.notas}</p>
                </div>
              )}
            </div>

            {/* Products */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Productos ({order.cantidadTotalProductos})
              </h2>
              
              <div className="space-y-4">
                {order.productos?.map((product, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={product.imagen} 
                      alt={product.nombre}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.nombre}</h3>
                      <p className="text-sm text-gray-600">
                        Cantidad: {product.cantidad} × Bs {product.precio}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${product.subtotal}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-indigo-600">${order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment & Shipping */}
          <div className="space-y-6">
            {/* Payment Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Pago</h3>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {getPaymentIcon(order.metodoPago)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{getPaymentText(order.metodoPago)}</p>
                  <p className="text-sm text-gray-600">Total pagado: ${order.total}</p>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            {order.envio && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TruckIcon className="h-5 w-5 text-gray-600" />
                  Información de Envío
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{order.envio.direccion}</p>
                      <p className="text-sm text-gray-600">
                        {order.envio.ciudad}
                        {order.envio.codigoPostal && `, CP: ${order.envio.codigoPostal}`}
                      </p>
                    </div>
                  </div>
                  
                  {order.envio.telefono && (
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Teléfono de contacto</p>
                        <p className="font-medium text-gray-900">{order.envio.telefono}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
              
              <div className="space-y-3">
                <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Descargar Factura
                </button>
                
                {order.estado === 'pendiente' && (
                  <button className="w-full py-2 px-4 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                    Cancelar Orden
                  </button>
                )}
                
                <Link 
                  to="/ventas"
                  className="block w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  Comprar de Nuevo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { MyOrder }