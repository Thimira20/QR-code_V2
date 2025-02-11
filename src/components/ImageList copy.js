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
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default function TitlebarBelowImageList({ userId, count,refresh }) {
  const [qrCodes, setQrCodes] = useState([]);
  const [deleteAll, setDeleteAll] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
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
  const handleDeleteConfirm = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleDeleteCancel = () => {
    setIsModalOpen(false); // Close the modal
  };

  const deleteIcon = () => {
    setDeleteAll(!deleteAll);
  }
  const fetchQrCodes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/profile-data/user-qr-codes/${userId}`
      );
      setQrCodes(response.data);
      console.log(qrCodes.length);
      
      
    } catch (error) {
      console.error("Failed to fetch QR codes:", error);
    }
  };
  useEffect(() => {
  

    fetchQrCodes();
    handleResize();
  }, [count]);

  const deleteQrCode = async (qrCodeID) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/profile-data/deleteqr/${qrCodeID}`);
      setQrCodes((prev) => prev.filter((code) => code._id !== qrCodeID));
      
    } catch (error) {
      console.error("Failed to delete QR code:", error);
    }
  };

  const toggleFavorite = async (qrCodeID) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/profile-data/favorite/${qrCodeID}`
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
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/profile-data/deleteall/${userId}`);
      setQrCodes([]);
      deleteIcon();
      setIsModalOpen(false);
      this.props.setCount(count + 1);
      
    } catch (error) {
      console.error("Failed to delete all QR codes:", error);
    }
  };

  return (
    <><div
      style={{
        maxHeight: "500px", // Set a maximum height for the container
        overflowY: "auto", // Enable vertical scrolling
        overflowX: "hidden", // Prevent horizontal scrolling
      }}
    >
      <ImageList
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(auto-fit, minmax(100px, 1fr))", // 100px wide for small screens
            sm: "repeat(auto-fit, minmax(150px, 1fr))", // 150px wide for tablets
            md: "repeat(auto-fit, minmax(150px, 1fr))", // Keep columns consistent
            lg: "repeat(auto-fit, minmax(200px, 1fr))", // Add more columns for large screens
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
              maxWidth: "250px", // Prevent image from growing too large
              justifySelf: "center", // Center align items in grid cells
            }}
          >
            <img
              src={`${item.qrImageUrl}?w=248&fit=crop&auto=format`}
              alt={item.qrText}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "250px", // Prevent height from exceeding 200px
                objectFit: "contain", // Maintain aspect ratio
              }}
              loading="lazy" />
            <ImageListItemBar
              title={item.qrText}
              position="below"
              actionIcon={<>
                <IconButton
                  onClick={() => toggleFavorite(item._id)}
                  sx={{ color: item.isFavorite ? "red" : "white" }}
                >
                  {item.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton onClick={() => deleteQrCode(item._id)} sx={{ color: "white" }}>
                  <DeleteIcon />
                </IconButton>
              </>} />
          </ImageListItem>
        ))}

      </ImageList>

    </div>
    <button onClick={async () => {
      await showFav();
      if (showFavorites) {
        setQrCodes(favoriteQrCodes);
      } else {
        fetchQrCodes();
      }

    } }>
        {showFavorites ? "show favourite" : "show all "}
      </button>
      <button onClick={ async () => {
       
       console.log(qrCodes.length)
      if (  qrCodes.length == 0) {
        setDescription("There are no QR codes to delete.");
        //handleDeleteConfirm();
        setIsModalOpen(true);
      } else {
        setDescription("Are you sure you want to delete all QR codes? This action cannot be undone.");
        handleDeleteConfirm();
      }

    } }>{deleteAll ? <DeleteSweepIcon /> : <DeleteSweepOutlinedIcon />}</button>
    <DeleteConfirmationModal
            isOpen={isModalOpen}
            onClose={handleDeleteCancel}
            onConfirm={deleteAllQrCodes}
            title="Confirm Deletion"
            description={description}
          />
   </>
    
  );
}
{/* <ImageList sx={{ width: 500, height: 450 }}>
      {qrCodes.map((item) => (
        // <ImageListItem key={item._id}>
        //   <img
        //     src={`${item.qrImageUrl}?w=248&fit=crop&auto=format`}
        //     alt={item.qrText}
        //     loading="lazy"
        //   />
        //   <ImageListItemBar
        //     title={item.qrText}
        //     position="below"
        //     actionIcon={
        //       <>
        //         <IconButton
        //           onClick={() => toggleFavorite(item._id)}
        //           sx={{ color: item.isFavorite ? "red" : "white" }}
        //         >
        //           {item.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        //         </IconButton>
        //         <IconButton onClick={() => deleteQrCode(item._id)} sx={{ color: "white" }}>
        //           <DeleteIcon />
        //         </IconButton>
        //       </>
        //     }
        //   />
        // </ImageListItem>
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
     // <button onClick={deleteAllQrCodes}>{deleteAll ? <DeleteSweepIcon/>:<DeleteSweepOutlinedIcon/>}</button>
    //</ImageList> */}