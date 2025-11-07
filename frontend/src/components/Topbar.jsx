import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Divider, // Added
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Menu as MenuIcon,
  Home,
  LayoutGrid,
  FilePlus,
  Search,
  Users,
  User,
  LogOut
} from 'lucide-react';

const TopBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  // Helper for menu items with icons
  const NavMenuItem = ({ path, icon, text }) => (
    <MenuItem
      onClick={() => handleNavigation(path)}
      sx={{
        paddingY: 1.25, // A bit more spacing
        minWidth: 220,  // Give it some width
        gap: 1.5,       // Space between icon and text
        '&:hover': {
          // 🎨 Subtle hover effect matching the theme
          backgroundColor: 'rgba(99, 70, 26, 0.08)'
        }
      }}
    >
      {icon}
      <Typography variant="body1">{text}</Typography>
    </MenuItem>
  );

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        // 🎨 Reverted to the golden theme as requested
        bgcolor: "#eee8aa",
        backdropFilter: "blur(6px)", // Kept a subtle blur
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
            color: "#63461aff" // 🎨 Golden theme text color
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
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ color: "#63461aff" }} // 🎨 Golden theme icon color
          >
            <MenuIcon size={30} />
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
            // 🎨 Styled the dropdown menu
            PaperProps={{
              elevation: 6,
              sx: {
                // 🎨 Matching paper color
                bgcolor: "#fffbeF", // A slightly lighter golden/cream
                color: "#63461aff", // Matching text color
                borderRadius: 2,
                marginTop: 1,
                border: "1px solid #e0d9a4", // Border for definition
              }
            }}
          >
            {/* 🎨 Added icons and helper component for style */}
            <NavMenuItem path="/todayplan" icon={<Home size={20} />} text="Today's Plan" />
            <NavMenuItem path="/allplans" icon={<LayoutGrid size={20} />} text="All Plans" />
            <NavMenuItem path="/createpost" icon={<FilePlus size={20} />} text="Create Plan" />
            <Divider sx={{ borderColor: 'rgba(99, 70, 26, 0.12)', marginY: 0.5 }} />
            <NavMenuItem path="/search" icon={<Search size={20} />} text="Search Profiles" />
            <NavMenuItem path="/following" icon={<Users size={20} />} text="People You Follow" />
            <NavMenuItem path="/profile" icon={<User size={20} />} text="My Profile" />
            <Divider sx={{ borderColor: 'rgba(99, 70, 26, 0.12)', marginY: 0.5 }} />
            <NavMenuItem path="/login" icon={<LogOut size={20} />} text="Logout" />
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;