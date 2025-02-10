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
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Delete,
  DeleteSweep,
  FilterList,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledImageList = styled(ImageList)(({ theme }) => ({
  gap: theme.spacing(2),
  padding: theme.spacing(1),
  '& .MuiImageListItem-root': {
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
}));

const ActionBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(2),
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

  // Calculate columns based on breakpoints
  const getColumnCount = () => {
    if (isMobile) return 2;
    if (isMediumUp) return 4;
    return 3;
  };

  const cols = getColumnCount();

  useEffect(() => {
    fetchQrCodes();
  }, [count, userId]);

  const fetchQrCodes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/profile-data/user-qr-codes/${userId}`
      );
      setQrCodes(response.data);
    } catch (error) {
      console.error('Failed to fetch QR codes:', error);
    }
  };

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
        `http://localhost:3000/api/profile-data/deleteqr/${qrCodeId}`
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
        `http://localhost:3000/api/profile-data/deleteall/${userId}`
      );
      setQrCodes([]);
      refresh?.();
    } catch (error) {
      console.error('Failed to delete all QR codes:', error);
    }
  };

  const toggleFavorite = async (qrCodeId) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/profile-data/favorite/${qrCodeId}`
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

  if (qrCodes.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <img
          src="https://github.com/Thimira20/qr-code2/blob/master/public/images/Screenshot_26-1-2025_41744_assets-global.website-files.com.jpeg?raw=true"
          alt="No QR codes"
          style={{ maxWidth: '300px', width: '100%', borderRadius: '20px' }}
        />
        <Typography variant="h6" color="textSecondary" mt={2}>
          Save Your QR Codes
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <ActionBar>
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? 'Show All' : 'Show Favorites'}
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteSweep />}
          onClick={() => {
            setSelectedCode(null);
            setDeleteDialogOpen(true);
          }}
        >
          Delete All
        </Button>
      </ActionBar>

      <StyledImageList cols={cols} gap={16}>
        {displayedCodes.map((item) => (
          <ImageListItem key={item._id}>
            <img
              src={`${item.qrImageUrl}?w=248&fit=crop&auto=format`}
              alt={item.qrText}
              loading="lazy"
              style={{ objectFit: 'contain', aspectRatio: '1/1' }}
            />
            <ImageListItemBar
              title={item.qrText}
              actionIcon={
                <Box>
                  <Tooltip title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                    <IconButton
                      onClick={() => toggleFavorite(item._id)}
                      sx={{ color: item.isFavorite ? 'error.main' : 'white' }}
                    >
                      {item.isFavorite ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => {
                        setSelectedCode(item._id);
                        setDeleteDialogOpen(true);
                      }}
                      sx={{ color: 'white' }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            />
          </ImageListItem>
        ))}
      </StyledImageList>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedCode(null);
        }}
      >
        <DialogTitle>
          {selectedCode ? 'Delete QR Code' : 'Delete All QR Codes'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {selectedCode
              ? 'Are you sure you want to delete this QR code?'
              : 'Are you sure you want to delete all QR codes? This action cannot be undone.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setSelectedCode(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QRCodeGallery;