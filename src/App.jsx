import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Component imports
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import EVisionPage from "./components/Home/EVisionPage";
import LoginSignup from "./components/Account/LoginSignup";
import Logout from "./components/Account/Logout";
import ResponsiveMenu from "./components/Navbar/ResponsiveMenu";
import Vehicles from "./components/Vehicle/Vehicle"; // Import your Vehicles component

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token")); // Check if user is authenticated
  const [showMenu, setShowMenu] = useState(false); // Track menu visibility

  const handleLogout = () => {
    setIsAuthenticated(false); // Update authentication state
    localStorage.removeItem("token"); // Clear token on logout
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
    window.location.reload();
  };

  useEffect(() => {
    const element = document.documentElement;
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="bg-white dark:bg-black dark:text-white text-black overflow-x-hidden">
      <Router>
        <Navbar
          theme={theme}
          setTheme={setTheme}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          setShowMenu={setShowMenu}
        />
        <ResponsiveMenu showMenu={showMenu} /> {/* Add ResponsiveMenu component */}
        <Routes>
          <Route path="/" element={<EVisionPage />} />
          <Route path="/login" element={<LoginSignup setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/logout" element={<Logout onLogout={handleLogout} />} /> 
          <Route path="/vehicles" element={<Vehicles />} /> {/* Ensure Vehicles component is defined */}
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
