import React, { useState } from "react";
import "./signup.css";
import { register } from "../../services/authService";
import { Alert, Snackbar } from '@mui/material';

function Signup({ closeSignupModal, open }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
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
      closeSignupModal();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      handleAlert("Registration successful! You can now log in.", "success");
      setTimeout(() => {
        closeSignupModal();
      }, 1500);
    } catch (error) {
      handleAlert("Registration failed. Please try again.", "error");
    }
  };

  return (
    <>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ position: 'fixed', zIndex: 9999 }}
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
        <span onClick={closeSignupModal} className="close" title="Close Modal">
          &times;
        </span>

        <form
          className="modal-content animate"
          action="/action_page.php"
          onSubmit={handleSubmit}
        >
          <div className="imgcontainer">
            <img
              src="https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
              alt="Avatar"
              className="avatar"
            />
          </div>

          <div className="container">
            <label className="label" htmlFor="uname">
              <b>Username</b>
            </label>
            <input
              type="username"
              placeholder="Enter Username"
              name="uname"
              required
              className="inputUsername"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <label className="label" htmlFor="uname">
              <b>Email</b>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              required
              className="inputUsername"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
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
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <button className="loginBtn" type="submit">
              Signup
            </button>
          </div>

          <button type="button" onClick={closeSignupModal} className="cancelbtn">
            Cancel
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;