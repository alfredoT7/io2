function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-8 pb-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Nosotros</h1>
        <p className="text-xl text-gray-600">
          Comprometidos con un futuro más limpio y sostenible
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nuestra Misión</h2>
          <p className="text-gray-600 mb-6">
            En EcoClean, creemos que la limpieza del hogar no debe comprometer la salud de nuestro planeta. 
            Nuestras pastillas efervescentes revolucionarias eliminan la necesidad de envases plásticos, 
            reduciendo significativamente los residuos y la contaminación ambiental.
          </p>
          <p className="text-gray-600">
            Cada pastilla efervescente que produces equivale a eliminar una botella de plástico del medio ambiente. 
            Pequeños cambios, grandes impactos.
          </p>
        </div>
        <div>
          <img 
            src="https://senti2.com.es/wp-content/uploads/2023/07/TabletasLimpiadoras_Aplicacion.webp" 
            alt="Productos EcoClean" 
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <div className="text-4xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold mb-2">100% Ecológico</h3>
          <p className="text-gray-600">
            Fórmulas naturales que cuidan tu hogar y el medio ambiente
          </p>
        </div>
        <div className="text-center p-6 bg-blue-50 rounded-lg">
          <div className="text-4xl mb-4">♻️</div>
          <h3 className="text-xl font-semibold mb-2">Cero Plástico</h3>
          <p className="text-gray-600">
            Reducimos el uso de envases plásticos en un 90%
          </p>
        </div>
        <div className="text-center p-6 bg-yellow-50 rounded-lg">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-xl font-semibold mb-2">Máxima Eficacia</h3>
          <p className="text-gray-600">
            Limpieza profunda con la comodidad de solo agregar agua
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Nuestro Impacto</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">50,000+</div>
            <p className="text-gray-600">Botellas de plástico evitadas</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
            <p className="text-gray-600">Fragancias naturales disponibles</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
            <p className="text-gray-600">Satisfacción de clientes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AboutUs };
