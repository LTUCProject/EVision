import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login = ({ setIsAuthenticated }) => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("Client");

  const handleSwitch = () => {
    setIsLoginActive(!isLoginActive);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://localhost:7080/api/Account/Login",
        {
          userName: loginUsername,
          password: loginPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", loginUsername); // Save username
      localStorage.setItem("roles", response.data.roles); // Save role if returned from API
      setIsAuthenticated(true); // Update authentication state
      alert("Login successful");
      window.location.reload(); // Refresh the page
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.message || "Server error"));
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://localhost:7080/api/Account/Register",
        {
          userName: signupUsername,
          email: signupEmail,
          password: signupPassword,
          roles: [signupRole],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Signup successful");
    } catch (error) {
      alert("Signup failed: " + (error.response?.data?.message || "Server error"));
    }
  };

  return (
    <section className="forms-section">
      <h1 className="section-title">Login & Signup Forms</h1>
      <div className="forms">
        {/* Login Form */}
        <div className={`form-wrapper ${isLoginActive ? "is-active" : ""}`}>
          <button type="button" className="switcher switcher-login" onClick={handleSwitch}>
            Login
            <span className="underline"></span>
          </button>
          <form className="form form-login" onSubmit={handleLoginSubmit}>
            <fieldset>
              <legend>Please, enter your username and password for login.</legend>
              <div className="input-block">
                <label htmlFor="login-username">Username</label>
                <input
                  id="login-username"
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                />
              </div>
              <div className="input-block">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
            </fieldset>
            <button type="submit" className="btn-login">
              Login
            </button>
          </form>
        </div>

        {/* Signup Form */}
        <div className={`form-wrapper ${isLoginActive ? "" : "is-active"}`}>
          <button type="button" className="switcher switcher-signup" onClick={handleSwitch}>
            Sign Up
            <span className="underline"></span>
          </button>
          <form className="form form-signup" onSubmit={handleSignupSubmit}>
            <fieldset>
              <legend>Please, enter your email, password, and username for sign up.</legend>
              <div className="input-block">
                <label htmlFor="signup-username">Username</label>
                <input
                  id="signup-username"
                  type="text"
                  required
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                />
              </div>
              <div className="input-block">
                <label htmlFor="signup-email">E-mail</label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
              <div className="input-block">
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
              </div>
              <div className="input-block">
                <label htmlFor="signup-role">Role</label>
                <select
                  id="signup-role"
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                  required
                >
                  <option value="Admin">Admin</option>
                  <option value="Client">Client</option>
                  <option value="Owner">Owner</option>
                  <option value="Servicer">Servicer</option>
                </select>
              </div>
            </fieldset>
            <button type="submit" className="btn-signup">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
