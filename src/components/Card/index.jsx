import { CheckIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useShoppingCart } from "../../hooks/useShoppingCart";

const Card = ({ data }) => {
  const {
    cartProducts,
    addProductToCart,
    showProduct
  } = useShoppingCart();

  const renderIcon = () => {
    const isInCart = cartProducts.filter(product => product.id === data.id).length > 0;

    const commonClasses = "absolute top-2 right-2 flex justify-center items-center w-8 h-8 sm:w-6 sm:h-6 rounded-full shadow-lg";

    if (isInCart) {
      return (
        <div
          className={`${commonClasses} bg-green-600`}
        >
          <CheckIcon className="h-5 w-5 sm:h-4 sm:w-4 text-white" />
        </div>
      )
    } else {
      return (
        <div
        className={`${commonClasses} bg-white hover:bg-gray-100 border border-gray-200`}
        onClick={(e) => addProductToCart(e, data)}
      >
        <PlusIcon className="h-5 w-5 sm:h-4 sm:w-4 text-black"/>
      </div>
      )
    }
  }

  return (
    <div 
      className="bg-white cursor-pointer w-full max-w-sm mx-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
      onClick={() => showProduct(data)}
    >
      <figure className="relative w-full h-48 sm:h-52 lg:h-56">
        <span className="absolute bottom-2 left-2 bg-green-100 text-green-800 rounded-full text-xs px-3 py-1 font-medium shadow-sm">
          {data.category}
        </span>
        <img
          className="w-full h-full object-cover"
          src={data.image}
          alt={data.title}
        />
        {renderIcon()}
      </figure>
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <span className="text-sm sm:text-xs lg:text-sm font-light text-gray-700 leading-tight flex-1 truncate pr-2">
            {data.title}
          </span>
          <span className="text-lg font-bold text-green-600 shrink-0">
            Bs {data.price}
          </span>
        </div>
        
        {/* Rating section for mobile */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              ))}
            </div>
            <span className="ml-2 text-xs text-gray-600">{data.rating.rate}</span>
          </div>
          <span className="text-xs text-gray-500">
            {data.rating.count} reseñas
          </span>
        </div>
      </div>
    </div>
  );
}

export { Card }