import React from "react";
import "./aboutUs.css";
import QrCodeIcon from "@mui/icons-material/QrCode";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import AnimatedLogo from "../../components/AnimatedLogo";
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
        <p className="aboutTopic">About Us</p>
      </div>
      <div className="aboutUp">
      <div className="aboutContent">
        <div className="about">
          <div className="abouthead">About our app</div>
          <p>
            Welcome to our QR Code Generator app! Our mission is to make QR Code creation seamless,
            whether you're a business professional, a student, or just someone exploring digital tools.
            With easy-to-use features and a sleek design, we aim to provide the best QR Code generating experience.
          </p>

          <h3>Features</h3>
          <ul>
            <li>Customizable QR Codes (colors, logos, and more).</li>
            <li>Instant downloads in high resolution.</li>
            <li>Completely browser-based – no downloads required.</li>
            <li>Secure and reliable service.</li>
          </ul>
        </div>
        <div className="contact">
          <h3>Contact Us</h3>
          <p>
            Have questions or feedback? Reach out to us on social media or via email at
            <a href="mailto:thimiranavodya20@gmail.com">thimiranavodya20@gmail.com</a>.
          </p>
          </div>
      </div>

      </div>
      <div className="aboutDown">
        <div className="leftHelpBar">
          {/* <QrCodeIcon className="qrLogo" /> */}
          <AnimatedLogo h={40} w={40} />
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
