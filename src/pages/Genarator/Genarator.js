import React, { useEffect, useRef, useState } from "react";
import "./genarator.css";
import QrCodeIcon from "@mui/icons-material/QrCode";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import axios from "axios";
//import Alert from "../../components/AlertBox"
import { getCurrentUser } from "../../services/authService";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SaveIcon from '@mui/icons-material/Save';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';
import DownloadDoneOutlinedIcon from '@mui/icons-material/DownloadDoneOutlined';
import SimpleAlert from "../../components/AlertBox";
import ShareIcon from '@mui/icons-material/Share';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { Snackbar } from "@mui/material";
import jsPDF from "jspdf";


function Genarator(props) {
  const [qrCodes, setQrCodes] = useState([]);
  const [value, setValue] = useState();
  const [size, setSize] = useState(300);
  const [animate, setAnimate] = useState(false);
  const [qrColor, setQrColor] = useState("#ffffff"); // Default color is black
  const [save, setSave] = useState(false);
  const [alert, setAlert] = useState({ open:"",message: "", severity: "" });
  const customColors = [
    "#ffffff",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#fa2dfa",
    "#00FFFF",
    "purple",
    "orange",
  ];
  const qrRef = useRef();
  let currentUser = getCurrentUser();

  function SimpleAlert(props) {
    return (
      <Alert icon={<CheckIcon fontSize="inherit" />} severity={props.severity}>
        {props.message}
      </Alert>
    );
  }
  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  // useEffect(() => {
    
  
  //     fetchQrCodes(currentUser.id);
      
  //   }, [props.count]);
  useEffect(() => {
    if (currentUser) {
      fetchQrCodes(currentUser.id);
    } else {
      console.warn("No user is currently logged in.");
    }
  }, [props.count]);
  
    const shareQrCode = async () => {
      if (qrRef.current) {
        try {
          const dataUrl = await toPng(qrRef.current);
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], "qr-code.png", { type: blob.type });
    
          if (navigator.share) {
            // Use Web Share API
            await navigator.share({
              title: "QR Code",
              text: "Check out this QR code!",
              files: [file], // Sharing the image file
            });
            setAlert({
              open: true,
              message: "Shared successfully!",
              severity: "success",
            });
          } else {
            setAlert({
              open: true,
              message: "Sharing not supported on this device.",
              severity: "warning",
            });
          }
        } catch (error) {
          console.error("Failed to share QR code:", error);
          setAlert({
            open: true,
            message: "Failed to share QR code.",
            severity: "error",
          });
        }
      }
    };

    // Add this function inside the `Genarator` component
    const downloadAsPdf = async () => {
      if (qrRef.current) {
        try {
          // Generate the image of the QR code
          const dataUrl = await toPng(qrRef.current);
    
          // Initialize jsPDF
          const pdf = new jsPDF();
    
          // Add custom text to the PDF
          const title = "Generated QR Code"; // Title text
          const subtitle = `URL: ${value}`; // Subtitle with the user's input
          const note = "Thank you for using the QR Code Generator!"; // Footer text
    
          pdf.setFontSize(16);
          pdf.text(title, pdf.internal.pageSize.getWidth() / 2, 20, { align: "center" }); // Centered title
          pdf.setFontSize(12);
          pdf.text(subtitle, pdf.internal.pageSize.getWidth() / 2, 30, { align: "center" }); // Centered subtitle
    
          // Add QR code image to PDF (centered)
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imageWidth = 100; // Desired width of the QR code in PDF
          const imageHeight = 100; // Desired height of the QR code in PDF
          const x = (pdfWidth - imageWidth) / 2;
          const y = 50; // Start position for the QR code image
    
          pdf.addImage(dataUrl, "PNG", x, y, imageWidth, imageHeight);
    
          // Add footer text below the QR code
          pdf.setFontSize(10);
          pdf.text(note, pdf.internal.pageSize.getWidth() / 2, y + imageHeight + 20, { align: "center" });
    
          // Save the PDF
          pdf.save(`easyQr ${value}.pdf`);
    
          // Success alert
          setAlert({
            open: true,
            message: "QR Code downloaded as PDF successfully!",
            severity: "success",
          });
        } catch (error) {
          console.error("Failed to generate PDF:", error);
    
          // Error alert
          setAlert({
            open: true,
            message: "Failed to download QR Code as PDF.",
            severity: "error",
          });
        }
      } else {
        setAlert({
          open: true,
          message: "No QR Code to download.",
          severity: "warning",
        });
      }
    };
    
    

  const fetchQrCodes = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/profile-data/user-qr-codes/${userId}`
      );
      await setQrCodes(response.data);
     
    } catch (error) {
      console.error("Failed to fetch QR codes:", error);
    }
  };
  const saveQrCode = async () => {
    
   // console.log(qrCodes.length);
    if(qrCodes.length < 10 || currentUser.username === "thimira"){
      if (qrRef.current) {
      toPng(qrRef.current)
        .then(async (dataUrl) => {
          const qrImageBase64 = dataUrl.split(",")[1]; // Extract base64 image
          const response = await axios.post(
            "http://localhost:3000/api/profile-data/save-qr-code",
            {
              userId: currentUser.id, // Assuming userId is passed as a prop
              qrText: value,
              qrImageBase64,
            }
          );

          setSave(true);
          //alert(response.data.message);
          setAlert({ open: true,
            message: response.data.message,
            severity: "success", });
          props.refresh();
         
        })
        .catch((err) => {
          console.error("Failed to save QR code:", err);
          console.log(currentUser.id);
          setAlert({ open: true,
            message: "Failed to save QR code",
            severity: "error", });
        });
     }
   
   }
   else{
    setAlert({ open: true,
      message: "You can save only 10 QR codes",
      severity: "warning", });
   }
  };

  function showDownload() {
    if (value === "") {
      //alert("Please give your Input");
      <SimpleAlert message="Please give your Input" severity = "warning" />;
    } else {
      if (!animate) {
        setAnimate(true);
        showSpinner();
        setTimeout(() => {
          hideSpinner();
          clearUI();
          const link = document.createElement("button");
          link.id = "downBtn";
          link.classList = "delButton";
          link.addEventListener("click", () => {
            downloadBtn();
            hideSpinner();
          });

          link.innerHTML = "Download";
          document.getElementById("downloadBox").appendChild(link);
        }, 2000);
      }
    }
  }
  const clearUI = function () {
    const saveBtn = document.getElementById("downBtn");
    if (saveBtn) {
      saveBtn.remove();
    }
  };

  const downloadBtn = () => {
    if (qrRef.current) {
      toPng(qrRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.classList = "delButton";
          link.download = "qr-code.png";
          link.innerHTML = "Download";

          link.addEventListener("click", (animate) => {
            setAnimate(!animate);
          });
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((err) => {
          console.error("Failed to generate QR code image:", err);
        });
    }
  };
  const showSpinner = function () {
    document.getElementById("spinner").style.display = "block";
    document.getElementById("spinner").className = "loader";
  };

  const hideSpinner = function () {
    document.getElementById("spinner").style.display = "none";
  };

  const g = document.getElementById("genBtn");
  const genrated = function () {
    setTimeout(() => {
      g.innerHTML = "Generated";
    }, 1900);
    g.innerHTML = "Generating...";
    console.log("correct");
  };
  const notGenrated = function () {
    g.innerHTML = "Generate";
    console.log("incorrect");
  };

  function handleClick() {
    g.classList.add("genrating"); // Add the "clicked" class to change color
    setTimeout(() => {
      g.classList.remove("genrating"); // Remove the "clicked" class after a delay
    }, 1900);
  }

  // Add event listener to the button

  return (
    <div className="genaratorBox">
      <div className="genaratorBoxTop">
        <p className="genTopic">Genarate Yor Own QR</p>
      </div>
      
      <div className="genaratorBoxUp">
        <div className="spacingBox"></div>
        <div className="urlSizeBox">
          <div className="inputBox">
            <QrCodeIcon className="qrIcon" />
            <input
              type="text"
              placeholder="Paste your link here"
              onChange={(e) => {
                setValue(e.target.value);
                clearUI();
                setAnimate(false);
                setSave(false);
               
                notGenrated();
                props.setCount(props.count + 1);
              }}
              className="qrInput"
            />
          </div>
          <div className="sizeBox">
            <select
              className="selected"
              name="size"
              id="size"
              value={size}
              onChange={(e) => {
                setSize(parseInt(e.target.value === "" ? 0 : e.target.value));
                clearUI();
                setAnimate(false);
                notGenrated();
                setSave(false);
              }}
            >
              <option value="100">100x100</option>
              <option value="200">200x200</option>
              <option value="300" defaultValue={300}>
                300x300
              </option>
              {/* <option value="400">400x400</option>
              <option value="500">500x500</option>
              <option value="600">600x600</option>
              <option value="700">700x700</option> */}
              {window.innerWidth > 500 && (
                <>
                  <option value="400">400x400</option>
                  <option value="500">500x500</option>
                  <option value="600">600x600</option>
                  <option value="700">700x700</option>
                </>
              )}
            </select>
          </div>
          <div className="colorBox">
            {customColors.map((color) => (
              <button
                key={color}
                className="colorButton"
                style={{ backgroundColor: color }}
                onClick={() => {
                  setQrColor(color);
                  setSave(false);
                }}
              />
            ))}
          </div>
        </div>

        <div className="buttonBox">
          <button
            onClick={() => {
              showDownload();
              handleClick();
              genrated();
            }}
            className="genButton"
            id="genBtn"
          >
            Generate
          </button>
        </div>
        <div className="spacingBox"></div>
      </div>
      <div className="genaratorBoxDown">
        <div className="qrBox" ref={qrRef}>
          {value && (
            <QRCode
              title="easyQR"
              value={value}
              bgColor={qrColor}
              fgColor={"#000000"}
              size={size}
            />
          )}
        </div>
      </div>

      <div className="genaratorBoxBottom" id="downloadBox">
        {value && props.user? (
          <><button onClick={saveQrCode} className="saveButton">
            {save ? "saved" : "save"}{save ? <SaveIcon /> : <SaveOutlinedIcon />}
          </button> 
          <button onClick={shareQrCode} className="shareButton">
            Share QR Code 
            <ShareIcon/>
          </button>
          <button onClick={downloadAsPdf} className="pdfButton">
            Download as PDF <DownloadIcon/>
          </button> 
          <Snackbar
            open={alert.open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position of the alert
          >
            <Alert
              onClose={handleClose}
              severity={alert.severity}
              sx={{ width: "100%" }}
            >
              {alert.message}
            </Alert>
          </Snackbar>
          </>
        ) : console.log("No user is currently logged in.")}
        <div className="" id="spinner"></div>
        {/* <button
          onClick={downloadBtn}
          id="downBtn"
          className="delButton"
        ></button> */}
      </div>
    </div>
  );
}

export default Genarator;
