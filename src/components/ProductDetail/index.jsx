import { useContext } from 'react';
import { ShoppingCartContext } from '../../Context';
import { Aside } from '../Aside';

const ProductDetail = () => {
  const {
    isProductDetailOpen,
    closeProductDetail,
    productDetail
  } = useContext(ShoppingCartContext);

  return (
    <Aside isOpen={isProductDetailOpen} title="Detalles del Producto" onClose={() => closeProductDetail()}>
      {/* Product Image */}
      <div className="mb-6">
        <img
          className="w-full h-64 sm:h-80 object-cover rounded-xl shadow-lg"
          src={productDetail.image}
          alt={productDetail.title}
        />
      </div>
      
      {/* Product Info */}
      <div className='space-y-6'>
        {/* Price and Rating */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="bg-green-50 px-4 py-3 rounded-lg border border-green-200">
            <span className="text-2xl sm:text-3xl font-bold text-green-600">
              Bs {productDetail.price}
            </span>
          </div>
          {productDetail.rating && (
            <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
              <div className="flex text-yellow-500 mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-yellow-700">{productDetail.rating.rate}</span>
              <span className="text-xs text-gray-500 ml-1">({productDetail.rating.count})</span>
            </div>
          )}
        </div>
        
        {/* Product Title */}
        <div>
          <h3 className="font-bold text-xl sm:text-2xl text-gray-800 leading-tight mb-2">
            {productDetail.title}
          </h3>
          
          {/* Category Badge */}
          {productDetail.category && (
            <div className="inline-block">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-200">
                {productDetail.category}
              </span>
            </div>
          )}
        </div>
        
        {/* Description */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Descripción:</h4>
          <p className='text-gray-600 text-sm sm:text-base leading-relaxed'>
            {productDetail.description}
          </p>
        </div>
        
        {/* Additional Info */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
            <span className="mr-2">🌱</span>
            Beneficios Ecológicos
          </h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Reduce el uso de envases plásticos</li>
            <li>• Fórmula concentrada y eficiente</li>
            <li>• Ingredientes biodegradables</li>
          </ul>
        </div>
      </div>
    </Aside>
  );
}

export { ProductDetail }