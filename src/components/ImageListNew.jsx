import React, { useEffect, useState } from "react";
import {
  Backdrop,
  CircularProgress,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import axios from "axios";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default function TitlebarBelowImageList({ userId, count, refresh }) {
  const [qrCodes, setQrCodes] = useState([]);
  const [deleteAll, setDeleteAll] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Backdrop state
  const [description, setDescription] = useState("");

  const favoriteQrCodes = qrCodes.filter((code) => code.isFavorite);

  const fetchQrCodes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/profile-data/user-qr-codes/${userId}`
      );
      setQrCodes(response.data);
    } catch (error) {
      console.error("Failed to fetch QR codes:", error);
    }
  };

  const deleteQrCode = async (qrCodeID) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/profile-data/deleteqr/${qrCodeID}`
      );
      setQrCodes((prev) => prev.filter((code) => code._id !== qrCodeID));
    } catch (error) {
      console.error("Failed to delete QR code:", error);
    }
  };

  const toggleFavorite = async (qrCodeID) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/profile-data/favorite/${qrCodeID}`
      );
      setQrCodes((prev) =>
        prev.map((code) =>
          code._id === qrCodeID
            ? { ...code, isFavorite: response.data.qrCode.isFavorite }
            : code
        )
      );
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const deleteAllQrCodes = async () => {
    try {
      setIsDeleting(true); // Show backdrop
      await axios.delete(
        `http://localhost:3000/api/profile-data/deleteall/${userId}`
      );
      setQrCodes([]);
      setDeleteAll(false);
      setIsModalOpen(false);
      refresh(); // Refresh after deletion
    } catch (error) {
      console.error("Failed to delete all QR codes:", error);
    } finally {
      setIsDeleting(false); // Hide backdrop
    }
  };

  useEffect(() => {
    fetchQrCodes();
  }, [count]);

  return (
    <>
      <div
        style={{
          maxHeight: "500px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {qrCodes.length > 0 ? (
          <ImageList
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(auto-fit, minmax(100px, 1fr))",
                sm: "repeat(auto-fit, minmax(150px, 1fr))",
                md: "repeat(auto-fit, minmax(150px, 1fr))",
                lg: "repeat(auto-fit, minmax(200px, 1fr))",
              },
              gap: 16,
              width: "100%",
            }}
          >
            {qrCodes.map((item) => (
              <ImageListItem
                key={item._id}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "250px",
                  justifySelf: "center",
                }}
              >
                <img
                  src={`${item.qrImageUrl}?w=248&fit=crop&auto=format`}
                  alt={item.qrText}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "250px",
                    objectFit: "contain",
                  }}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.qrText}
                  position="below"
                  actionIcon={
                    <>
                      <IconButton
                        onClick={() => toggleFavorite(item._id)}
                        sx={{ color: item.isFavorite ? "red" : "white" }}
                      >
                        {item.isFavorite ? (
                          <FavoriteIcon />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={() => deleteQrCode(item._id)}
                        sx={{ color: "white" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        ) : (
          <div style={{ textAlign: "center", padding: "20px", }}>
            <img
              src="https://github.com/Thimira20/qr-code2/blob/master/public/images/Screenshot_26-1-2025_41744_assets-global.website-files.com.jpeg?raw=true"
              alt="No QR codes"
              style={{ maxWidth: "300px", width: "100%", height: "auto", borderRadius: "20px" }}
            />
            <p >Save Your QR codes</p>
          </div>
        )}
      </div>
      <button
        onClick={() => {
          setShowFavorites(!showFavorites);
          if (showFavorites) {
            setQrCodes(favoriteQrCodes);
          } else {
            fetchQrCodes();
          }
        }}
      >
        {showFavorites ? "Show All" : "Show Favorites"}
      </button>
      <button
        onClick={() => {
          if (qrCodes.length === 0) {
            setDescription("There are no QR codes to delete.");
            setIsModalOpen(true);
          } else {
            setDescription(
              "Are you sure you want to delete all QR codes? This action cannot be undone."
            );
            setIsModalOpen(true);
          }
        }}
      >
        {deleteAll ? <DeleteSweepIcon /> : <DeleteSweepOutlinedIcon />}
      </button>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={deleteAllQrCodes}
        title="Confirm Deletion"
        description={description}
      />
      {/* Backdrop with Spinner */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isDeleting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
