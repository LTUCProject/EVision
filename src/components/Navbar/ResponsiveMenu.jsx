import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { Navlinks } from "./Navbar";

const ResponsiveMenu = ({ showMenu, onLogout }) => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "Guest");

    try {
      const storedRoles = JSON.parse(localStorage.getItem("roles"));
      setRole(storedRoles ? storedRoles.join(", ") : "User");
    } catch (error) {
      setRole(localStorage.getItem("roles") || "User");
    }
  }, []);

  const handleDeleteAccount = async () => {
    if (!username || username === "Guest") {
      return alert("No user is logged in.");
    }

    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`https://localhost:7080/api/Account/DeleteAccount`, {
        params: { username },
        headers: { "Content-Type": "application/json" },
      });

      alert(response.data.message || "Account deleted successfully.");
      localStorage.clear();
      if (onLogout) onLogout();

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      alert("Failed to delete account: " + (error.response?.data?.message || "Server error"));
    }
  };

  return (
    <div
      className={`${
        showMenu ? "left-0" : "-left-[100%]"
      } fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col justify-between bg-white dark:bg-gray-900 dark:text-white px-8 pb-6 pt-16 text-black transition-all duration-200 rounded-r-xl shadow-md`}
    >
      <div className="card">
        <div className="flex items-center justify-start gap-3">
          <FaUserCircle size={50} />
          <div>
            <h1>Hello {username}</h1>
            <h1 className="text-sm text-slate-500">{role}</h1>
          </div>
        </div>
        <nav className="mt-12">
          <ul className="space-y-4 text-xl">
            {Navlinks.map((data, index) => (
              <li key={index}>
                <a href={data.link} className="mb-5 inline-block">
                  {data.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="footer">
        <button onClick={handleDeleteAccount} className="btn-delete-account text-red-500">
          Delete Account
        </button>
        
        <h1>
          Made with ❤ by <a href="https://github.com/LTUCProject">PowerTeam</a>
        </h1>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
