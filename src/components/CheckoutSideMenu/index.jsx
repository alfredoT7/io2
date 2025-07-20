import { useContext } from "react"
import { ShoppingCartContext } from "../../Context"
import { Aside } from "../Aside";
import { OrderCard } from "../OrderCard";
import { useShoppingCart } from "../../hooks/useShoppingCart";
import { Link } from "react-router-dom";

const CheckoutSideMenu = () => {
  const {
    isCheckoutSideMenu,
    closeCheckoutSideMenu,
    cartProducts
  } = useContext(ShoppingCartContext);

  const { 
    getTotalPrice,
    handleCheckout,
    handleDelete
  } = useShoppingCart();

  return (
    <Aside
      isOpen={isCheckoutSideMenu}
      title="Mi Carrito"
      onClose={() => closeCheckoutSideMenu()}
    >
      {/* Cart Items */}
      {cartProducts.length > 0 ? (
        <>
          <div className="flex flex-col gap-4 mb-6">
            {cartProducts.map((product) => (
              <div key={product.id} className="bg-gray-50 p-3 rounded-lg">
                <OrderCard
                  id={product.id}
                  title={product.title}
                  image={product.image}
                  price={product.price}
                  quantity={product.quantity}
                  onDelete={id => handleDelete(id)}
                />
              </div>
            ))}
          </div>
          
          {/* Total and Checkout */}
          <div className="border-t border-gray-200 pt-6">
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total:</span>
                <span className="font-bold text-2xl text-green-600">
                  ${getTotalPrice(cartProducts).toFixed(2)}
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {cartProducts.length} producto{cartProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <Link to="/checkout">
              <button
                className="bg-green-600 hover:bg-green-700 py-4 text-white w-full rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg"
                onClick={() => closeCheckoutSideMenu()}
                type="button"
              >
                Proceder al Pago
              </button>
            </Link>
          </div>
        </>
      ) : (
        /* Empty Cart */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Tu carrito está vacío
          </h3>
          <p className="text-gray-500 mb-6">
            Agrega algunos productos para comenzar
          </p>
          <button
            onClick={() => closeCheckoutSideMenu()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Seguir Comprando
          </button>
        </div>
      )}
    </Aside>
  );
}

export { CheckoutSideMenu }