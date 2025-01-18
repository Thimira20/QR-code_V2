import React from "react";
import "./home.css";

function Home(props) {
  return (
    <div className="homeBox">
      <div className="homeBoxLeft">
        <div className="leftBoxContainer">
          <p className="text">Welcome </p>
          <p className="text">to the QR</p>
          <p className="text">World</p>
        </div>
      </div>
      <div className="homeBoxRight">
        {/* <div className="rightBoxContainer">
          <img src="/images/qr-codeHome.png" alt="" className="homeQr" />
        </div> */}
        <div className="loader1"></div>
      </div>
    </div>
  );
}

export default Home;
