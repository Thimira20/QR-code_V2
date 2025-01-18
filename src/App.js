import { useState } from "react";
import NavBar from "./components/NavBar/NavBar";
import AboutUs from "./pages/AboutUS/AboutUs";
import Genarator from "./pages/Genarator/Genarator";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Steps from "./pages/Step/Steps";

function App() {
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(null);

  const refresh = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <div className="App">
      <NavBar user={user} setUser={setUser} />
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
        <Genarator refresh={refresh} count={count} setCount={setCount} />
      </div>
      <div id="aboutUsSection">
        <AboutUs />
      </div>
    </div>
  );
}

export default App;
