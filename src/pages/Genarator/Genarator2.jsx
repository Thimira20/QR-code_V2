import React, { useRef, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Snackbar,
  Alert,
  useTheme,
  styled,
  useMediaQuery,
  Divider,
  Collapse,
  Fade
} from '@mui/material';
import {
  QrCode as QrCodeIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
  SaveOutlined as SaveOutlinedIcon,
  Share as ShareIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Palette as PaletteIcon,
  ExpandMore as ExpandMoreIcon,
  LoginOutlined as LoginOutlinedIcon
} from '@mui/icons-material';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

const ColorButton = styled(IconButton)(({ theme, color, selected }) => ({
  width: 28,
  height: 28,
  backgroundColor: color,
  margin: theme.spacing(0.5),
  border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  '&:hover': {
    backgroundColor: color,
    opacity: 0.8,
  }
}));

const QrContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 280,
  backgroundColor: theme.palette.grey[50],
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    minHeight: 220,
    padding: theme.spacing(1),
  }
}));

function QrGenerator({ user, refresh }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [value, setValue] = useState('');
  const [size, setSize] = useState(isMobile ? 200 : 300);
  const [qrColor, setQrColor] = useState('#ffffff');
  const [save, setSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const qrRef = useRef();

  const customColors = [
    '#ffffff', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#fa2dfa', '#00FFFF', '#800080', '#FFA500'
  ];

  const sizeOptions = isMobile ? [
    { value: 100, label: '100x100' },
    { value: 150, label: '150x150' },
    { value: 200, label: '200x200' },
  ] : [
    { value: 200, label: '200x200' },
    { value: 300, label: '300x300' },
    { value: 400, label: '400x400' },
    { value: 500, label: '500x500' }
  ];

  const handleAction = async (type) => {
    if (!value) {
      setAlert({
        open: true,
        message: 'Please enter a URL first',
        severity: 'warning'
      });
      return;
    }

    if (!user && (type === 'save' || type === 'share' || type === 'pdf')) {
      setAlert({
        open: true,
        message: 'Please login to use this feature',
        severity: 'info'
      });
      return;
    }

    setLoading(true);
    try {
      const dataUrl = await toPng(qrRef.current);
      
      switch (type) {
        case 'save':
          setSave(true);
          setAlert({
            open: true,
            message: 'QR Code saved successfully!',
            severity: 'success'
          });
          refresh?.();
          break;

        case 'download':
          const link = document.createElement('a');
          link.download = `qr-code-${new Date().getTime()}.png`;
          link.href = dataUrl;
          link.click();
          setAlert({
            open: true,
            message: 'QR Code downloaded successfully!',
            severity: 'success'
          });
          break;

        case 'pdf':
          const pdf = new jsPDF();
          const imgWidth = 100;
          const imgHeight = 100;
          pdf.setFontSize(16);
          pdf.text('Your QR Code', 105, 20, { align: 'center' });
          pdf.setFontSize(10);
          pdf.text(`URL: ${value}`, 105, 30, { align: 'center' });
          pdf.addImage(dataUrl, 'PNG', 55, 40, imgWidth, imgHeight);
          pdf.save(`qr-code-${new Date().getTime()}.pdf`);
          setAlert({
            open: true,
            message: 'PDF downloaded successfully!',
            severity: 'success'
          });
          break;

        case 'share':
          if (navigator.share) {
            await navigator.share({
              title: 'QR Code',
              text: 'Check out this QR code!',
              url: dataUrl
            });
            setAlert({
              open: true,
              message: 'Shared successfully!',
              severity: 'success'
            });
          } else {
            setAlert({
              open: true,
              message: 'Sharing not supported on this device',
              severity: 'warning'
            });
          }
          break;
      }
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to ${type} QR code`,
        severity: 'error'
      });
    }
    setLoading(false);
  };

  return (
    <Card elevation={3}>
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Typography variant="h5" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          fontSize: isMobile ? '1.25rem' : '1.5rem' 
        }}>
          <QrCodeIcon color="primary" />
          QR Code Generator
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Enter URL"
            variant="outlined"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setSave(false);
            }}
            placeholder="https://example.com"
            size={isMobile ? "small" : "medium"}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Stack direction={isMobile ? "column" : "row"} spacing={2}>
            <Box sx={{ minWidth: 120 }}>
              <Typography variant="subtitle2" gutterBottom>
                QR Code Size
              </Typography>
              <Select
                fullWidth
                value={size}
                onChange={(e) => setSize(e.target.value)}
                size={isMobile ? "small" : "medium"}
              >
                {sizeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="subtitle2" 
                gutterBottom 
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <PaletteIcon fontSize="small" />
                Background Color
                <IconButton 
                  size="small" 
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Typography>
              <Collapse in={showColorPicker}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', maxWidth: isMobile ? 280 : '100%' }}>
                  {customColors.map((color) => (
                    <Tooltip key={color} title={color}>
                      <ColorButton
                        color={color}
                        selected={color === qrColor}
                        onClick={() => setQrColor(color)}
                        size="small"
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Collapse>
            </Box>
          </Stack>
        </Box>

        <Fade in={true}>
          <QrContainer ref={qrRef}>
            {value ? (
              <QRCode
                value={value}
                size={size}
                bgColor={qrColor}
                fgColor="#000000"
                level="H"
              />
            ) : (
              <Typography color="textSecondary" align="center">
                Enter a URL to generate QR code
              </Typography>
            )}
          </QrContainer>
        </Fade>

        <Divider sx={{ my: 2 }} />

        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={isMobile ? 1 : 2}
          sx={{ mt: 2 }}
        >
          <Button
            fullWidth={isMobile}
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => handleAction('download')}
            disabled={!value || loading}
            size={isMobile ? "medium" : "large"}
          >
            Download PNG
          </Button>

          {user ? (
            <>
              <Button
                fullWidth={isMobile}
                variant="contained"
                startIcon={save ? <SaveIcon /> : <SaveOutlinedIcon />}
                onClick={() => handleAction('save')}
                disabled={!value || loading}
                size={isMobile ? "medium" : "large"}
              >
                {save ? 'Saved' : 'Save'}
              </Button>

              <Button
                fullWidth={isMobile}
                variant="contained"
                startIcon={<PictureAsPdfIcon />}
                onClick={() => handleAction('pdf')}
                disabled={!value || loading}
                size={isMobile ? "medium" : "large"}
              >
                PDF
              </Button>

              <Button
                fullWidth={isMobile}
                variant="contained"
                startIcon={<ShareIcon />}
                onClick={() => handleAction('share')}
                disabled={!value || loading}
                size={isMobile ? "medium" : "large"}
              >
                Share
              </Button>
            </>
          ) : (
            <Button
              fullWidth={isMobile}
              variant="outlined"
              startIcon={<LoginOutlinedIcon />}
              color="primary"
              size={isMobile ? "medium" : "large"}
              onClick={() => {
                setAlert({
                  open: true,
                  message: 'Please login to access more features',
                  severity: 'info'
                });
              }}
            >
              Login for More Features
            </Button>
          )}
        </Stack>

        <Snackbar
          open={alert.open}
          autoHideDuration={3000}
          onClose={() => setAlert({ ...alert, open: false })}
          anchorOrigin={{ 
            vertical: isMobile ? 'bottom' : 'top', 
            horizontal: 'center' 
          }}
        >
          <Alert
            onClose={() => setAlert({ ...alert, open: false })}
            severity={alert.severity}
            variant="filled"
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}

export default QrGenerator;