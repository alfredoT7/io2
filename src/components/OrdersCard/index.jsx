import { ChevronRightIcon, ShoppingBagIcon, CreditCardIcon, BanknotesIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const OrdersCard = (props) => {
  const { 
    order,
    date,
    totalPrice, 
    totalProducts,
    orderNumber,
    status,
    paymentMethod,
    products
  } = props;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completado':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'cancelado':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'tarjeta':
        return <CreditCardIcon className="h-4 w-4" />;
      case 'transferencia':
        return <BanknotesIcon className="h-4 w-4" />;
      default:
        return <CreditCardIcon className="h-4 w-4" />;
    }
  };

  const getPaymentText = (method) => {
    switch (method) {
      case 'tarjeta':
        return 'Tarjeta';
      case 'transferencia':
        return 'Transferencia';
      default:
        return 'Tarjeta';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:border-indigo-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <ShoppingBagIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{orderNumber}</h3>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Products Preview */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="text-sm font-medium text-gray-700">Productos ({totalProducts})</h4>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {products?.slice(0, 3).map((product, index) => (
            <div key={index} className="flex-shrink-0 bg-gray-50 rounded-lg p-3 w-48">
              <div className="flex items-center gap-3">
                <img 
                  src={product.imagen} 
                  alt={product.nombre}
                  className="h-12 w-12 object-cover rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.nombre}
                  </p>
                  <p className="text-xs text-gray-500">
                    Cantidad: {product.cantidad} × ${product.precio}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {products?.length > 3 && (
            <div className="flex-shrink-0 bg-gray-50 rounded-lg p-3 w-16 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-500">
                +{products.length - 3}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {getPaymentIcon(paymentMethod)}
          <span>{getPaymentText(paymentMethod)}</span>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-xl font-bold text-gray-900">${totalPrice}</p>
        </div>
      </div>

      {/* Shipping Info Preview */}
      {order?.envio && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Entrega:</span> {order.envio.ciudad}, {order.envio.direccion}
          </p>
        </div>
      )}
    </div>
  )
}

export { OrdersCard }