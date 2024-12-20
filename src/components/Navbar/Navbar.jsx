import React, { useState, useEffect } from "react";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import ResponsiveMenu from "./ResponsiveMenu";
import NotificationDropdown from "../Client/Notifications/Notification";
import { Link } from "react-router-dom";

export const Navlinks = [
  { id: 1, name: "HOME", link: "/#" },
  { id: 2, name: "VEHICLES", link: "/vehicles" },
  { id: 3, name: "CHARGING STATION", link: "/charging-station" },
  { id: 4, name: "STATIONS", link: "/location" },
  { id: 5, name: "My Services", link: "/serviceinfo" },
  { id: 6, name: "COMMUNITY", link: "/ClientCommunity" },
  // { id: 7, name: "Send Notifications", link: "/SendNotifications" } ,// Adjusted link name for clarity
  // { id: 8, name: "SendOwnerNotifications", link: "/SendOwnerNotifications" }, // New link for Owner
  { id: 9, name: "ServicerCommunity", link: "/ServicerCommunity" },
  { id: 10, name: "OwnerCommunity", link: "/OwnerCommunity" },
  { id: 11, name: "BOOKING", link: "/booking" },
  // { id: 12, name: "SESSIONS", link: "/sessions" },
  // { id: 13, name: "clientfavorite", link: "/ClientFavorite" }
  { id: 14, name: "SERVICES", link: "/servicereq" },
  { id: 14, name: "ElectricCars", link: "/electriccars" },
  { id: 15, name: "EVFAQ", link: "/ecfaq" },
];

const Navbar = ({ theme, setTheme, isAuthenticated, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const clientId = 1; // Replace with actual clientId logic, possibly from context or props

  useEffect(() => {
    // Get user role from local storage
    const role = localStorage.getItem("roles"); // Adjusted to match your localStorage key
    setUserRole(role);
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  const EvisionComponent = () => {
    return (
      <Link to="/" className="flex items-center space-x-2">
        {/* Logo Image */}
        <img
          src="/public/Logo2.png" // Path to the logo image
          alt="Evision Logo"
          width="80" // Adjust size as needed
          height="80" // Adjust size as needed
        />
        {/* Logo Text */}
        <span className="text-3xl font-bold font-serif">EVISION</span>
      </Link>
    );
  };

  return (
    <div className="relative z-10 shadow-md w-full dark:bg-black dark:text-white duration-300">
      <div className="container py-2">
        <div className="flex justify-between items-center">
          <div>
            <EvisionComponent />
          </div>
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-8">
              <li className="py-4">
                <a
                  href="/#"
                  className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                >
                  HOME
                </a>
              </li>
              <li className="py-4">
                <a
                  href="/electriccars"
                  className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                >
                  EVCARS
                </a>
              </li>
              <li className="py-4">
                <a
                  href="/evfaq"
                  className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                >
                  FAQ
                </a>
              </li>
              {!isAuthenticated ? (
                <li className="py-4">
                  <a
                    href="/login"
                    className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                  >
                    LOGIN
                  </a>
                </li>
              ) : (
                <>
                  {Navlinks.map(({ id, name, link }) => {
                    if (userRole === "Owner" && name === "CHARGING STATION") {
                      return (
                        <li key={id} className="py-4">
                          <a
                            href={link}
                            className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                          >
                            {name}
                          </a>
                        </li>
                      );
                    }
                    // else if (userRole === "Owner" && name === "Send Notifications") {
                    //   return (
                    //     <li key={id} className="py-4">
                    //       <a href={link} className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500">
                    //         {name}
                    //       </a>
                    //     </li>
                    //   );
                    // } else if (userRole === "Owner" && name === "SESSIONS") {
                    //   return (
                    //     <li key={id} className="py-4">
                    //       <a href={link} className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500">
                    //         {name}
                    //       </a>
                    //     </li>
                    //   );
                    // }
                    else if (
                      userRole === "Owner" &&
                      name === "OwnerCommunity"
                    ) {
                      return (
                        <li key={id} className="py-4">
                          <a
                            href={link}
                            className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                          >
                            {name}
                          </a>
                        </li>
                      );
                    } else if (userRole === "Client" && name === "STATIONS") {
                      return (
                        <li key={id} className="py-4">
                          <a
                            href={link}
                            className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                          >
                            {name}
                          </a>
                        </li>
                      );
                    } else if (userRole === "Client" && name === "COMMUNITY") {
                      return (
                        <li key={id} className="py-4">
                          <a
                            href={link}
                            className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                          >
                            {name}
                          </a>
                        </li>
                      );
                    } else if (userRole === "Client" && name === "VEHICLES") {
                      return (
                        <li key={id} className="py-4">
                          <a
                            href={link}
                            className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                          >
                            {name}
                          </a>
                        </li>
                      );
                    } else if (userRole === "Client" && name === "BOOKING") {
                      return (
                        <li key={id} className="py-4">
                          <a
                            href={link}
                            className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                          >
                            {name}
                          </a>
                        </li>
                      );
                    } else if (userRole === "Client" && name === "SERVICES") {
                      return (
                        <li key={id} className="py-4">
                          <a
                            href={link}
                            className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                          >
                            {name}
                          </a>
                        </li>
                      );
                    } else if (
                      userRole === "Servicer" &&
                      name === "My Services"
                    ) {
                      return (
                        <li key={id} className="py-4">
                          <a
                            href={link}
                            className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                          >
                            {name}
                          </a>
                        </li>
                      );
                    }
                    // else if (userRole === "Servicer" && name === "Send Notifications") {
                    //   return (
                    //     <li key={id} className="py-4">
                    //       <a href={link} className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500">
                    //         {name}
                    //       </a>
                    //     </li>
                    //   );
                    // }
                    else if (
                      userRole === "Servicer" &&
                      name === "ServicerCommunity"
                    ) {
                      return (
                        <li key={id} className="py-4">
                          <a
                            href={link}
                            className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                          >
                            {name}
                          </a>
                        </li>
                      );
                    }
                    return null; // Return null for links not displayed based on role
                  })}

                  {isAuthenticated && (
                    <li className="py-4">
                    <button
                      onClick={onLogout}
                      className="text-lg font-medium hover:text-primary"
                      style={{
                        backgroundColor: "transparent", // بدون خلفية
                        padding: "0", // إزالة المسافات الداخلية
                        border: "none", // بدون إطار
                        cursor: "pointer", // المؤشر يشير للنقر
                      }}
                    >
                      LOGOUT
                    </button>
                  </li>                  
                  )}
                </>
              )}
            </ul>
          </nav>
          <div className="flex items-center gap-4">
            {theme === "dark" ? (
              <BiSolidSun
                onClick={() => setTheme("light")}
                className="text-2xl cursor-pointer"
              />
            ) : (
              <BiSolidMoon
                onClick={() => setTheme("dark")}
                className="text-2xl cursor-pointer"
              />
            )}

            {userRole === "Client" && (
              <button
                onClick={toggleNotifications}
                className="relative bg-none"
                style={{ backgroundColor: "transparent" }}
              >
                <span className="text-2xl">🔔</span>
                {showNotifications && (
                  <NotificationDropdown clientId={clientId} />
                )}
              </button>
            )}

            {showMenu ? (
              <HiMenuAlt1
                onClick={toggleMenu}
                className="cursor-pointer transition-all"
                size={30}
              />
            ) : (
              <HiMenuAlt3
                onClick={toggleMenu}
                className="cursor-pointer transition-all"
                size={30}
              />
            )}
          </div>
        </div>
      </div>
      <ResponsiveMenu showMenu={showMenu} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
