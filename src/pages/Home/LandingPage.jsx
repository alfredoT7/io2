import { useContext } from "react";
import { ShoppingCartContext } from "../../Context";
import { useShoppingCart } from "../../hooks/useShoppingCart";

function LandingPage() {
  const { items } = useContext(ShoppingCartContext);
  const { addProductToCart, cartProducts } = useShoppingCart();

  // Get first 3 products for featured section
  const featuredProducts = items?.slice(0, 3) || [];

  const isInCart = (productId) => {
    return cartProducts.filter(product => product.id === productId).length > 0;
  };

  return (
    <div className="landing-page pb-8">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-blue-50 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center bg-white rounded-lg shadow-xl p-8">
            {/* Content */}
            <div className="lg:w-3/5 lg:pr-8 mb-8 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                ¡Bienvenido a Master Clean: Productos de Limpieza Premium!
              </h1>
              <h2 className="text-2xl text-green-600 mb-6">
                Calidad Superior en Productos de Limpieza
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                En Master Clean, somos especialistas en productos de limpieza de alta calidad. 
                Ofrecemos soluciones profesionales para mantener tu hogar y oficina impecables, 
                con productos que garantizan los mejores resultados y la máxima eficacia.
              </p>
              <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors duration-300 transform hover:scale-105">
                Conoce Más
              </button>
            </div>
            {/* Image */}
            <div className="lg:w-2/5">
              <img 
                src="https://senti2.com.es/wp-content/uploads/2023/07/TabletasLimpiadoras_Aplicacion.webp" 
                alt="Productos Master Clean" 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2 underline decoration-orange-500 decoration-4 underline-offset-8">
            Productos Destacados
          </h2>
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {featuredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm transform hover:scale-105 transition-transform duration-300"
              >
                {/* Product Image */}
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-64 object-cover"
                />
                
                {/* Product Content */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <h3 className="font-semibold text-lg mb-2 cursor-pointer hover:underline">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.category}
                  </p>
                  <p className="text-sm mb-4">
                    <span className="font-bold text-xl">Bs {product.price}</span>
                  </p>
                  
                  {/* Rating and Add to Cart */}
                  <div className="flex justify-between items-center">
                    <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full flex items-center">
                      <i className="fas fa-star mr-1"></i>
                      {product.rating.rate} ({product.rating.count})
                    </div>
                    <button 
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                        isInCart(product.id)
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                      onClick={(e) => !isInCart(product.id) && addProductToCart(e, product)}
                      disabled={isInCart(product.id)}
                    >
                      {isInCart(product.id) ? 'En Carrito' : 'Agregar al Carrito'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="bg-gradient-to-r from-green-100 to-blue-100 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6 text-gray-800">
            Estas son nuestras Redes Sociales
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Síguenos en nuestras redes sociales para estar al día con las últimas novedades, 
            tips de limpieza y promociones especiales de Master Clean.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            {/* Facebook */}
            <a 
              href="https://www.facebook.com/share/18fZV4ty4X/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
            >
              <i className="fab fa-facebook text-xl"></i>
              <span className="font-medium">Síguenos en Facebook</span>
            </a>

            {/* TikTok */}
            <a 
              href="https://www.tiktok.com/@masterclean0?is_from_webapp=1&sender_device=pc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors duration-300 transform hover:scale-105"
            >
              <i className="fab fa-tiktok text-xl"></i>
              <span className="font-medium">Síguenos en TikTok</span>
            </a>

            {/* Email */}
            <a 
              href="mailto:masterclean.tecno@gmail.com" 
              className="flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors duration-300 transform hover:scale-105"
            >
              <i className="fas fa-envelope text-xl"></i>
              <span className="font-medium">Contáctanos</span>
            </a>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p>Email: masterclean.tecno@gmail.com</p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-yellow-100 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            ¡Mantente Conectado con Nosotros!
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            No te pierdas las últimas actualizaciones, promociones y ofertas exclusivas de Master Clean. 
            Estamos aquí para mantenerte al día con todo lo emocionante, desde nuevos productos hasta 
            eventos especiales y más. ¡Únete a nuestra lista de correo para desbloquear un mundo de beneficios!
          </p>
          <form className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
            <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 w-full sm:w-auto focus-within:border-orange-500">
              <i className="fas fa-envelope text-gray-400 mr-3"></i>
              <input 
                type="email" 
                placeholder="Dirección de correo electrónico"
                className="flex-1 outline-none bg-transparent"
                autoComplete="on"
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-900 text-white px-8 py-2 rounded-full hover:bg-blue-800 transition-colors duration-300 w-full sm:w-auto"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export { LandingPage };
