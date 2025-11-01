import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://in.images.search.yahoo.com/images/view;_ylt=AwrPplAaJQZpeW0gP0y9HAx.;_ylu=c2VjA3NyBHNsawNpbWcEb2lkAzIwNDliYThmZjk0ZWFhZGUyZDQ3YjIxNTE3YzAwNjNmBGdwb3MDNARpdANiaW5n?back=https%3A%2F%2Fin.images.search.yahoo.com%2Fsearch%2Fimages%3Fp%3Dranting%26type%3DE210IN714G0-E210IN714G0%26fr%3Dmcafee%26fr2%3Dpiv-web%26tab%3Dorganic%26ri%3D4&w=1200&h=675&imgurl=asset-2.tstatic.net%2Fstyle%2Ffoto%2Fbank%2Fimages%2FViral-benda-mirip-ranting-pohon-tapi-bisa-berjalan-ternyata-belalang-ranting-2.jpg&rurl=https%3A%2F%2Fstyle.tribunnews.com%2F2023%2F09%2F04%2Fviral-ranting-punya-kaki-panjang-dan-bisa-berjalan-ternyata-binatang-unik&size=33KB&p=ranting&oid=2049ba8ff94eaade2d47b21517c0063f&fr2=piv-web&fr=mcafee&tt=VIRAL+Ranting+Punya+Kaki+Panjang+dan+Bisa+Berjalan%2C+Ternyata+Binatang+...&b=0&ni=21&no=4&ts=&tab=organic&sigr=iZVf6CVchqHp&sigb=JPLbK01hjOMC&sigi=_TYIzbA7NHOm&sigt=N2tYRI1dCXNi&.crumb=0uyrzRiKT6L&fr=mcafee&fr2=piv-web&type=E210IN714G0-E210IN714G0')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        px: 3,
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: "bold",
          mb: 2,
          textShadow: "2px 2px 10px rgba(0,0,0,0.4)",
        }}
      >
        Welcome to <span style={{ color: "#90caf9" }}>Ranting App</span>
      </Typography>

      <Typography
        variant="h6"
        sx={{
          maxWidth: "600px",
          mb: 4,
          lineHeight: 1.6,
          color: "#f1f1f1",
        }}
      >
        Share your thoughts, express your ideas, and connect with others.
        <br />
        Your voice deserves to be heard.
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={() => navigate("/signup")}
        sx={{
          backgroundColor: "#1976d2",
          fontSize: "1.1rem",
          fontWeight: "bold",
          px: 4,
          py: 1.2,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          "&:hover": {
            backgroundColor: "#115293",
            transform: "scale(1.05)",
            transition: "0.3s",
          },
        }}
      >
        Get Started 🚀
      </Button>
    </Box>
  );
};

export default Welcome;
