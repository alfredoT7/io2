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
import "./App.css";
import { CheckoutSideMenu } from "../../components/CheckoutSideMenu";

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <LandingPage /> },
    { path: "/ventas", element: <Home /> },
    { path: "/nosotros", element: <AboutUs /> },
    { path: "/:category", element: <Home /> },
    { path: "/my-account", element: <MyAccount /> },
    { path: "/my-orders/:id", element: <MyOrder /> },
    { path: "/my-orders", element: <MyOrders /> },
    { path: "/signin", element: <SignIn /> },
    { path: "/register", element: <Register /> },
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
      </BrowserRouter>
    </ShoppingCartProvider>
  );
};

export default App;
