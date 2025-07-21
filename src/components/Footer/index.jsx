function Footer() {
  return (
    <footer className="bg-yellow-200 mt-auto">
      <div className="max-w-6xl mx-auto py-12 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Tienda</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:underline">Productos de Limpieza</a></li>
              <li><a href="#" className="text-gray-600 hover:underline">Kits Profesionales</a></li>
              <li><a href="#" className="text-gray-600 hover:underline">Productos Premium</a></li>
            </ul>
          </div>

          {/* Environmental Impact */}
          <div className="md:border-l md:border-gray-400 md:pl-8">
            <h4 className="font-semibold text-lg mb-4">Impacto Ambiental</h4>
            <p className="text-sm text-gray-600 mb-4">
              Nuestras pastillas efervescentes reducen el uso de envases plásticos en un 90%, 
              contribuyendo a un planeta más limpio y sostenible para las futuras generaciones.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-orange-500 py-4 px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm font-bold mb-2 sm:mb-0">
            Desarrollado con amor, EcoClean &copy; 2025.
          </p>
          <div className="flex space-x-4">
            <a href="https://twitter.com/" aria-label="Twitter" className="text-black hover:text-gray-600">
              <i className="fab fa-twitter text-lg"></i>
            </a>
            <a href="https://www.facebook.com/" aria-label="Facebook" className="text-black hover:text-gray-600">
              <i className="fab fa-facebook text-lg"></i>
            </a>
            <a href="https://www.instagram.com/" aria-label="Instagram" className="text-black hover:text-gray-600">
              <i className="fab fa-instagram text-lg"></i>
            </a>
            <a href="https://www.pinterest.com/" aria-label="Pinterest" className="text-black hover:text-gray-600">
              <i className="fab fa-pinterest text-lg"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
