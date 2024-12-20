import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
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
import ClientCommunity from "./components/Community/ClientCommunity";
import ServicerCommunity from "./components/Community/ServicerCommunity";
import OwnerCommunity from "./components/Community/OwnerCommunity";
// import SendNotifications from "./components/Servicer/SendNotifications/SendNotifications";
// import SendOwnerNotifications from "./components/Owner/SendNotifications/SendOwnerNotifications";
import Booking from "./components/Client/Booking/Booking";
// import Session from "./components/Owner/Sessions/Session";
// import ClientFavorite from "./components/Client/ClientFavorite/ClientFavorite";
import ServiceReq from "./components/Client/ServiceReq/ServiceReq"
import ElectricCars from "./components/ElectricCars/ElectricCars"
import ScrollUpButton from "./components/ScrollUpButton/ScrollUpButton";
import EVFAQ from "./components/ElectricCarsFAQs/EVFAQ";


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
          <Route path="/electriccars" element={<ElectricCars />} />
          <Route path="/evfaq" element={<EVFAQ />} />
          <Route path="/login" element={<LoginSignup setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/logout" element={<Logout onLogout={handleLogout} />} />

          {isAuthenticated && (
            <>
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/ClientCommunity" element={<ClientCommunity />} />
              <Route path="/ServicerCommunity" element={<ServicerCommunity />} />
              <Route path="/OwnerCommunity" element={<OwnerCommunity />} />
              <Route path="/charging-station" element={<ChargingStationAndLocationForm />} />
              <Route path="/location" element={<Location />} />
              <Route path="/serviceinfo" element={<ServiceInfo />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/servicereq" element={<ServiceReq />} />


              {/* <Route path="/SendNotifications" element={<SendNotifications />} />
              <Route path="/SendOwnerNotifications" element={<SendOwnerNotifications />} />
              <Route path="/sessions" element={<Session />} />
              <Route path="/ClientFavorite" element={<ClientFavorite/>} /> */}
            </>
          )}
        </Routes>
        <>
        {/* ScrollUpButton placed alongside Routes  */}
        <ScrollUpButton />
      </>
        <Footer />
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
