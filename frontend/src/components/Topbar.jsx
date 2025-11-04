import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        bgcolor: "#1976d2",
        backdropFilter: "blur(6px)",
      }}
    >
      <Toolbar>
        {/* Left side title */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: "0.5px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/todayplan")}
        >
          Progress App
        </Typography>

        {/* Right side menu icon */}
        <Box>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            Menu
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={() => handleNavigation("/todayplan")}>
              Today’s Plan
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/allplans")}>
              All Plans
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/createpost")}>
              Create Plan
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/search")}>
              Search Profiles
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/following")}>
              People You Follow
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/profile")}>
              My Profile
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
