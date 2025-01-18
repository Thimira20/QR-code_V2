import React, { useState } from "react";
import "./step.css";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

function Steps(props) {
  const [image, setImage] = useState(
    "https://github.com/Thimira20/qr-code2/blob/master/public/images/step1.jpg?raw=true"
  );

  // const showSpinner = function () {
  //   document.getElementById("spinner").style.display = "block";
  //   document.getElementById("spinner").className = "stepLoder";
  // };
  // const hideSpinner = function () {
  //   document.getElementById("spinner").style.display = "none";
  // };

  return (
    <div className="stepBox">
      <div className="stepBoxTop">
        <p className="stepTopic">Follow the Following Steps</p>
      </div>
      <div className="stepBoxBottom">
        <div className="bottomLeft">
          <div className="stepsList">
            <span className="stepText">
              Paste your link and Select the size
            </span>

            <button
              className="stepButton"
              onClick={() => {
                setImage(
                  "https://github.com/Thimira20/qr-code2/blob/master/public/images/step1.jpg?raw=true"
                );
              }}
            >
              <DoubleArrowIcon className="stepIcon" />
            </button>
          </div>
          <div className="stepsList">
            <span className="stepText">Click the "Generate"</span>

            <button
              className="stepButton"
              onClick={() =>
                setImage(
                  "https://github.com/Thimira20/qr-code2/blob/master/public/images/step2.jpg?raw=true"
                )
              }
            >
              <DoubleArrowIcon className="stepIcon" />
            </button>
          </div>
          <div className="stepsList">
            <span className="stepText">Download your QR code</span>

            <button
              className="stepButton"
              onClick={() =>
                setImage(
                  "https://github.com/Thimira20/qr-code2/blob/master/public/images/step3.jpg?raw=true"
                )
              }
            >
              <DoubleArrowIcon className="stepIcon" />
            </button>
          </div>
        </div>
        <div className="bottomRight">
          <div className="imageBox imgAnimation">
            <img src={image} alt="" id="stepImage" className="rightImage " />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Steps;
