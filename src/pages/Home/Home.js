import React, { useEffect, useState } from "react";
import "./home.css";
import AnimatedLogo from "../../components/AnimatedLogo";


function Home(props) {
  const [size, setSize] = useState({ width: 200, height: 200 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setSize({ width: 200, height: 200 });
      } else if (window.innerWidth <= 810) {
        setSize({ width: 210, height: 210 });
      } else {
        setSize({ width: 300, height: 300 });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call the function initially to set the size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className="homeBox" >
      <div className="homeBoxLeft">
        <div className="leftBoxContainer">
          {/* QR Pattern Background */}
          <div className="qr-pattern">
            <div className="qr-block"></div>
            <div className="qr-block"></div>
            <div className="qr-block"></div>
            <div className="qr-block"></div>
            <div className="qr-block"></div>
            <div className="qr-block"></div>
            <div className="qr-block"></div>
            <div className="qr-block"></div>
            <div className="qr-block"></div>
            <div className="qr-block"></div>
            <div className="qr-block"></div>
            <div className="qr-block"></div>
          </div>

          {/* Main Hero Text */}
          <h1 className="title">
            <span className="text">Welcome</span>
            <span className="text">to the QR</span>
            <span className="text">World</span>
          </h1>
        </div>
      </div>
      <div className="homeBoxRight">
        {/* <div className="rightBoxContainer">
          <img src="/images/qr-codeHome.png" alt="" className="homeQr" />
        </div> */}
        {/* <div className="loader1"></div> */}
        <AnimatedLogo h={size.height} w={size.width} />
      </div>
    </div>
  );
}

export default Home;
