import React, { useState } from "react";
import "./navBar.css";
import Login from "../Login/Login";
import Signup from "../SignUp/Signup";
import { getCurrentUser, logout } from "../../services/authService";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Refresh } from "@mui/icons-material";
import AnimatedLogo from "../AnimatedLogo";

function NavBar({ user, setUser, refresh }) {
  let currentUser = getCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const handleHomeClick = () => {
    document
      .getElementById("homeSection")
      .scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  const handleStepsClick = () => {
    document
      .getElementById("stepsSection")
      .scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  const handleGenerateClick = () => {
    document
      .getElementById("generatorSection")
      .scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  const handleContactClick = () => {
    document
      .getElementById("aboutUsSection")
      .scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleLoginClick = () => {
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };
  const handleSignupClick = () => {
    setSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setSignupModalOpen(false);
  };
  const handleLogout = () => {
    logout();
    setUser(null);
    refresh();
  };

  return (
    <div>
      <div className={`navBarBox ${sidebarOpen ? "hideNavBar" : ""}`}>
      
        <div className="navBarBoxLeft">
          
          <p className="easy">easy</p>
          <p className="qr">QR</p>
        </div>
        <div className="navBarBoxCenter"></div>
        <div className="navBarBoxRight ">
          <button className="navButton" onClick={handleHomeClick}>
            Home
          </button>

          {user ? (
            <>
              <button className="navButton" onClick={handleLogout}>
                Logout
              </button>
              <AccountCircleIcon />
              <div className="navButton">{currentUser.username}</div>
            </>
          ) : (
            <>
              <button className="navButton" onClick={handleLoginClick}>
                Login
              </button>
              <button className="navButton" onClick={handleSignupClick}>
                Signup
              </button>
            </>
          )}

          <button className="navButton" onClick={handleStepsClick}>
            Steps
          </button>
          <button className="navButton" onClick={handleGenerateClick}>
            Generate
          </button>
          <button className="navButton" onClick={handleContactClick}>
            About Us
          </button>
        </div>
      </div>
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="closeButton" onClick={toggleSidebar}>
          X
        </button>
        <button className="sidebarButton" onClick={handleHomeClick}>
          Home
        </button>

        {user ? (
          <>
            <button className="sidebarButton" onClick={handleLogout}>
              Logout
            </button>

            <div className="sidebarButton">{currentUser.username}</div>
          </>
        ) : (
          <>
            <button className="sidebarButton" onClick={handleLoginClick}>
              Login
            </button>
            <button className="sidebarButton" onClick={handleSignupClick}>
              Signup
            </button>
          </>
        )}

        <button className="sidebarButton" onClick={handleStepsClick}>
          Steps
        </button>
        <button className="sidebarButton" onClick={handleGenerateClick}>
          Generate
        </button>
        <button className="sidebarButton" onClick={handleContactClick}>
          About Us
        </button>
      </div>
      <button className="menuButton" onClick={toggleSidebar}>
        ☰
      </button>
      {loginModalOpen && (
        <Login setUser={setUser} closeLoginModal={closeLoginModal} />
      )}
      {signupModalOpen && <Signup closeSignupModal={closeSignupModal} />}
    </div>
  );
}

export default NavBar;
