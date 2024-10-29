import React, { useState } from 'react';
import './Login.css'; // Make sure to import the CSS file with the styles you provided

const Login = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);

  const handleSwitch = () => {
    setIsLoginActive(!isLoginActive);
  };

  return (
    <section className="forms-section">
      <br/>
      <h1 className="section-title">Login & Signup Forms</h1>
      <div className="forms">
        <div className={`form-wrapper ${isLoginActive ? 'is-active' : ''}`}>
          <button type="button" className="switcher switcher-login" onClick={handleSwitch}>
            Login
            <span className="underline"></span>
          </button>
          <form className="form form-login">
            <fieldset>
              <legend>Please, enter your email and password for login.</legend>
              <div className="input-block">
                <label htmlFor="login-email">E-mail</label>
                <input id="login-email" type="email" required />
              </div>
              <div className="input-block">
                <label htmlFor="login-password">Password</label>
                <input id="login-password" type="password" required />
              </div>
            </fieldset>
            <button type="submit" className="btn-login">Login</button>
          </form>
        </div>

        <div className={`form-wrapper ${isLoginActive ? '' : 'is-active'}`}>
          <button type="button" className="switcher switcher-signup" onClick={handleSwitch}>
            Sign Up
            <span className="underline"></span>
          </button>
          <form className="form form-signup">
            <fieldset>
              <legend>Please, enter your email, password and password confirmation for sign up.</legend>
              <div className="input-block">
                <label htmlFor="signup-username">Username</label>
                <input id="signup-username" type="text" required />
              </div>
              <div className="input-block">
                <label htmlFor="signup-email">E-mail</label>
                <input id="signup-email" type="email" required />
              </div>
              <div className="input-block">
                <label htmlFor="signup-password">Password</label>
                <input id="signup-password" type="password" required />
              </div>
            </fieldset>
            <button type="submit" className="btn-signup">Sign Up</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
