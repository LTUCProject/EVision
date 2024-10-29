import React, { Component, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AOS from "aos";
import "aos/dist/aos.css";

// Component import
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import EVisionPage from "./components/Home/EVisionPage";
 import LoginSignup from "./components/Account/LoginSignup";

const App = () => {
  // dark mode start
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const element = document.documentElement;

  useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);
  // dark mode end

  React.useEffect(() => {
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
            <Navbar theme={theme} setTheme={setTheme} />
            <Routes>
            <Route path="/" element={<EVisionPage/>} />
            <Route path="/login" element={<LoginSignup />} />
            </Routes>
            <Footer />
            </Router>
 
    </div>
  );
};

export default App;
