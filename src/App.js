import { useState } from "react";
import NavBar from "./components/NavBar/NavBar";
import AboutUs from "./pages/AboutUS/AboutUs";
import Genarator from "./pages/Genarator/Genarator";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Steps from "./pages/Step/Steps";
import "./app.css";

function App() {
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0); 


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
