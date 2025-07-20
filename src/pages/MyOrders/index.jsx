import { useContext, useEffect, useState } from "react"
import { OrdersCard } from "../../components/OrdersCard"
import { ShoppingCartContext } from "../../Context"
import { Link } from "react-router-dom";
import { getUserPurchases } from "../../config/api";
import { toast } from 'sonner';
import { ShoppingBagIcon, ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";

function MyOrders() {
  const { userInfo } = useContext(ShoppingCartContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await getUserPurchases(userInfo.id);
        if (response.success) {
          setOrders(response.compras || []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Error al cargar las órdenes');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded-md w-48 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBagIcon className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Mis Órdenes</h1>
          </div>
          <p className="text-gray-600">Revisa el historial de tus compras</p>
        </div>

        {/* Stats */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingBagIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                  <p className="text-gray-600 text-sm">Total de órdenes</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${orders.reduce((sum, order) => sum + order.total, 0)}
                  </p>
                  <p className="text-gray-600 text-sm">Total gastado</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.reduce((sum, order) => sum + order.cantidadTotalProductos, 0)}
                  </p>
                  <p className="text-gray-600 text-sm">Productos comprados</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes órdenes aún
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza a comprar para ver tu historial de órdenes aquí
            </p>
            <Link 
              to="/ventas" 
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Comenzar a comprar
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <Link 
                key={order.id || index}
                to={`/my-orders/${order.id || index}`}
                className="block transition-transform hover:scale-[1.02]"
              >
                <OrdersCard
                  order={order}
                  date={new Date(order.fechaCreacion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  totalPrice={order.total}
                  totalProducts={order.cantidadTotalProductos}
                  orderNumber={order.numeroOrden}
                  status={order.estado}
                  paymentMethod={order.metodoPago}
                  products={order.productos}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { MyOrders }