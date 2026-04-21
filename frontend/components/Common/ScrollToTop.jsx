import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // useLocation gives us the current URL path
  const { pathname } = useLocation();

  useEffect(() => {
    // Every time the pathname changes, instantly scroll to the top-left
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Use "smooth" if you prefer an animated scroll
    });
  }, [pathname]);

  // This component doesn't render anything visually
  return null;
};

export default ScrollToTop;
