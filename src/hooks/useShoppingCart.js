import { useContext } from "react"
import { ShoppingCartContext } from "../Context";

const useShoppingCart = () => {
  const {
    cartProducts,
    setCartProducts,
    openCheckoutSideMenu,
    closeCheckoutSideMenu,
    setCounter,
    openProductDetail,
    closeProductDetail,
    setProductDetail,
    order,
    setOrder
  } = useContext(ShoppingCartContext);

  const handleDelete = id => {
    const filteredProducts = cartProducts.filter(product => product.id !== id);
    
    setCartProducts(filteredProducts);
    
    // Recalcular contador basado en cantidades
    const newCounter = filteredProducts.reduce((total, product) => total + (product.quantity || 1), 0);
    setCounter(newCounter);
  }
  
  const handleCheckout = () => {
    const date = new Date();

    const orderToAdd = {
      date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
      products: cartProducts,
      totalProducts: cartProducts.length,
      totalPrice: getTotalPrice(cartProducts)
    }

    setOrder([...order, orderToAdd]);
    setCartProducts([]);
    setCounter(0);
  }

  const showProduct = data => {
    setProductDetail(data);
    openProductDetail();
    closeCheckoutSideMenu();
  };

  const addProductToCart = (event, data) => {
    event.stopPropagation();
    
    const newProducts = [...cartProducts];
    
    // Verificar si el producto ya existe en el carrito
    const existingProductIndex = newProducts.findIndex(product => product.id === data.id);
    
    if (existingProductIndex >= 0) {
      // Si existe, aumentar cantidad
      newProducts[existingProductIndex].quantity = (newProducts[existingProductIndex].quantity || 1) + 1;
    } else {
      // Si no existe, agregarlo con cantidad 1
      newProducts.push({
        ...data,
        quantity: 1
      });
    }

    setCounter(newProducts.reduce((total, product) => total + (product.quantity || 1), 0));
    setCartProducts(newProducts);
    closeProductDetail();
    openCheckoutSideMenu();
  };

  const getTotalPrice = (products) => {
    return products.reduce((sum, product) => sum + (product.price * (product.quantity || 1)), 0);
  };
  
  return {
    handleDelete,
    handleCheckout,
    showProduct,
    addProductToCart,
    cartProducts,
    getTotalPrice
  }  
}

export { useShoppingCart }