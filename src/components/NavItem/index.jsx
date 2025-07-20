import { useContext } from "react";
import { NavLink } from "react-router-dom"
import { ShoppingCartContext } from "../../Context";

const NavItem = (props) => {
  const { 
    to, 
    link, 
    index, 
    isActive, 
    onSelection 
  } = props;

  const {
    isSignIn
  } = useContext(ShoppingCartContext);

  const getRouteForIndex = (index) => {
    switch(index) {
      case 0: return "/"; // EcoClean
      case 1: return "/"; // Inicio  
      case 2: return "/ventas"; // Ventas
      case 3: return "/ventas"; // Limpieza Ecológica (sales with filter)
      case 4: return "/nosotros"; // Nosotros
      default: return to;
    }
  };

  return (
    <li
      className={`${
        index === 0 
          ? "font-semibold text-sm sm:text-lg text-green-600" 
          : "text-xs sm:text-sm"
      } whitespace-nowrap px-2 py-1 rounded-md hover:bg-gray-100 transition-colors`}
      onClick={() => onSelection()}
    >
      <NavLink
        to={isSignIn ? getRouteForIndex(index) : "/sign-in"}
        className={
          isActive && index !== 0 ? "underline underline-offset-4 text-green-600" : undefined
        }
      >
        {link}
      </NavLink>
    </li>
  );
}

export { NavItem }
