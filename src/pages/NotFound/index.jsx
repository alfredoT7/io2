function NotFound() {
  return (
    <div className="pb-8">
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
        <a href="/" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
          Volver al inicio
        </a>
      </div>
    </div>
  )
}

export { NotFound } 