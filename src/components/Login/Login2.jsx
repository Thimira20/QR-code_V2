import React, { useState } from "react";
import "./login.css";
import { login } from "../../services/authService";
import { Alert, Snackbar } from '@mui/material';

function Login({ closeLoginModal, setUser, open }) {  // Added 'open' prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleAlert = (message, severity) => {
    setAlert({
      open: true,
      message,
      severity
    });
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert(prev => ({ ...prev, open: false }));
  };

  const handleOutsideClick = (event) => {
    if (event.target.id === "id01") {
      closeLoginModal();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || typeof email !== "string") {
        handleAlert("Invalid email format", "error");
        throw new Error("Invalid email");
      }
      const normalizedEmail = email.trim().toLowerCase();
      const user = await login(normalizedEmail, password);
      setUser(user.user);
      handleAlert(`Welcome back, ${user.user.role}!`, "success");
      
      // Delay modal closing to show the success message
      setTimeout(() => {
        closeLoginModal();
      }, 1500);
    } catch (error) {
      console.log("Login error:", error);
      handleAlert("Invalid email or password", "error");
    }
  };

  return (
    <>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ position: 'fixed', zIndex: 9999 }}  // Added zIndex
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <div id="id01" className="modal" onClick={handleOutsideClick}>
        <span onClick={closeLoginModal} className="close" title="Close Modal">
          &times;
        </span>

        <form
          className="modal-content animate"
          action="/action_page.php"
          onSubmit={handleSubmit}
        >
          <div className="imgcontainer">
            <div className="login-icon">
              <svg 
                width="80" 
                height="80" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="animated-login-icon"
              >
                <circle 
                  cx="12" 
                  cy="8" 
                  r="3" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none"
                  className="user-head"
                />
                <path 
                  d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none"
                  className="user-body"
                />
              </svg>
            </div>
          </div>

          <div className="container">
            <label className="label" htmlFor="uname">
              <b>Email</b>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              required
              className="inputUsername"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="label" htmlFor="psw">
              <b>Password</b>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="psw"
              required
              className="inputPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="loginBtn" type="submit">
              Login
            </button>
          </div>

          <button type="button" onClick={closeLoginModal} className="cancelbtn">
            Cancel
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;