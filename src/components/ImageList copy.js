import React, { useEffect, useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import StarIcon from '@mui/icons-material/Star';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import axios from "axios";

export default function TitlebarBelowImageList({ userId, count }) {
  const [qrCodes, setQrCodes] = useState([]);
  const [deleteAll, setDeleteAll] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [dimensions, setDimensions] = useState({
      height: 350,
      width: 250,
    });
    const favoriteQrCodes = qrCodes.filter((code) => code.isFavorite);

    const showFav = () => {
      setShowFavorites(!showFavorites);
    }

  const handleResize = async () => {
    if (window.innerWidth <= 650) {
      setDimensions({
        height: 400,
        width: 300,
      });
    } else if (window.innerWidth <= 450) {
      setDimensions({
        height: 300,
        width: 200,
      });
    }
    return dimensions;
  };

  const deleteIcon = () => {
    setDeleteAll(!deleteAll);
  }
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
  useEffect(() => {
  

    fetchQrCodes();
  }, [count]);

  const deleteQrCode = async (qrCodeID) => {
    try {
      await axios.delete(`http://localhost:3000/api/profile-data/deleteqr/${qrCodeID}`);
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
          code._id === qrCodeID ? { ...code, isFavorite: response.data.qrCode.isFavorite } : code
        )
      );
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const deleteAllQrCodes = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/profile-data/deleteall/${userId}`);
      setQrCodes([]);
      deleteIcon();
    } catch (error) {
      console.error("Failed to delete all QR codes:", error);
    }
  };

  return (
    <ImageList sx={{ width: 500, height: 450 }}>
      {qrCodes.map((item) => (
        <ImageListItem key={item._id}>
          <img
            src={`${item.qrImageUrl}?w=248&fit=crop&auto=format`}
            alt={item.qrText}
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
                  {item.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton onClick={() => deleteQrCode(item._id)} sx={{ color: "white" }}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          />
        </ImageListItem>
      ))}
     <button onClick={async () => { 
        await showFav();
        if (showFavorites) {
          setQrCodes(favoriteQrCodes); 
        } else {
          fetchQrCodes();
        }
        
      }}>
        {showFavorites ? "show favourite" : "show all "}
      </button>
      {/* <button onClick={() => setQrCodes(favoriteQrCodes)}>Show Favorites</button> */}
      <button onClick={deleteAllQrCodes}>{deleteAll ? <DeleteSweepIcon/>:<DeleteSweepOutlinedIcon/>}</button>
    </ImageList>
  );
}
