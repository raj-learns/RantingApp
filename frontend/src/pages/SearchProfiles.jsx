import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert"; // Changed from MuiAlert
import TopBar from "../components/Topbar";
import {
    Box,
    TextField,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Paper,            // Added
    InputAdornment,  // Added
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import downloadImg from "../assets/download.jpeg"; // Added
import {
    Search,     // Added
    UserPlus,   // Added
    UserCheck,  // Added
} from "lucide-react"; // Added

const SearchProfiles = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const navigate = useNavigate();

    const showToast = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    // ... (All your existing handler logic remains unchanged) ...
    // ... (handleSearch) ...
    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim().length === 0) {
            setResults([]);
            setLoading(false); // Stop loading if query is cleared
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `https://rantingapp.onrender.com/api/users/search?q=${value}`,
                {
                    headers: { token },
                }
            );
            const data = await res.json();
            if (res.ok) {
                const myId = JSON.parse(atob(localStorage.getItem("token").split(".")[1]))?._id;
                const enriched = data.results.map((u) => ({
                    ...u,
                    isFollowing: u.followers?.includes(myId),
                }));
                setResults(enriched);
            }

            else setResults([]);
        } catch (error) {
            console.error("Error searching users:", error);
        }
        setLoading(false);
    };

    // ... (handleFollow) ...
    const handleFollow = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `https://rantingapp.onrender.com/api/follow/${userId}`,
                {
                    method: "POST",
                    headers: { token },
                }
            );
            const data = await res.json();
            if (res.ok) {
                showToast(data.message);
                // 🎨 Refresh the specific user instead of the whole search
                setResults(prevResults => 
                    prevResults.map(user => 
                        user._id === userId 
                        ? { ...user, isFollowing: !user.isFollowing } 
                        : user
                    )
                );
            }
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    // 🎨 Helper to render main content based on state
    const renderContent = () => {
        if (loading) {
            return (
                <Paper
                    elevation={10}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        textAlign: "center",
                        background: "rgba(255, 255, 255, 0.3)",
                        backdropFilter: "blur(10px)",
                        color: 'white',
                        mt: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2
                    }}
                >
                    <CircularProgress color="inherit" />
                    <Typography variant="h6">Searching...</Typography>
                </Paper>
            );
        }

        if (query.length > 0 && results.length === 0) {
            return (
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
                        mt: 4
                    }}
                >
                    <Typography variant="h4" color="#63461aff" gutterBottom>
                        👀 No Users Found
                    </Typography>
                    <Typography variant="body1" color="#63461aff" sx={{ mt: 2 }}>
                        We couldn't find anyone matching that search. Try a different name or email.
                    </Typography>
                </Paper>
            );
        }

        if (results.length > 0) {
            return (
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {results.map((user) => (
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
                                    height: "100%",
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
                                        Followers: {user.followers?.length || 0} | Following:{" "}
                                        {user.following?.length || 0}
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
                                        // 🎨 Styled "Follow/Following" button
                                        variant={user.isFollowing ? "contained" : "outlined"}
                                        color={user.isFollowing ? "success" : "primary"}
                                        onClick={() => handleFollow(user._id)}
                                        startIcon={user.isFollowing ? <UserCheck /> : <UserPlus />}
                                        sx={{
                                            borderRadius: 2,
                                            // Make outline button match theme
                                            borderColor: user.isFollowing ? 'inherit' : 'rgba(99, 70, 26, 0.5)',
                                            color: user.isFollowing ? 'inherit' : '#63461aff',
                                            '&:hover': {
                                                borderColor: user.isFollowing ? 'inherit' : '#63461aff',
                                                bgcolor: user.isFollowing ? 'inherit' : 'rgba(99, 70, 26, 0.08)'
                                            }
                                        }}
                                    >
                                        {user.isFollowing ? "Following" : "Follow"}
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            );
        }

        // 🎨 Initial empty state
        return (
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
                    mt: 4
                }}
            >
                <Typography variant="h4" color="#63461aff" gutterBottom>
                    Find Other Users
                </Typography>
                <Typography variant="body1" color="#63461aff" sx={{ mt: 2 }}>
                    Search for other users by their name or email to see their profiles and plans.
                </Typography>
            </Paper>
        );
    };

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
                    {/* 🎨 HEADER with integrated Search Bar */}
                    <Paper
                        elevation={10}
                        sx={{
                            p: { xs: 2, md: 4 },
                            borderRadius: 4,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, textAlign: 'center' }}>
                            🔍 Search Profiles
                        </Typography>
                        <TextField
                            fullWidth
                            label="Search by name or email..."
                            variant="filled" // Filled looks better on gradient
                            value={query}
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search style={{ color: 'white' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                // 🎨 Frosted text field
                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                borderRadius: 2,
                                '& .MuiFilledInput-root': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                    },
                                    color: 'white'
                                },
                                '& label': { color: '#e0e0e0' },
                                '& label.Mui-focused': { color: '#ffffff' },
                            }}
                        />
                    </Paper>

                    {/* 🎨 Render Content (Loading, Empty, or Results) */}
                    {renderContent()}

                </Box>
                
                {/* Snackbar for follow/unfollow feedback */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={2000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        elevation={6}
                        variant="filled"
                        sx={{ width: '100%' }} // Consistent
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
};

export default SearchProfiles;