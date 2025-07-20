import { ShoppingBagIcon, UserIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { ShoppingCartContext } from "../../Context";
import { NavItem } from "../NavItem";
import { useContext, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState(1);
  const {
    counter,
    updateCategoryPath,
    setSearchValue,
    // New auth system
    isAuthenticated,
    user,
    logout,
    // Legacy (mantener compatibilidad)
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

  return (
    <nav className="flex justify-between items-center fixed z-10 top-0 w-full py-3 sm:py-5 px-4 sm:px-8 text-xs sm:text-sm font-light bg-white shadow-md">
      <ul className="flex items-center gap-1 sm:gap-3 overflow-x-auto scrollbar-hide">
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
      <ul className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
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
        
        <li className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
          <ShoppingBagIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600"/>
          <span className="text-xs sm:text-sm font-medium text-green-600">{counter}</span>
        </li>
      </ul>
    </nav>
  );
}

export { Navbar }