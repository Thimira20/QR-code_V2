

import React, { useEffect, useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import axios from "axios";

export default function TitlebarBelowImageList({ userId, count }) {
  const [qrCodes, setQrCodes] = useState([]);
  const [dimensions, setDimensions] = useState({
    height: 350,
    width: 250,
  });
  // useEffect(() => {
  //   const handleResize = async () => {
  //     if (window.innerWidth <= 650) {
  //       setDimensions({
  //         height: 400,
  //         width: 300,
  //       });
  //     } else if (window.innerWidth <= 450) {
  //       setDimensions({
  //         height: 300,
  //         width: 200,
  //       });
  //     }
  //   };
  //   window.addEventListener("resize", handleResize);
  //   handleResize();
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

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

  useEffect(() => {
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

    fetchQrCodes();
  }, [count]);

  return (
    <ImageList sx={{ width: dimensions.width, height: dimensions.height }}>
      {qrCodes.map((item) => (
        <ImageListItem key={item._id}>
          <img
            src={`${item.qrImageUrl}?w=248&fit=crop&auto=format`}
            alt={item.qrText}
            loading="lazy"
          />
          <ImageListItemBar title={item.qrText} position="below" />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
