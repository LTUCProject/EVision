import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Component imports
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import EVisionPage from "./components/Home/EVisionPage";
import LoginSignup from "./components/Account/LoginSignup";
import Logout from "./components/Account/Logout";
import ResponsiveMenu from "./components/Navbar/ResponsiveMenu";
import Vehicles from "./components/Client/Vehicle/Vehicle";
import ChargingStationAndLocationForm from "./components/Owner/ChargingStaion/ChargingStationAndLocationForm";
import Location from "./components/Client/Locations/Location";
import ServiceInfo from "./components/Servicer/ServiceInfo/ServiceInfo";
import PostsAndComments from "./components/PostsAndComments/PostsAndComments";

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");

    window.location.href = '/';
  };

  useEffect(() => {
    const element = document.documentElement;
    element.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
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
        <ResponsiveMenu showMenu={showMenu} />
        <Routes>
          <Route path="/" element={<EVisionPage />} />
          <Route path="/login" element={<LoginSignup setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/logout" element={<Logout onLogout={handleLogout} />} />

          {isAuthenticated && (
            <>
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/postsandcomments" element={<PostsAndComments />} />
              <Route path="/charging-station" element={<ChargingStationAndLocationForm />} />
              <Route path="/location" element={<Location />} />
              <Route path="/serviceinfo" element={<ServiceInfo />} />
            </>
          )}
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
