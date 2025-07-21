import { createContext, useEffect, useState, useCallback } from 'react'
import { getProducts } from '../config/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

export const ShoppingCartContext = createContext()

export const ShoppingCartProvider = ({ children }) => {
  // Auth state
  const auth = useAuth()
  
  const [counter, setCounter] = useState(0);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [isCheckoutSideMenu, setIsCheckoutSideMenu] = useState(false);
  const [productDetail, setProductDetail] = useState({
    title: "",
    price: "",
    description: "",
    image: ""
  });
  const [cartProducts, setCartProducts] = useState([]);
  const [order, setOrder] = useState([]);

  const openProductDetail = () => setIsProductDetailOpen(true);
  const closeProductDetail = () => setIsProductDetailOpen(false);
  const openCheckoutSideMenu = () => setIsCheckoutSideMenu(true);
  const closeCheckoutSideMenu = () => setIsCheckoutSideMenu(false);

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        console.log('🚀 Starting to fetch products...');
        const products = await getProducts();
        console.log('✅ Products fetched successfully:', products);
        setItems(products);
      } catch (error) {
        console.error('❌ Error fetching products:', error);
        toast.error('Error al cargar los productos');
        setItems([]);
      }
    };

    fetchProducts();
  }, []);

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  // Effect para filtrar items cuando cambian las dependencias
  useEffect(() => {
    if (!items || items.length === 0) {
      setFilteredItems([]);
      return;
    }
    
    const filtered = items.filter(item => {
      // Filtro por título/búsqueda
      const matchesSearch = item.title.toLowerCase().includes(searchValue.toLowerCase());
      
      // Filtro por categoría
      const matchesCategory = searchCategory === "" || 
                             searchCategory === "ventas" || 
                             item.category.toLowerCase().includes(searchCategory.toLowerCase());
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredItems(filtered);
  }, [items, searchValue, searchCategory]);

  const filteredItemsByTitle = useCallback(() => {
    return filteredItems;
  }, [filteredItems]);

  const updateCategoryPath = categoryPath => {
    // Si estamos en la página de ventas, no filtrar por categoría
    if (categoryPath === "/ventas") {
      setSearchCategory("");
    } else {
      const category = categoryPath.substring(1);
      setSearchCategory(category);
    }
  }

  const {
    account,
    signIn,
    signOut,
    isSignIn
  } = useLocalStorage();

  // Función de logout personalizada que limpia todo
  const handleLogout = () => {
    // Limpiar datos de autenticación (useAuth)
    auth.logout()
    
    // Limpiar datos legacy (useLocalStorage)
    signOut()
    
    // Limpiar TODOS los datos del localStorage relacionados con la sesión
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    localStorage.removeItem('ACCOUNT')
    
    // Limpiar datos del carrito
    setCartProducts([])
    setOrder([])
    
    // Limpiar otros estados
    setCounter(0)
    setProductDetail({
      title: "",
      price: "",
      description: "",
      image: ""
    })
    
    // Cerrar menús abiertos
    closeProductDetail()
    closeCheckoutSideMenu()
    
    // Limpiar filtros
    setSearchValue("")
    setSearchCategory("")
    
    toast.success('Sesión cerrada correctamente', {
      description: 'Todos los datos han sido limpiados',
      duration: 3000,
    })
  }

  // Function to refresh products
  const refreshProducts = async () => {
    try {
      const products = await getProducts();
      setItems(products);
      return products;
    } catch (error) {
      console.error('Error refreshing products:', error);
      toast.error('Error al actualizar los productos');
      return [];
    }
  };

  return (
    <ShoppingCartContext.Provider value={{
      counter,
      setCounter,
      isProductDetailOpen,
      openProductDetail,
      closeProductDetail,
      productDetail,
      setProductDetail,
      cartProducts,
      setCartProducts,
      isCheckoutSideMenu,
      openCheckoutSideMenu,
      closeCheckoutSideMenu,
      order,
      setOrder,
      items,
      setItems,
      searchValue,
      setSearchValue,
      filteredItems,
      setFilteredItems,
      filteredItemsByTitle,
      searchCategory,
      setSearchCategory,
      updateCategoryPath,
      refreshProducts,
      // Auth
      user: auth.user,
      userInfo: auth.user, // Alias para compatibilidad
      token: auth.token,
      isAuthenticated: auth.isAuthenticated,
      authLoading: auth.loading,
      login: auth.login,
      logout: handleLogout, // Usar la función personalizada
      register: auth.register,
      // Legacy (mantener compatibilidad)
      account,
      signIn,
      signOut,
      isSignIn
    }}>
      {children}
    </ShoppingCartContext.Provider>
  )
}
