import React, { useState } from "react";
import "./login.css";
import { login } from "../../services/authService";
//import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Login({ closeLoginModal, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOutsideClick = (event) => {
    if (event.target.id === "id01") {
      closeLoginModal();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if email is defined and is a string
      if (!email || typeof email !== "string") {
        throw new Error("Invalid email");
      }
      const normalizedEmail = email.trim().toLowerCase(); // Safely use toLowerCase
      const user = await login(normalizedEmail, password);
      setUser(user.user);
      alert(`"Login successful" ${user.user.role}`);
      
      closeLoginModal();
    } catch (error) {
      console.log("Login error:", error); // Log the error for debugging
      alert("Login failed");
    }
  };

  return (
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
          {/* <label>
            <input type="checkbox" checked="checked" name="remember" /> Remember
            me
          </label> */}
        </div>

        <button type="button" onClick={closeLoginModal} className="cancelbtn">
          Cancel
        </button>
      </form>
    </div>
  );
}

export default Login;
