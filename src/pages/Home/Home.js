import React from "react";
import "./home.css";

function Home(props) {
  return (
    <div className="homeBox">
      <div className="homeBoxLeft">
        <div className="leftBoxContainer">
          {/* <p className="text">Welcome </p>
          <p className="text">to the QR</p>
          <p className="text">World</p> */}
          <h1 class="title">
            <span className="text" >Welcome</span>
            <span className="text">to the QR</span>
            <span className="text">World</span>
          </h1>
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
