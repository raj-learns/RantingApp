import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert"; // Changed from MuiAlert
import TopBar from "../components/Topbar";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Paper,            // Added
    LinearProgress,   // Added
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import downloadImg from "../assets/download.jpeg"; // Added
import { Search } from "lucide-react"; // Added

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
                // This logic removes the user from the list on unfollow
                setFollowingUsers((prev) =>
                    prev.filter((u) => (data.message.includes("Unfollowed") ? u._id !== userId : u))
                );
            }
        } catch (error) {
            console.error("Follow toggle error:", error);
        }
    };

    // 🎨 Styled Loading State
    if (loading)
        return (
            <>
                <TopBar />
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                >
                    <Paper
                        elevation={10}
                        sx={{
                            p: 5,
                            borderRadius: 4,
                            textAlign: "center",
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <Typography variant="h5" color="#667eea" gutterBottom>
                            Loading profiles...
                        </Typography>
                        <LinearProgress sx={{ mt: 2, borderRadius: 2 }} />
                    </Paper>
                </Box>
            </>
        );

    return (
        <>
            <TopBar />
            {/* 🎨 Main Layout Wrapper */}
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundImage: `url(${downloadImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                    position: "relative",
                    py: 6,
                    px: 2,
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                    },
                }}
            >
                {/* 🎨 Centered Content Box */}
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        maxWidth: 1000,
                        mx: "auto",
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
                    }}
                >
                    {/* 🎨 HEADER */}
                    <Paper
                        elevation={10}
                        sx={{
                            p: { xs: 2, md: 4 },
                            borderRadius: 4,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            <Typography variant="h4" fontWeight="bold">
                                👥 People You Follow
                            </Typography>
                            <Button
                                variant="outlined"
                                color="inherit" // Makes it white
                                startIcon={<Search />}
                                sx={{ borderRadius: 3, fontWeight: "bold" }}
                                onClick={() => navigate("/search")}
                            >
                                Find People
                            </Button>
                        </Box>
                    </Paper>

                    {/* 🎨 Content Grid */}
                    {followingUsers.length > 0 ? (
                        <Grid container spacing={8}>
                            {followingUsers.map((user) => (
                                <Grid item xs={12} sm={6} md={4} key={user._id}>
                                    <Card
                                        sx={{
                                            // 🎨 Applied golden theme
                                            background: "#eee8aa",
                                            color: "#63461aff",
                                            borderRadius: 3,
                                            boxShadow: 6,
                                            transition: "0.3s",
                                            "&:hover": { transform: "translateY(-6px)", boxShadow: 10 },
                                            height: "100%", // Ensures cards are same height
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                                            <Typography variant="h6" fontWeight={700}>
                                                {user.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.8 }} mb={2}>
                                                {user.email}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                Followers: {user.followersCount || 0} | Following:{" "}
                                                {user.followingCount || 0}
                                            </Typography>
                                        </CardContent>
                                        <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => navigate(`/user/${user._id}`)}
                                                // 🎨 Styled primary action button
                                                sx={{
                                                    borderRadius: 2,
                                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                    fontWeight: "bold",
                                                    "&:hover": {
                                                        background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                                                    },
                                                }}
                                            >
                                                View Profile
                                            </Button>
                                            <Button
                                                // 🎨 Styled "Unfollow" button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleFollowToggle(user._id)}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                Unfollow
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        // 🎨 Styled Empty State
                        <Paper
                            elevation={10}
                            sx={{
                                p: { xs: 4, md: 6 },
                                borderRadius: 4,
                                textAlign: "center",
                                background: "#eee8aa",
                                backdropFilter: "blur(20px)",
                                maxWidth: 500,
                                mx: "auto",
                            }}
                        >
                            <Typography variant="h4" color="#63461aff" gutterBottom>
                                😅 You're Not Following Anyone
                            </Typography>
                            <Typography variant="body1" color="#63461aff" sx={{ mt: 2 }}>
                                Go to the search page to find people and see their plans.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<Search />}
                                onClick={() => navigate("/search")}
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    borderRadius: 3,
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    fontWeight: "bold",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                                    },
                                }}
                            >
                                Find People
                            </Button>
                        </Paper>
                    )}
                </Box>

                {/* Snackbar for follow/unfollow feedback */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000} // Increased duration slightly
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        elevation={6}
                        variant="filled"
                        sx={{ width: "10S0%" }} // Consistent with TodayPlan
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
};

export default FollowingProfiles;