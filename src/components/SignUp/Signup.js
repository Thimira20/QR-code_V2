import React, { useState } from "react";
import "./signup.css";
import { register } from "../../services/authService";

function Signup({ closeSignupModal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const handleOutsideClick = (event) => {
    if (event.target.id === "id01") {
      closeSignupModal();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      alert("Registration successful");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
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
          {/* <label>
            <input type="checkbox" checked="checked" name="remember" /> Remember
            me
          </label> */}
        </div>

        <button type="button" onClick={closeSignupModal} className="cancelbtn">
          Cancel
        </button>
      </form>
    </div>
  );
}

export default Signup;
