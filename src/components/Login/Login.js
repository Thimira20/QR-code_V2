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
      setUser(user);
      alert("Login successful");
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
          <img
            src="https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
            alt="Avatar"
            className="avatar"
          />
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
