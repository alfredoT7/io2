import { Footer } from "../Footer";

const Layout = ({ children }) => {

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex flex-col items-center mt-16 sm:mt-20 flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export { Layout }