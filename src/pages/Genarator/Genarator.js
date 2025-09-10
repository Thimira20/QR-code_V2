import React, { useEffect, useRef, useState, useMemo } from "react";
import "./modernGenerator.css";
import QrCodeIcon from "@mui/icons-material/QrCode";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import axios from "axios";
import { getCurrentUser } from "../../services/authService";
import SaveIcon from '@mui/icons-material/Save';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import PaletteIcon from '@mui/icons-material/Palette';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import CheckIcon from '@mui/icons-material/Check';
import { Snackbar, Popover, ClickAwayListener } from "@mui/material";
import Alert from '@mui/material/Alert';
import jsPDF from "jspdf";

function Genarator(props) {
  const [qrCodes, setQrCodes] = useState([]);
  const [value, setValue] = useState("");
  const [size, setSize] = useState(300);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [qrColor, setQrColor] = useState("#ffffff");
  const [save, setSave] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "" });
  const [loading, setLoading] = useState({
    download: false,
    save: false,
    share: false,
    pdf: false
  });
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
  
  // Enhanced color palette with comprehensive selection
  const customColors = useMemo(() => [
    { color: "#ffffff", name: "White" },
    { color: "#f8f9fa", name: "Light Gray" },
    { color: "#e3f2fd", name: "Light Blue" },
    { color: "#e8f5e8", name: "Light Green" },
    { color: "#fff3e0", name: "Light Orange" },
    { color: "#fce4ec", name: "Light Pink" },
    { color: "#f3e5f5", name: "Light Purple" },
    { color: "#ffebee", name: "Light Red" },
    { color: "#fffde7", name: "Light Yellow" },
    { color: "#e0f7fa", name: "Light Cyan" },
    { color: "#f1f8e9", name: "Mint Green" },
    { color: "#f9fbe7", name: "Pale Yellow" },
    { color: "#efebe9", name: "Beige" },
    { color: "#eceff1", name: "Slate Gray" },
    { color: "#e8eaf6", name: "Lavender" }
  ], []);

  // Enhanced size options
  const sizeOptions = useMemo(() => {
    const isMobile = window.innerWidth <= 768;
    return isMobile ? [
      { value: 150, label: "Small (150×150)" },
      { value: 200, label: "Medium (200×200)" },
      { value: 250, label: "Large (250×250)" }
    ] : [
      { value: 200, label: "Small (200×200)" },
      { value: 300, label: "Medium (300×300)" },
      { value: 400, label: "Large (400×400)" },
      { value: 500, label: "X-Large (500×500)" },
      { value: 600, label: "XX-Large (600×600)" }
    ];
  }, []);

  const qrRef = useRef();
  const downloadQrRef = useRef(); // Separate ref for clean downloads
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser?.id) {
      fetchQrCodes(currentUser.id);
    }
  }, [props.count, currentUser?.id]);

  // Auto-adjust size for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && size > 300) {
        setSize(250);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount

    return () => window.removeEventListener('resize', handleResize);
  }, [size]);

  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };
  
  const handleColorPickerOpen = (event) => {
    setColorPickerAnchor(event.currentTarget);
    setColorPickerOpen(true);
  };
  
  const handleColorPickerClose = () => {
    setColorPickerOpen(false);
    setColorPickerAnchor(null);
  };
  
  const handleColorSelect = (color) => {
    setQrColor(color);
    setSave(false);
    handleColorPickerClose();
  };

  const fetchQrCodes = async (userId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/profile-data/user-qr-codes/${userId}`
      );
      setQrCodes(response.data);
    } catch (error) {
      console.error("Failed to fetch QR codes:", error);
    }
  };

  const generateQRCode = async () => {
    if (!value.trim()) {
      setAlert({
        open: true,
        message: "Please enter a URL or text to generate QR code",
        severity: "warning"
      });
      return;
    }

    setIsGenerating(true);
    setIsGenerated(false);
    setSave(false);

    // Simulate generation time for better UX
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      setAlert({
        open: true,
        message: "QR Code generated successfully!",
        severity: "success"
      });
    }, 1500);
  };

  const downloadQRCode = async () => {
    if (!value || !isGenerated) {
      setAlert({
        open: true,
        message: "No QR Code to download",
        severity: "warning"
      });
      return;
    }

    try {
      // Set loading state
      setLoading(prev => ({ ...prev, download: true }));
      
      // Make sure the element is ready to be captured
      if (!downloadQrRef.current) return;
      
      // Make the QR element temporarily visible for capturing
      downloadQrRef.current.style.opacity = 1;
      downloadQrRef.current.style.zIndex = 1000;
      downloadQrRef.current.style.position = 'fixed';
      downloadQrRef.current.style.top = '0';
      downloadQrRef.current.style.left = '0';
      
      // Give the browser time to render
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Capture the QR code
      const dataUrl = await toPng(downloadQrRef.current, {
        cacheBust: true,
        backgroundColor: qrColor,
        width: size + 40,
        height: size + 40,
        pixelRatio: 2 // Higher quality
      });
      
      // Hide the element again
      downloadQrRef.current.style.opacity = 0;
      downloadQrRef.current.style.zIndex = -1000;
      downloadQrRef.current.style.position = 'absolute';
      
      // Trigger download
      const link = document.createElement("a");
      link.download = `qr-code-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
      setAlert({
        open: true,
        message: "QR Code downloaded successfully!",
        severity: "success"
      });
    } catch (error) {
      console.error("Download failed:", error);
      setAlert({
        open: true,
        message: "Failed to download QR Code",
        severity: "error"
      });
      
      // Ensure element is hidden if there's an error
      if (downloadQrRef.current) {
        downloadQrRef.current.style.opacity = 0;
        downloadQrRef.current.style.zIndex = -1000;
      }
    } finally {
      // Reset loading state
      setLoading(prev => ({ ...prev, download: false }));
    }
  };

  const saveQrCode = async () => {
    if (!currentUser) {
      setAlert({
        open: true,
        message: "Please login to save QR codes",
        severity: "warning"
      });
      return;
    }

    if (qrCodes.length >= 10 && currentUser.role !== "admin") {
      setAlert({
        open: true,
        message: "You can save only 10 QR codes",
        severity: "warning"
      });
      return;
    }

    if (!value || !isGenerated) {
      setAlert({
        open: true,
        message: "No QR Code to save",
        severity: "warning"
      });
      return;
    }

    try {
      // Set loading state
      setLoading(prev => ({ ...prev, save: true }));
      
      // Make sure the element is ready to be captured
      if (!downloadQrRef.current) return;
      
      // Make the QR element temporarily visible for capturing
      downloadQrRef.current.style.opacity = 1;
      downloadQrRef.current.style.zIndex = 1000;
      downloadQrRef.current.style.position = 'fixed';
      downloadQrRef.current.style.top = '0';
      downloadQrRef.current.style.left = '0';
      
      // Give the browser time to render
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Capture the QR code
      const dataUrl = await toPng(downloadQrRef.current, {
        cacheBust: true,
        backgroundColor: qrColor,
        width: size + 40,
        height: size + 40,
        pixelRatio: 2 // Higher quality
      });
      
      // Hide the element again
      downloadQrRef.current.style.opacity = 0;
      downloadQrRef.current.style.zIndex = -1000;
      downloadQrRef.current.style.position = 'absolute';
      
      const qrImageBase64 = dataUrl.split(",")[1];
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/profile-data/save-qr-code`,
        {
          userId: currentUser.id,
          qrText: value,
          qrImageBase64,
        }
      );

      setSave(true);
      setAlert({
        open: true,
        message: response.data.message,
        severity: "success"
      });
      props.refresh?.();
    } catch (error) {
      console.error("Save failed:", error);
      setAlert({
        open: true,
        message: "Failed to save QR code",
        severity: "error"
      });
      
      // Ensure element is hidden if there's an error
      if (downloadQrRef.current) {
        downloadQrRef.current.style.opacity = 0;
        downloadQrRef.current.style.zIndex = -1000;
      }
    } finally {
      // Reset loading state
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  const shareQrCode = async () => {
    if (!value || !isGenerated) {
      setAlert({
        open: true,
        message: "No QR Code to share",
        severity: "warning"
      });
      return;
    }

    try {
      // Set loading state
      setLoading(prev => ({ ...prev, share: true }));
      
      // Make sure the element is ready to be captured
      if (!downloadQrRef.current) return;
      
      // Make the QR element temporarily visible for capturing
      downloadQrRef.current.style.opacity = 1;
      downloadQrRef.current.style.zIndex = 1000;
      downloadQrRef.current.style.position = 'fixed';
      downloadQrRef.current.style.top = '0';
      downloadQrRef.current.style.left = '0';
      
      // Give the browser time to render
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Capture the QR code
      const dataUrl = await toPng(downloadQrRef.current, {
        cacheBust: true,
        backgroundColor: qrColor,
        width: size + 40,
        height: size + 40,
        pixelRatio: 2 // Higher quality
      });
      
      // Hide the element again
      downloadQrRef.current.style.opacity = 0;
      downloadQrRef.current.style.zIndex = -1000;
      downloadQrRef.current.style.position = 'absolute';
      
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "qr-code.png", { type: blob.type });

      if (navigator.share) {
        await navigator.share({
          title: "QR Code",
          text: "Check out this QR code!",
          files: [file],
        });
        setAlert({
          open: true,
          message: "Shared successfully!",
          severity: "success"
        });
      } else {
        setAlert({
          open: true,
          message: "Sharing not supported on this device",
          severity: "warning"
        });
      }
    } catch (error) {
      console.error("Share failed:", error);
      setAlert({
        open: true,
        message: "Failed to share QR code",
        severity: "error"
      });
      
      // Ensure element is hidden if there's an error
      if (downloadQrRef.current) {
        downloadQrRef.current.style.opacity = 0;
        downloadQrRef.current.style.zIndex = -1000;
      }
    } finally {
      // Reset loading state
      setLoading(prev => ({ ...prev, share: false }));
    }
  };

  const downloadAsPdf = async () => {
    if (!value || !isGenerated) {
      setAlert({
        open: true,
        message: "No QR Code to download",
        severity: "warning"
      });
      return;
    }

    try {
      // Set loading state
      setLoading(prev => ({ ...prev, pdf: true }));
      
      // Make sure the element is ready to be captured
      if (!downloadQrRef.current) return;
      
      // Make the QR element temporarily visible for capturing
      downloadQrRef.current.style.opacity = 1;
      downloadQrRef.current.style.zIndex = 1000;
      downloadQrRef.current.style.position = 'fixed';
      downloadQrRef.current.style.top = '0';
      downloadQrRef.current.style.left = '0';
      
      // Give the browser time to render
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Capture the QR code
      const dataUrl = await toPng(downloadQrRef.current, {
        cacheBust: true,
        backgroundColor: qrColor,
        width: size + 40,
        height: size + 40,
        pixelRatio: 2 // Higher quality
      });
      
      // Hide the element again
      downloadQrRef.current.style.opacity = 0;
      downloadQrRef.current.style.zIndex = -1000;
      downloadQrRef.current.style.position = 'absolute';

      const pdf = new jsPDF();
      const title = "Generated QR Code";
      const subtitle = `Content: ${value}`;
      const note = "Generated with QR Code Generator";

      pdf.setFontSize(16);
      pdf.text(title, pdf.internal.pageSize.getWidth() / 2, 20, { align: "center" });
      pdf.setFontSize(12);
      pdf.text(subtitle, pdf.internal.pageSize.getWidth() / 2, 30, { align: "center" });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imageWidth = 100;
      const imageHeight = 100;
      const x = (pdfWidth - imageWidth) / 2;
      const y = 50;

      pdf.addImage(dataUrl, "PNG", x, y, imageWidth, imageHeight);
      pdf.setFontSize(10);
      pdf.text(note, pdf.internal.pageSize.getWidth() / 2, y + imageHeight + 20, { align: "center" });
      
      pdf.save(`qr-code-${Date.now()}.pdf`);
      
      setAlert({
        open: true,
        message: "PDF downloaded successfully!",
        severity: "success"
      });
    } catch (error) {
      console.error("PDF download failed:", error);
      setAlert({
        open: true,
        message: "Failed to generate PDF",
        severity: "error"
      });
      
      // Ensure element is hidden if there's an error
      if (downloadQrRef.current) {
        downloadQrRef.current.style.opacity = 0;
        downloadQrRef.current.style.zIndex = -1000;
      }
    } finally {
      // Reset loading state
      setLoading(prev => ({ ...prev, pdf: false }));
    }
  };

  return (
    <div className="modern-qr-generator">
      {/* Animated Background Elements */}
      <div className="floating-elements">
        <div className="floating-qr"></div>
        <div className="floating-qr"></div>
        <div className="floating-qr"></div>
        <div className="floating-qr"></div>
      </div>

      <div className="generator-container">
        {/* Header */}
        <header className="generator-header">
          <h1 className="generator-title">Generate Your QR Code</h1>
          <p className="generator-subtitle">Create professional QR codes instantly</p>
        </header>

        {/* Main Card */}
        <div className="generator-card">
          {/* Input Section */}
          <section className="input-section">
            <div className="input-group">
              <div className="input-wrapper">
                <QrCodeIcon className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter URL, text, or any content..."
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setIsGenerated(false);
                    setSave(false);
                    props.setCount?.(props.count + 1);
                  }}
                  className="modern-input"
                />
              </div>
            </div>
          </section>

          {/* Controls Section */}
          <section className="controls-section">
            <div className="control-group">
              <label className="control-label">
                <PhotoSizeSelectActualIcon fontSize="small" />
                QR Code Size
              </label>
              <select
                className="modern-select"
                value={size}
                onChange={(e) => {
                  setSize(parseInt(e.target.value));
                  setIsGenerated(false);
                  setSave(false);
                }}
              >
                {sizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label className="control-label">
                <PaletteIcon fontSize="small" />
                Background Color
              </label>
              <div className="color-selector">
                <div className="color-preview" onClick={handleColorPickerOpen}>
                  <div className="color-swatch-preview" style={{ backgroundColor: qrColor }}></div>
                  <span className="color-name">
                    {customColors.find(c => c.color === qrColor)?.name || "Custom"}
                  </span>
                  <ArrowDropDownIcon className="color-dropdown-arrow" />
                </div>
                
                <Popover
                  open={colorPickerOpen}
                  anchorEl={colorPickerAnchor}
                  onClose={handleColorPickerClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  className="color-popover"
                >
                  <ClickAwayListener onClickAway={handleColorPickerClose}>
                    <div className="color-grid">
                      {customColors.map(({ color, name }) => (
                        <div
                          key={color}
                          className={`color-grid-item ${qrColor === color ? 'active' : ''}`}
                          onClick={() => handleColorSelect(color)}
                          title={name}
                        >
                          <div 
                            className="color-swatch" 
                            style={{ backgroundColor: color }}
                          >
                            {qrColor === color && <CheckIcon className="color-check-icon" />}
                          </div>
                          <span className="color-grid-label">{name}</span>
                        </div>
                      ))}
                    </div>
                  </ClickAwayListener>
                </Popover>
              </div>
            </div>
          </section>

          {/* Generate Button */}
          <section className="generate-section">
            <button
              onClick={generateQRCode}
              className={`generate-button ${isGenerating ? 'generating' : ''} ${isGenerated ? 'generated' : ''}`}
              disabled={isGenerating}
            >
              <QrCodeIcon />
              {isGenerating ? 'Generating...' : isGenerated ? 'Generated!' : 'Generate QR Code'}
            </button>
          </section>

          {/* QR Display */}
          <section className="qr-display-section">
            <div className={`qr-container ${value && isGenerated ? 'has-qr' : ''}`} ref={qrRef}>
              {value && isGenerated ? (
                <div className="qr-wrapper">
                  <QRCode
                    title="Generated QR Code"
                    value={value}
                    bgColor={qrColor}
                    fgColor="#000000"
                    size={size}
                    style={{
                      height: "auto",
                      maxWidth: "100%",
                      width: "100%",
                    }}
                  />
                </div>
              ) : (
                <div className="qr-placeholder">
                  <QrCodeIcon className="qr-placeholder-icon" />
                  <span>
                    {!value ? "Enter content above to generate QR code" : "Click Generate to create your QR code"}
                  </span>
                </div>
              )}
            </div>

            {/* Hidden QR element for clean downloads */}
            <div 
              ref={downloadQrRef} 
              style={{ 
                position: 'absolute',
                opacity: 0,
                pointerEvents: 'none',
                background: qrColor,
                padding: '20px',
                zIndex: -1000,
                width: `${size + 40}px`,
                height: `${size + 40}px`,
                display: 'block'
              }}
            >
              {value && isGenerated && (
                <QRCode
                  title="QR Code for Download"
                  value={value}
                  bgColor={qrColor}
                  fgColor="#000000"
                  size={size}
                />
              )}
            </div>
          </section>

          {/* Action Buttons */}
          {value && isGenerated && (
            <section className="action-buttons-container">
              <h3 className="actions-title">Save & Share Your QR Code</h3>
              
              <div className="action-buttons">
                <button 
                  onClick={downloadQRCode} 
                  className={`action-button download-btn ${loading.download ? 'loading' : ''}`}
                  title="Download as PNG image"
                  disabled={loading.download}
                >
                  <div className="action-icon">
                    {loading.download ? <div className="button-spinner"></div> : <DownloadIcon />}
                  </div>
                  <div className="action-text">
                    <span className="action-title">{loading.download ? 'Downloading...' : 'Download'}</span>
                    <span className="action-subtitle">Save as PNG</span>
                  </div>
                </button>
                
                {props.user && (
                  <>
                    <button 
                      onClick={saveQrCode} 
                      className={`action-button save-btn ${save ? 'saved' : ''} ${loading.save ? 'loading' : ''}`}
                      title="Save to your account"
                      disabled={loading.save || save}
                    >
                      <div className="action-icon">
                        {loading.save ? <div className="button-spinner"></div> : 
                         save ? <SaveIcon /> : <SaveOutlinedIcon />}
                      </div>
                      <div className="action-text">
                        <span className="action-title">
                          {loading.save ? 'Saving...' : save ? 'Saved' : 'Save'}
                        </span>
                        <span className="action-subtitle">To your account</span>
                      </div>
                    </button>
                    
                    <button 
                      onClick={shareQrCode} 
                      className={`action-button share-btn ${loading.share ? 'loading' : ''}`}
                      title="Share with others"
                      disabled={loading.share}
                    >
                      <div className="action-icon">
                        {loading.share ? <div className="button-spinner"></div> : <ShareIcon />}
                      </div>
                      <div className="action-text">
                        <span className="action-title">{loading.share ? 'Sharing...' : 'Share'}</span>
                        <span className="action-subtitle">With others</span>
                      </div>
                    </button>
                    
                    <button 
                      onClick={downloadAsPdf} 
                      className={`action-button pdf-btn ${loading.pdf ? 'loading' : ''}`}
                      title="Download as PDF document"
                      disabled={loading.pdf}
                    >
                      <div className="action-icon">
                        {loading.pdf ? <div className="button-spinner"></div> : <PictureAsPdfIcon />}
                      </div>
                      <div className="action-text">
                        <span className="action-title">{loading.pdf ? 'Creating PDF...' : 'PDF'}</span>
                        <span className="action-subtitle">Document format</span>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </section>
          )}

          {/* Loading Spinner */}
          <div className={`modern-spinner ${isGenerating ? 'active' : ''}`}></div>
        </div>
      </div>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={alert.severity}
          sx={{ width: "100%" }}
          icon={<CheckIcon fontSize="inherit" />}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Genarator;
