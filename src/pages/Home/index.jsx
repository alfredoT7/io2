import { useContext, useEffect } from "react";
import { Card } from "../../components/Card";
import { ProductDetail } from "../../components/ProductDetail";
import { ShoppingCartContext } from "../../Context";

function Home() {
  const { 
    searchValue,
    setSearchValue,
    filteredItems,
    updateCategoryPath,
    items
  } = useContext(ShoppingCartContext);

  useEffect(() => {
    updateCategoryPath(window.location.pathname);
  }, []);

  // Debug temporal
  console.log('Home component:', { searchValue, filteredItemsCount: filteredItems?.length, totalItems: items?.length });

  // Loading state
  const isLoading = !items || items.length === 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-8">
      <div className="mb-6 text-center">
        <h1 className="font-medium text-xl sm:text-2xl lg:text-3xl text-gray-800">
          Pastillas Efervescentes Ecológicas
        </h1>
      </div>
      
      <div className="flex justify-center mb-6">
        <input 
          value={searchValue}
          type="text" 
          placeholder="Buscar pastillas efervescentes"
          className="rounded-lg border border-gray-300 w-full max-w-md px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
          onChange={event => setSearchValue(event.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <p className="text-gray-500 text-lg mt-4">Cargando productos...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
            {filteredItems?.map((item) => (
              <Card key={item.id} data={item} />
            ))}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay productos disponibles</p>
            </div>
          )}
        </>
      )}
      
      <ProductDetail />
    </div>
  );
}

export { Home };
