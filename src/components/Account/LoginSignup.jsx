import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import carImage from '../../assets/car1.png';
import "./Login.css";


const LoginSignup = ({ setIsAuthenticated }) => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("Client");

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgetPasswordEmail, setForgetPasswordEmail] = useState("");
  const [isVerifyCode, setIsVerifyCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

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
      localStorage.setItem("username", loginUsername);
      localStorage.setItem("roles", response.data.roles.$values);
      setIsAuthenticated(true);
      toast.success("Login successful");


      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error("Login failed: " + (error.response?.data?.message || "Server error"));
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
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
      toast.success("Signup successful");
      handleSwitch(); // Switch to login after signup
    } catch (error) {
      toast.error("Signup failed: " + (error.response?.data?.message || "Server error"));
    }
  };

  const handleForgetPassword = async () => {
    try {
      await axios.post(`https://localhost:7080/api/Account/ResetPassword?email=${forgetPasswordEmail}`);
      setForgetPasswordEmail("");
      setIsForgotPassword(false);
      setIsVerifyCode(true);
    } catch (error) {
      toast.error("Forget Password error: " + (error.response?.data?.message || error.message));
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post(`https://localhost:7080/api/Account/ValidateCode?code=${verificationCode}`);
      if (response.data) {
        setIsVerifyCode(false);
        setIsResetPassword(true);
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (error) {
      toast.error("Verification error: " + (error.response?.data?.message || error.message));
    }
  };

  const handleNewPassword = async () => {
    try {
      await axios.post(`https://localhost:7080/api/Account/NewPassword?newPassword=${newPassword}&code=${verificationCode}`);
      toast.success("Password reset successfully!");
      setIsResetPassword(false);
      navigate('/Login', { replace: true });
    } catch (error) {
      toast.error("Reset password error: " + (error.response?.data?.message || error.message));
    }
  };

  const showForgetPassword = () => {
    setIsForgotPassword(true);
  };

  return (
    <div id="auth-container" className={`auth-container ${isLoginActive ? 'auth-sign-in' : 'auth-sign-up'}`} style={{ width: '1650px' }}>
            {/* <img src={carImage} alt="Moving Car" className="car-background" /> */}
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
    
      <div className="auth-row">
        {/* SIGN UP FORM */}
        <div className="auth-col auth-align-items-center auth-flex-col auth-sign-up">
          <div className="auth-form-wrapper auth-align-items-center">
            <div className="auth-form auth-sign-up">
              <div className="auth-input-group">
                <i className='bx bxs-user'></i>
                <input type="username" placeholder="Username" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} />
              </div>
              <div className="auth-input-group">
                <i className='bx bx-mail-send'></i>
                <input type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
              </div>
              <div className="auth-input-group">
                <i className='bx bxs-lock-alt'></i>
                <input type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
              </div>
              <div className="auth-input-group">
  <i className='bx bx-mail-send'></i>
  <div className="checkbox-group">
    <label>
      <input
        type="checkbox"
        value="Client"
        checked={signupRole === "Client"}
        onChange={(e) => setSignupRole(e.target.value)}
      />
      Client
    </label>
    <label>
      <input
        type="checkbox"
        value="Owner"
        checked={signupRole === "Owner"}
        onChange={(e) => setSignupRole(e.target.value)}
      />
      Owner
    </label>
    <label>
      <input
        type="checkbox"
        value="Servicer"
        checked={signupRole === "Servicer"}
        onChange={(e) => setSignupRole(e.target.value)}
      />
      Servicer
    </label>
  </div>
</div>

              <button onClick={handleSignupSubmit}>Sign up</button>
              <p>
                <span>Already have an account?</span>
                <b onClick={handleSwitch} className="auth-pointer">Sign in here</b>
              </p>
            </div>
          </div>
        </div>

        {/* SIGN IN FORM */}
        {!isForgotPassword && !isVerifyCode && !isResetPassword && (
          <div className="auth-col auth-align-items-center auth-flex-col auth-sign-in">
            <div className="auth-form-wrapper auth-align-items-center">
              <div className="auth-form auth-sign-in">
                <div className="auth-input-group">
                  <i className='bx bxs-user'></i>
                  <input type="username" placeholder="Username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
                </div>
                <div className="auth-input-group">
                  <i className='bx bxs-lock-alt'></i>
                  <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </div>
                <button onClick={handleLoginSubmit}>Sign in</button>
                <p><b onClick={showForgetPassword} className="auth-pointer">Forgot password?</b></p>
                <p>
                  <span>Don't have an account?</span>
                  <b onClick={handleSwitch} className="auth-pointer">Sign up here</b>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Forget Password Email */}
        {isForgotPassword && (
          <div className="auth-col auth-align-items-center auth-flex-col auth-sign-in">
            <div className="auth-form-wrapper auth-align-items-center">
              <div className="auth-form auth-sign-in">
                <div className="auth-input-group">
                  <i className='bx bx-mail-send'></i>
                  <input type="email" placeholder="Email" value={forgetPasswordEmail} onChange={(e) => setForgetPasswordEmail(e.target.value)} />
                </div>
                <button onClick={handleForgetPassword}>Verify</button>
              </div>
            </div>
          </div>
        )}

        {/* Verification Code Form */}
        {isVerifyCode && (
          <div className="auth-col auth-align-items-center auth-flex-col auth-sign-in">
            <div className="auth-form-wrapper auth-align-items-center">
              <div className="auth-form auth-sign-in">
                <div className="auth-input-group">
                  <i className='bx bxs-lock-alt'></i>
                  <input type="text" placeholder="Enter Verification Code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                </div>
                <button onClick={handleVerifyCode}>Submit</button>
                <p><b onClick={handleSwitch} className="auth-pointer">Back to Sign In</b></p>
              </div>
            </div>
          </div>
        )}

        {/* New Password Form */}
        {isResetPassword && (
          <div className="auth-col auth-align-items-center auth-flex-col auth-sign-in">
            <div className="auth-form-wrapper auth-align-items-center">
              <div className="auth-form auth-sign-in">
                <div className="auth-input-group">
                  <i className='bx bxs-lock-alt'></i>
                  <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <button onClick={handleNewPassword}>Reset Password</button>
                <p><b onClick={handleSwitch} className="auth-pointer">Back to Sign In</b></p>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default LoginSignup;