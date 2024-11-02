import React, { useState } from "react";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import ResponsiveMenu from "./ResponsiveMenu";

export const Navlinks = [
  { id: 1, name: "HOME", link: "/#" },
  { id: 2, name: "VEHICLES", link: "/vehicles" },
  { id: 3, name: "CHARGING STATION", link: "/charging-station" }, // Add link for Charging Station
];

const Navbar = ({ theme, setTheme, isAuthenticated, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="relative z-10 shadow-md w-full dark:bg-black dark:text-white duration-300">
      <div className="container py-2">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-3xl font-bold font-serif">EVISION</span>
          </div>
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-8">
              {!isAuthenticated ? (
                <>
                  <li className="py-4">
                    <a href="/#" className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500">HOME</a>
                  </li>
                  <li className="py-4">
                    <a href="/login" className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500">LOGIN</a>
                  </li>
                </>
              ) : (
                <>
                  {Navlinks.map(({ id, name, link }) => (
                    <li key={id} className="py-4">
                      <a href={link} className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500">{name}</a>
                    </li>
                  ))}
                  <li className="py-4">
                    <button onClick={onLogout} className="text-lg font-medium hover:text-primary py-2">LOGOUT</button>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <div className="flex items-center gap-4">
            {theme === 'dark' ? (
              <BiSolidSun onClick={() => setTheme('light')} className="text-2xl cursor-pointer" />
            ) : (
              <BiSolidMoon onClick={() => setTheme('dark')} className="text-2xl cursor-pointer" />
            )}
            {showMenu ? (
              <HiMenuAlt1 onClick={toggleMenu} className="cursor-pointer transition-all" size={30} />
            ) : (
              <HiMenuAlt3 onClick={toggleMenu} className="cursor-pointer transition-all" size={30} />
            )}
          </div>
        </div>
      </div>
      <ResponsiveMenu showMenu={showMenu} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
