import { useState, useEffect } from "react";
import NavBar from "./components/NavBar/NavBar2";
import AboutUs from "./pages/AboutUS/AboutUs2";
import Genarator from "./pages/Genarator/Genarator";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/ProfileNew";
import Steps from "./pages/Step/Step2";
import "./app.css";
import Users from "./pages/UserManagment/Users2";
import { getCurrentUser } from './services/authService';
//import { setupAxios } from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0); 

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      console.log("Restored user session:", storedUser.username);
    }
  }, []);

  const refresh = () => {
    setCount((prev) => prev + 1); };

 

  return (
    
    <div className="App">
      <NavBar user={user} setUser={setUser} refresh={refresh} />
      <div id="homeSection">
        <Home />
      </div>
      <div id="stepsSection">
        <Steps />
      </div>
      {user && (
        <div>
          <Profile refresh={refresh} count={count} setCount={setCount} />
        </div>
      )}
       {(user?.role === "admin" || user?.role === "super_admin") && (
        <div id="adminSection">
          <Users />
        </div>
        )}

      <div id="generatorSection">
        <Genarator refresh={refresh} count={count} setCount={setCount} user={user}/>
      </div>
      <div id="aboutUsSection">
        <AboutUs />
      </div>
     
    </div>
  );
}

export default App;
