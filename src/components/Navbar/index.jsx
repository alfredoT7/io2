import { ShoppingBagIcon, UserIcon, ArrowRightOnRectangleIcon, PlusIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { ShoppingCartContext } from "../../Context";
import { NavItem } from "../NavItem";
import { useContext, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    counter,
    updateCategoryPath,
    setSearchValue,
    openCheckoutSideMenu,
    isAuthenticated,
    user,
    logout,
    account,
    signOut,
    isSignIn,
  } = useContext(ShoppingCartContext);

  const firstMenu = [
    { to: "/", link: "EcoClean" },
    { to: "/", link: "Inicio" },
    { to: "/ventas", link: "Ventas" },
    { to: "/limpieza", link: "Limpieza Ecológica" },
    { to: "/nosotros", link: "Nosotros" }
  ];

  const secondMenu = [
    { to: "/my-orders", link: "My orders" },
    { to: "/my-account", link: "My Account" }
  ];

  const handleLinkClick = index => {
    setActiveLink(index);
    setIsMobileMenuOpen(false); // Cerrar menú móvil al hacer click
  }

  const handleLinkCategory = index => {
    handleLinkClick(index);
    if (index === 0) {
      updateCategoryPath("/");
    } else if (index === 1) {
      updateCategoryPath("/");
    } else if (index === 2) {
      updateCategoryPath("/ventas");
    } else if (index === 3) {
      updateCategoryPath("/limpieza");
    }
    
    setSearchValue("");
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  return (
    <nav className="flex justify-between items-center fixed z-10 top-0 w-full py-3 sm:py-5 px-4 sm:px-8 text-xs sm:text-sm font-light bg-white shadow-md">
      {/* Menu Desktop - Solo visible en pantallas medianas y grandes */}
      <ul className="hidden md:flex items-center gap-1 sm:gap-3 overflow-x-auto scrollbar-hide">
        {firstMenu.map((menuItem, index) => (
          <NavItem
            key={index}
            to={menuItem.to}
            link={menuItem.link}
            index={index}
            isActive={activeLink === index}
            onSelection={() => handleLinkCategory(index)}
          />
        ))}
      </ul>

      {/* Logo Mobile - Solo visible en pantallas pequeñas */}
      <div className="md:hidden">
        <NavItem
          to="/"
          link="EcoClean"
          index={0}
          isActive={activeLink === 0}
          onSelection={() => handleLinkCategory(0)}
        />
      </div>

      {/* Hamburger Button - Solo visible en móvil */}
      <button
        className="md:hidden p-2 text-gray-600 hover:text-gray-800"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Menu Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 md:hidden z-50">
          <div className="p-4 space-y-2">
            {firstMenu.slice(1).map((menuItem, index) => {
              const actualIndex = index + 1;
              return (
                <Link
                  key={actualIndex}
                  to={menuItem.to}
                  onClick={() => handleLinkCategory(actualIndex)}
                  className={`block px-3 py-2 rounded ${
                    activeLink === actualIndex
                      ? 'bg-green-100 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {menuItem.link}
                </Link>
              );
            })}
            
            {isSignIn && (
              <>
                <hr className="my-2" />
                {secondMenu.map((menuItem, index) => {
                  let newIndex = index + firstMenu.length;
                  return (
                    <Link
                      key={newIndex}
                      to={menuItem.to}
                      onClick={() => handleLinkClick(newIndex)}
                      className={`block px-3 py-2 rounded ${
                        activeLink === newIndex
                          ? 'bg-green-100 text-green-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {menuItem.link}
                    </Link>
                  );
                })}
              </>
            )}

            {/* Auth Mobile */}
            {!isAuthenticated ? (
              <div className="pt-2 space-y-2">
                <Link 
                  to="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Registrarse
                </Link>
              </div>
            ) : (
              <div className="pt-2 space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded">
                  <UserIcon className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700 text-sm">
                    {user?.nombreCompleto?.split(' ')[0] || 'Usuario'}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    {user?.tipoUsuario || 'usuario'}
                  </span>
                </div>
                
                {user?.tipoUsuario === 'vendedor' && (
                  <Link 
                    to="/crear-producto"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Crear Producto
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Menu Desktop derecho - Solo visible en pantallas medianas y grandes */}
      <ul className="hidden md:flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <li className="text-black/60 hidden sm:block">{account?.email}</li>
        {isSignIn && secondMenu.map((menuItem, index) => {
          let newIndex = index + firstMenu.length;

          return (
            <NavItem 
              key={newIndex}
              to={menuItem.to}
              link={menuItem.link}
              index={newIndex}
              isActive={activeLink === (newIndex)}
              onSelection={() => handleLinkClick(newIndex)}
            />
          )
        })}
        
        {/* Authentication Links */}
        {!isAuthenticated ? (
          <>
            <li className="cursor-pointer text-xs sm:text-sm">
              <Link 
                to="/signin"
                className="hover:text-green-600 transition-colors"
              >
                Iniciar Sesión
              </Link>
            </li>
            <li className="cursor-pointer text-xs sm:text-sm">
              <Link 
                to="/register"
                className="bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition-colors"
              >
                Registrarse
              </Link>
            </li>
          </>
        ) : (
          <>
            {/* User Info */}
            <li className="flex items-center gap-2 text-xs sm:text-sm">
              <UserIcon className="w-4 h-4 text-green-600" />
              <span className="hidden sm:inline text-gray-700">
                {user?.nombreCompleto?.split(' ')[0] || 'Usuario'}
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                {user?.tipoUsuario || 'usuario'}
              </span>
            </li>

            {/* Crear Producto (Solo Vendedores) */}
            {user?.tipoUsuario === 'vendedor' && (
              <li className="cursor-pointer text-xs sm:text-sm">
                <Link 
                  to="/crear-producto"
                  className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Crear Producto</span>
                </Link>
              </li>
            )}
            
            {/* Logout Button */}
            <li className="cursor-pointer text-xs sm:text-sm">
              <button
                onClick={logout}
                className="flex items-center gap-1 hover:text-red-600 transition-colors"
                title="Cerrar sesión"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </li>
          </>
        )}
        
        <li 
          className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full cursor-pointer hover:bg-green-200 transition-colors"
          onClick={openCheckoutSideMenu}
          title="Abrir carrito de compras"
        >
          <ShoppingBagIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600"/>
          <span className="text-xs sm:text-sm font-medium text-green-600">{counter}</span>
        </li>
      </ul>

      {/* Carrito Mobile - Solo visible en móvil */}
      <div className="md:hidden">
        <button
          onClick={openCheckoutSideMenu}
          className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full hover:bg-green-200 transition-colors"
          title="Abrir carrito de compras"
        >
          <ShoppingBagIcon className="w-4 h-4 text-green-600"/>
          <span className="text-xs font-medium text-green-600">{counter}</span>
        </button>
      </div>
    </nav>
  );
}

export { Navbar }