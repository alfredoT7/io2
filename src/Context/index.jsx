import { createContext, useEffect, useState, useCallback } from 'react'
import { staticProducts } from '../api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../hooks/useAuth';

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
    // Use static products instead of API call
    setItems(staticProducts);
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
      // Auth
      user: auth.user,
      token: auth.token,
      isAuthenticated: auth.isAuthenticated,
      authLoading: auth.loading,
      login: auth.login,
      logout: auth.logout,
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
