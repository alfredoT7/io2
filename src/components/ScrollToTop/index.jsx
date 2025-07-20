import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll al top cada vez que cambie la ruta
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export { ScrollToTop };
