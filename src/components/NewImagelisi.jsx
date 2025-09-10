import React, { useState, useEffect } from 'react';
import {
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Tooltip,
  Button,
  useTheme,
  useMediaQuery,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Fade,
  Zoom,
  Chip
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Delete,
  DeleteSweep,
  FilterList,
  Download,
  Share,
  InfoOutlined,
  QrCode2
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import './qrGallery.css';

const StyledImageList = styled(ImageList)(({ theme }) => ({
  gap: theme.spacing(2.5),
  padding: theme.spacing(2),
  '& .MuiImageListItem-root': {
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    backgroundColor: '#fff',
    border: '1px solid rgba(0,0,0,0.05)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 24px rgba(106, 17, 203, 0.15)',
    },
  },
}));

const QRCodeGallery = ({ userId, refresh, count }) => {
  // Move all hooks to the top level
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumUp = useMediaQuery(theme.breakpoints.up('md'));
  
  // State hooks
  const [qrCodes, setQrCodes] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calculate columns based on breakpoints
  const getColumnCount = () => {
    if (isMobile) return 2;
    if (isMediumUp) return 4;
    return 3;
  };

  const cols = getColumnCount();

  const fetchQrCodes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/profile-data/user-qr-codes/${userId}`
      );
      
      // Add slight delay for animation purposes
      setTimeout(() => {
        setQrCodes(response.data);
        setLoading(false);
      }, 400);
    } catch (error) {
      console.error('Failed to fetch QR codes:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrCodes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, userId]);

  const handleDeleteConfirm = async () => {
    if (selectedCode) {
      await deleteQrCode(selectedCode);
    } else {
      await deleteAllQrCodes();
    }
    setDeleteDialogOpen(false);
    setSelectedCode(null);
  };

  const deleteQrCode = async (qrCodeId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/profile-data/deleteqr/${qrCodeId}`
      );
      setQrCodes((prev) => prev.filter((code) => code._id !== qrCodeId));
      refresh?.();
    } catch (error) {
      console.error('Failed to delete QR code:', error);
    }
  };

  const deleteAllQrCodes = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/profile-data/deleteall/${userId}`
      );
      setQrCodes([]);
      refresh?.();
    } catch (error) {
      console.error('Failed to delete all QR codes:', error);
    }
  };

  const toggleFavorite = async (qrCodeId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/profile-data/favorite/${qrCodeId}`,{
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setQrCodes((prev) =>
        prev.map((code) =>
          code._id === qrCodeId
            ? { ...code, isFavorite: response.data.qrCode.isFavorite }
            : code
        )
      );
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const displayedCodes = showFavorites
    ? qrCodes.filter((code) => code.isFavorite)
    : qrCodes;

  if (loading) {
    return (
      <Box className="gallery-loading">
        <CircularProgress size={40} className="loading-spinner" />
        <Typography variant="body1" color="textSecondary">
          Loading your QR codes...
        </Typography>
      </Box>
    );
  }
  
  if (qrCodes.length === 0) {
    return (
      <Box className="empty-state">
        <img
          className="empty-state-image"
          src="https://github.com/Thimira20/qr-code2/blob/master/public/images/Screenshot_26-1-2025_41744_assets-global.website-files.com.jpeg?raw=true"
          alt="No QR codes"
        />
        <Typography variant="h6" className="empty-state-title">
          No QR Codes Found
        </Typography>
        <Typography variant="body1" className="empty-state-text">
          Generate QR codes to see them displayed here. Your created codes will be saved automatically.
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<QrCode2 />}
          sx={{
            background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
            borderRadius: '20px',
            padding: '8px 20px',
            textTransform: 'none',
            fontWeight: 500
          }}
          href="/qr-generator"
        >
          Create New QR Code
        </Button>
      </Box>
    );
  }

  return (
    <div className="gallery-container">
      <Box className="gallery-actions">
        <div className="gallery-actions-left">
          <Button
            className="filter-button"
            startIcon={<FilterList />}
            onClick={() => setShowFavorites(!showFavorites)}
          >
            {showFavorites ? 'Show All' : 'Show Favorites'}
          </Button>
          
          {qrCodes.length > 0 && (
            <Chip 
              label={`${displayedCodes.length} QR Code${displayedCodes.length !== 1 ? 's' : ''}`} 
              size="small" 
              sx={{ 
                background: 'rgba(106, 17, 203, 0.05)',
                border: '1px solid rgba(106, 17, 203, 0.1)',
                color: '#6a11cb'
              }} 
            />
          )}
        </div>
        
        <Button
          className="delete-button"
          startIcon={<DeleteSweep />}
          onClick={() => {
            setSelectedCode(null);
            setDeleteDialogOpen(true);
          }}
          disabled={qrCodes.length === 0}
        >
          Delete All
        </Button>
      </Box>

      <Fade in={!loading} timeout={800}>
        <StyledImageList cols={cols} gap={16}>
          {displayedCodes.map((item, index) => (
            <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }} key={item._id}>
              <ImageListItem className="qr-item">
                <div className="qr-image-container">
                  <img
                    src={`${item.qrImageUrl}?w=248&fit=crop&auto=format`}
                    alt={item.qrText}
                    loading="lazy"
                    className="qr-image"
                  />
                </div>
                <ImageListItemBar
                  className="qr-item-bar"
                  title={
                    <Typography className="qr-item-title">
                      {item.qrText}
                    </Typography>
                  }
                  actionIcon={
                    <Box>
                      <Tooltip title="Download QR Code">
                        <IconButton 
                          className="qr-action-button"
                          onClick={() => window.open(item.qrImageUrl, '_blank')}
                        >
                          <Download fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                        <IconButton
                          className={`qr-action-button ${item.isFavorite ? 'favorite-active' : ''}`}
                          onClick={() => toggleFavorite(item._id)}
                        >
                          {item.isFavorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          className="qr-action-button"
                          onClick={() => {
                            setSelectedCode(item._id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />
              </ImageListItem>
            </Zoom>
          ))}
        </StyledImageList>
      </Fade>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedCode(null);
        }}
        PaperProps={{
          className: 'dialog-paper'
        }}
        TransitionComponent={Zoom}
      >
        <DialogTitle className="dialog-title">
          {selectedCode ? 'Delete QR Code' : 'Delete All QR Codes'}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Typography variant="body1" gutterBottom>
            {selectedCode
              ? 'Are you sure you want to delete this QR code?'
              : 'Are you sure you want to delete all QR codes? This action cannot be undone.'}
          </Typography>
          
          {!selectedCode && (
            <Typography 
              variant="body2" 
              color="error" 
              sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: 'rgba(239, 68, 68, 0.05)',
                borderRadius: 1,
                border: '1px solid rgba(239, 68, 68, 0.1)'
              }}
            >
              This will permanently delete all of your QR codes and cannot be recovered.
            </Typography>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setSelectedCode(null);
            }}
            sx={{ 
              color: 'text.secondary',
              borderRadius: '20px'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained"
            color="error"
            sx={{ 
              borderRadius: '20px',
              textTransform: 'none'
            }}
          >
            {selectedCode ? 'Delete' : 'Delete All'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QRCodeGallery;