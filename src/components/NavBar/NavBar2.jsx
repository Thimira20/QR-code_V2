import React, { useState, useEffect } from "react";
import "./navBar.css";
import Login from "../Login/Login2";
import Signup from "../SignUp/Signup2";
import { getCurrentUser, logout } from "../../services/authService";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('NavBar Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="navBarBox">Loading...</div>;
    }
    return this.props.children;
  }
}

function NavBar({ user, setUser, refresh }) {
  const [localUser, setLocalUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  useEffect(() => {
    // Update local user state when user prop changes
    if (user) {
      setLocalUser(user);
    } else {
      // If no user prop, try to get from localStorage
      const storedUser = getCurrentUser();
      setLocalUser(storedUser);
    }
  }, [user]);

  // Separate function to safely get username
  const getDisplayName = () => {
    if (localUser && localUser.username) {
      return localUser.username;
    }
    if (user && user.username) {
      return user.username;
    }
    return 'Guest';
  };

  const handleHomeClick = () => {
    document.getElementById("homeSection")?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  const handleStepsClick = () => {
    document.getElementById("stepsSection")?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  const handleGenerateClick = () => {
    document.getElementById("generatorSection")?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  const handleContactClick = () => {
    document.getElementById("aboutUsSection")?.scrollIntoView({ behavior: "smooth" });
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
    setLocalUser(null);
    refresh();
  };

  const isUserLoggedIn = Boolean(user || localUser);
  const displayName = getDisplayName();

  return (
    <ErrorBoundary>
      <div>
        <div className={`navBarBox ${sidebarOpen ? "hideNavBar" : ""}`}>
          <div className="navBarBoxLeft">
            <p className="easy">easy</p>
            <p className="qr">QR</p>
          </div>
          <div className="navBarBoxCenter"></div>
          <div className="navBarBoxRight">
            <button className="navButton" onClick={handleHomeClick}>
              Home
            </button>

            {isUserLoggedIn ? (
              <>
                <button className="navButton" onClick={handleLogout}>
                  Logout
                </button>
                <AccountCircleIcon />
                <div className="navButton">{displayName}</div>
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

        {/* Sidebar with the same logic */}
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <button className="closeButton" onClick={toggleSidebar}>
            X
          </button>
          <button className="sidebarButton" onClick={handleHomeClick}>
            Home
          </button>

          {isUserLoggedIn ? (
            <>
              <button className="sidebarButton" onClick={handleLogout}>
                Logout
              </button>
              <div className="sidebarButton">{displayName}</div>
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
          <Login 
            setUser={setUser} 
            closeLoginModal={closeLoginModal} 
            open={loginModalOpen}
          />
        )}
        {signupModalOpen && (
          <Signup 
            closeSignupModal={closeSignupModal} 
            open={signupModalOpen}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default NavBar;