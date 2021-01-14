import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ children }) => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ behavior: "smooth", top: 0 });
  }, [pathname, search]);

  return children;
};
export default ScrollToTop;
