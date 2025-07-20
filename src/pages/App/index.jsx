import { useRoutes, BrowserRouter } from "react-router-dom";
import { ShoppingCartProvider } from "../../Context";
import { Home } from "../Home";
import { LandingPage } from "../Home/LandingPage";
import { AboutUs } from "../AboutUs";
import { MyAccount } from "../MyAccount";
import { MyOrder } from "../MyOrder";
import { MyOrders } from "../MyOrders";
import { NotFound } from "../NotFound";
import { SignIn } from "../SignIn";
import { Register } from "../Register";
import { Navbar } from "../../components/Navbar";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { Toaster } from 'sonner';
import "./App.css";
import { CheckoutSideMenu } from "../../components/CheckoutSideMenu";

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <LandingPage /> },
    { path: "/ventas", element: <Home /> },
    { path: "/nosotros", element: <AboutUs /> },
    { path: "/:category", element: <Home /> },
    { 
      path: "/my-account", 
      element: (
        <ProtectedRoute>
          <MyAccount />
        </ProtectedRoute>
      ) 
    },
    { 
      path: "/my-orders/:id", 
      element: (
        <ProtectedRoute>
          <MyOrder />
        </ProtectedRoute>
      ) 
    },
    { 
      path: "/my-orders", 
      element: (
        <ProtectedRoute>
          <MyOrders />
        </ProtectedRoute>
      ) 
    },
    { 
      path: "/signin", 
      element: (
        <ProtectedRoute requireAuth={false}>
          <SignIn />
        </ProtectedRoute>
      ) 
    },
    { 
      path: "/register", 
      element: (
        <ProtectedRoute requireAuth={false}>
          <Register />
        </ProtectedRoute>
      ) 
    },
    { path: "/*", element: <NotFound /> },
  ]);

  return routes;
};

const App = () => {
  return (
    <ShoppingCartProvider>
      <BrowserRouter>
        <AppRoutes />
        <Navbar />
        <CheckoutSideMenu />
        <Toaster 
          position="top-right" 
          richColors 
          closeButton 
          expand={true}
        />
      </BrowserRouter>
    </ShoppingCartProvider>
  );
};

export default App;
