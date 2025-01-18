import React from "react";
import "./aboutUs.css";
import QrCodeIcon from "@mui/icons-material/QrCode";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
function AboutUs(props) {
  const handleHomeClick = () => {
    document
      .getElementById("homeSection")
      .scrollIntoView({ behavior: "smooth" });
  };

  const handleStepsClick = () => {
    document
      .getElementById("stepsSection")
      .scrollIntoView({ behavior: "smooth" });
  };

  const handleGenerateClick = () => {
    document
      .getElementById("generatorSection")
      .scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="aboutBox">
      <div className="aboutTop">
        <p className="aboutTopic">Contact</p>
      </div>
      <div className="aboutUp">top</div>
      <div className="aboutDown">
        <div className="leftHelpBar">
          <QrCodeIcon className="qrLogo" />
        </div>
        <div className="spacing"></div>
        <div className="rightHelpBar">
          <button className="helpButton" onClick={handleHomeClick}>
            Home
          </button>
          <button className="helpButton" onClick={handleStepsClick}>
            Steps
          </button>
          <button className="helpButton" onClick={handleGenerateClick}>
            Genarate
          </button>
        </div>
        <div className="spacing"></div>
      </div>
      <hr></hr>
      <div className="aboutBottom">
        <div className="aboutBottomLeft">
          <p className="copyright"> All rights reservered 2024</p>
        </div>
        <div className="aboutBottomRight">
          <a href="https://www.instagram.com/thimira_navodya_?igsh=YXhxNjducGk3aGQx">
            <InstagramIcon className="social" />
          </a>
          <a href="https://www.facebook.com/thimira.navodya.1?mibextid=kFxxJD">
            <FacebookIcon className="social" />
          </a>
          <a href="https://www.linkedin.com/in/thimira-navodya-59157a244?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BBiVkeTUiRz%2BhqUyeGhyicg%3D%3D">
            <LinkedInIcon className="social" />
          </a>
          <a href="https://github.com/Thimira20">
            <GitHubIcon className="social" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
