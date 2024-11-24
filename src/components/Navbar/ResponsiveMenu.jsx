import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { Navlinks } from "./Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal"; // Import react-modal

Modal.setAppElement("#root"); // Set the app element for accessibility

const ResponsiveMenu = ({ showMenu, onLogout }) => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [changePasswordData, setChangePasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showModal, setShowModal] = useState(false); // Modal visibility state for password change
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal visibility state for delete account

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "Guest");

    try {
      const storedRoles = JSON.parse(localStorage.getItem("roles"));
      setRole(storedRoles ? storedRoles.join(", ") : "User");
    } catch (error) {
      setRole(localStorage.getItem("roles") || "User");
    }
  }, []);

  const handleChangePasswordInput = (e) => {
    const { name, value } = e.target;
    setChangePasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangePassword = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7080/api/Account/ChangePassword",
        changePasswordData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password changed successfully!");
        setChangePasswordData({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setShowModal(false);
      }
    } catch (error) {
      toast.error(
        "Failed to change password: " +
          (error.response?.data?.message || "Server error")
      );
    }
  };

  const handleDeleteAccount = async () => {
    if (!username || username === "Guest") {
      return toast.warn("No user is logged in.");
    }

    try {
      const response = await axios.delete(
        `https://localhost:7080/api/Account/DeleteAccount`,
        {
          params: { username },
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(response.data.message || "Account deleted successfully.");
      localStorage.clear();
      if (onLogout) onLogout();

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(
        "Failed to delete account: " +
          (error.response?.data?.message || "Server error")
      );
    }
  };

  const getLinksForRole = () => {
    return Navlinks.filter(({ name }) => {
      if (
        role === "Owner" &&
        ["CHARGING STATION", "OwnerCommunity"].includes(name)
      ) {
        return true;
      }
      if (
        role === "Client" &&
        [
          "STATIONS",
          "ClientCommunity",
          "VEHICLES",
          "BOOKING",
          "SERVICES",
        ].includes(name)
      ) {
        return true;
      }
      if (
        role === "Servicer" &&
        ["My Services", "ServicerCommunity"].includes(name)
      ) {
        return true;
      }
      return false;
    });
  };

  return (
    <div
      className={`${
        showMenu ? "left-0" : "-left-[100%]"
      } fixed bottom-0 top-0 z-20 flex h-screen w-[30%] flex-col justify-between bg-white dark:bg-gray-900 dark:text-white px-8 pb-6 pt-16 text-black transition-all duration-200 rounded-r-xl shadow-md`}
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
            {getLinksForRole().map(({ id, name, link }) => (
              <li key={id}>
                <a href={link} className="mb-5 inline-block">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="footer">
        <button
          onClick={() => setShowModal(true)}
          className="btn-change-password bg-blue-500 text-white mt-3 p-2 rounded"
          style={{
            backgroundColor: "#003366",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "blue")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#003366")}
        >
          Change Password
        </button>
        <button
          onClick={() => setShowDeleteModal(true)} // Open delete modal
          className="btn-delete-account text-red-500 mt-3"
          style={{ backgroundColor: "transparent", color: "red" }}
        >
          Delete Account
        </button>
        <br />
        <br />

        <h1>
          Made with ❤ by{" "}
          <a
            href="https://github.com/LTUCProject"
            className="text-black hover:text-blue-500"
          >
            PowerTeam
          </a>
        </h1>
      </div>

      {/* Password Change Modal */}
      {showModal && (
        <div className="modal fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-[80%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Change Password</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleChangePassword();
              }}
            >
              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                value={changePasswordData.oldPassword}
                onChange={handleChangePasswordInput}
                className="input mb-3 w-full"
                required
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={changePasswordData.newPassword}
                onChange={handleChangePasswordInput}
                className="input mb-3 w-full"
                required
              />
              <input
                type="password"
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                value={changePasswordData.confirmNewPassword}
                onChange={handleChangePasswordInput}
                className="input mb-3 w-full"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-cancel bg-gray-500 text-white px-4 py-2 rounded"
                  style={{
                    backgroundColor: "#003366",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "blue")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#003366")
                  }
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
        contentLabel="Delete Account"
        className="custom-delete-modal modal-content bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-[80%] max-w-md"
        overlayClassName="modal fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50"
      >
        <h2 className="text-lg font-bold mb-4">
          Are you sure you want to delete your account?
        </h2>
        <p>This action cannot be undone.</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="btn-cancel bg-gray-500 text-white px-4 py-2 rounded"
            style={{
              backgroundColor: "#003366",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "blue")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#003366")}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAccount}
            className="btn-submit bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default ResponsiveMenu;
