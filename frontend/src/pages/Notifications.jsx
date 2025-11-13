import React, { useState, useEffect } from "react";
import TopBar from "../components/Topbar";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Paper,
    LinearProgress,
    IconButton,
    Tooltip,
    Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import downloadImg from "../assets/download.jpeg";
import {
    Bell,
    UserPlus,
    CheckCircle,
    X,
} from "lucide-react";

// 🎨 New utility function to format timestamps like "2 hours ago"
const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
};


const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                // ==================================================================
                // 🎨 Updated to use the GET API route you provided
                const token = localStorage.getItem("token");
                const res = await fetch("https://rantingapp.onrender.com/api/notifications", {
                    headers: { token },
                });
                const data = await res.json();
                if (res.ok) {
                    setNotifications(data.notifications); // Using the response structure
                } else {
                    console.error("Failed to fetch notifications:", data.message);
                    setNotifications([]);
                }
                // ==================================================================

            } catch (error) {
                console.error("Error fetching notifications:", error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const handleDismiss = (id) => {
        // Optimistically remove from UI
        setNotifications(prev => prev.filter(n => n._id !== id));

        // You can still add an API call here if you create a "dismiss" endpoint
        console.log("Dismissed notification:", id);
    };

    // Helper to get the right icon (assuming 'type' field exists)
    const formatTimeLeft = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.round((date - now) / 1000); // Note: date - now
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);

        if (seconds < 0) return "Expired";
        if (seconds < 60) return "in < 1m";
        if (minutes < 60) return `in ${minutes}m`;
        if (hours < 24) return `in ${hours}h`;
        return `in ${days}d`;
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
                            Loading notifications...
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
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2
                        }}
                    >
                        <Bell size={32} />
                        <Typography variant="h4" fontWeight="bold">
                            Notifications
                        </Typography>
                    </Paper>

                    {/* 🎨 Content Grid */}
                    {notifications.length > 0 ? (
                        <Grid container spacing={2}>
                            {notifications.map((notif) => (
                                <Grid item xs={12} key={notif._id}>
                                    <Card
                                        sx={{
                                            background: "#eee8aa",
                                            color: "#63461aff",
                                            borderRadius: 3,
                                            boxShadow: 6,
                                            display: 'flex', // Make it a flex container
                                            alignItems: 'center', // Vertically align items
                                            p: { xs: 2, sm: 3 }, // More padding for larger cards
                                            width: '100%', // Ensure it takes full width
                                        }}
                                    >
                                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
                                            <Box sx={{ flexGrow: 1, minWidth: 0, mr: 2 }}>
                                                <Typography variant="body1" fontWeight="bold">
                                                    {notif.message}
                                                </Typography>

                                                {/* 🎨 UPDATED THIS BOX */}
                                                <Box sx={{ display: 'flex', gap: 2, opacity: 0.8, mt: 0.5 }}>
                                                    <Typography variant="body2">
                                                        {formatTimeAgo(notif.createdAt)}
                                                    </Typography>

                                                    {/* 🎨 ADDED THIS DEADLINE TEXT */}
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight="bold"
                                                        sx={{ color: '#d32f2f' }} // Make deadline red
                                                    >
                                                        Deadline: {formatTimeLeft(notif.deadLine)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            {/* 🎨 ADDED: Show "Apply" button if applyLink exists */}
                                            {notif.applyLink && (
                                                <Button
                                                    variant="contained"
                                                    href={notif.applyLink} // Makes it a link
                                                    target="_blank" // Opens in new tab
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                        flexShrink: 0,
                                                        mr: 1,
                                                        borderRadius: 2,
                                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                        fontWeight: "bold",
                                                        "&:hover": {
                                                            background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                                                        },
                                                    }}
                                                >
                                                    Apply
                                                </Button>
                                            )}
                                            <Tooltip title="Dismiss">
                                                <IconButton
                                                    onClick={() => handleDismiss(notif._id)}
                                                    sx={{ color: '#63461aff' }}
                                                >
                                                    <X />
                                                </IconButton>
                                            </Tooltip>
                                        </CardContent>
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
                            <Bell size={40} color="#63461aff" />
                            <Typography variant="h4" color="#63461aff" gutterBottom sx={{ mt: 2 }}>
                                All Caught Up!
                            </Typography>
                            <Typography variant="body1" color="#63461aff" sx={{ mt: 2 }}>
                                You have no new notifications.
                            </Typography>
                        </Paper>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default NotificationPage;