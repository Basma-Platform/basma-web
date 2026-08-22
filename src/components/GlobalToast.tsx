import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext";

const GlobalToast = () => {
  const { isDark } = useTheme();

  return (
    <ToastContainer
      containerId="global"
      rtl
      position="top-center"
      autoClose={4000}
      theme={isDark ? "dark" : "light"}
      newestOnTop
    />
  );
};

export default GlobalToast;
