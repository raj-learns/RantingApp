import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TopBar from "../components/Topbar";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const FollowingProfiles = () => {
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // 1️⃣ Fetch current user’s profile
        const profileRes = await fetch("https://rantingapp.onrender.com/api/profile", {
          headers: { token },
        });
        const profileData = await profileRes.json();
        if (!profileRes.ok || !profileData.user) {
          setLoading(false);
          return;
        }

        const followingIds = profileData.user.following || [];
        if (followingIds.length === 0) {
          setFollowingUsers([]);
          setLoading(false);
          return;
        }

        // 2️⃣ Fetch details of each following user in parallel
        const userPromises = followingIds.map((id) =>
          fetch(`https://rantingapp.onrender.com/api/user/${id}`, {
            headers: { token },
          }).then((res) => res.json())
        );

        const allUsers = await Promise.all(userPromises);
        const validUsers = allUsers
          .filter((u) => u.user)
          .map((u) => ({
            ...u.user,
            isFollowing: true, // by definition, they’re already being followed
          }));

        setFollowingUsers(validUsers);
      } catch (error) {
        console.error("Error fetching following users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

  const handleFollowToggle = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://rantingapp.onrender.com/api/follow/${userId}`, {
        method: "POST",
        headers: { token },
      });
      const data = await res.json();

      if (res.ok) {
        showToast(data.message);
        setFollowingUsers((prev) =>
          prev.filter((u) => (data.message.includes("Unfollowed") ? u._id !== userId : u))
        );
      }
    } catch (error) {
      console.error("Follow toggle error:", error);
    }
  };

  return (
    <>
      <TopBar />
      <Box sx={{ bgcolor: "#f9fafc", minHeight: "100vh", p: 4 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          color="primary"
          textAlign="center"
          mb={4}
        >
          👥 People You Follow
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={6}>
            <CircularProgress />
          </Box>
        ) : followingUsers.length > 0 ? (
          <Grid container spacing={3} justifyContent="center">
            {followingUsers.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user._id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: 5,
                    p: 2,
                    transition: "0.3s",
                    "&:hover": { transform: "translateY(-6px)", boxShadow: 10 },
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h6" fontWeight={700}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mb={2}>
                      {user.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Followers: {user.followersCount || 0} | Following:{" "}
                      {user.followingCount || 0}
                    </Typography>

                    <Box mt={2} display="flex" justifyContent="center" gap={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/user/${user._id}`)}
                      >
                        View Profile
                      </Button>
                      <Button
                        variant={user.isFollowing ? "contained" : "outlined"}
                        color={user.isFollowing ? "success" : "primary"}
                        onClick={() => handleFollowToggle(user._id)}
                      >
                        {user.isFollowing ? "Following" : "Follow"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography
            variant="h6"
            color="textSecondary"
            textAlign="center"
            mt={6}
          >
            You’re not following anyone yet 😅
          </Typography>
        )}

        {/* Snackbar for follow/unfollow feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <MuiAlert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            elevation={6}
            variant="filled"
            sx={{ borderRadius: "10px" }}
          >
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Box>
    </>
  );
};

export default FollowingProfiles;
