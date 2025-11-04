import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const SearchProfiles = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const navigate = useNavigate();

    const showToast = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };


    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim().length === 0) {
            setResults([]);
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
                handleSearch({ target: { value: query } }); // refresh list
            }
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    return (
        <>
            <TopBar />
            <Box
                sx={{
                    bgcolor: "#f9fafc",
                    minHeight: "100vh",
                    p: 4,
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight={700}
                    color="primary"
                    textAlign="center"
                    mb={4}
                >
                    🔍 Search Profiles
                </Typography>

                <Box display="flex" justifyContent="center" mb={4}>
                    <TextField
                        label="Search by name or email..."
                        variant="outlined"
                        value={query}
                        onChange={handleSearch}
                        sx={{ width: "60%", bgcolor: "white", borderRadius: 2 }}
                    />
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={6}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3} justifyContent="center">
                        {results.map((user, index) => (
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
                                            Followers: {user.followers?.length || 0} | Following:{" "}
                                            {user.following?.length || 0}
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
                                                onClick={() => handleFollow(user._id)}
                                            >
                                                {user.isFollowing ? "Following" : "Follow"}
                                            </Button>

                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {!loading && query.length > 0 && results.length === 0 && (
                    <Typography
                        variant="h6"
                        color="textSecondary"
                        textAlign="center"
                        mt={6}
                    >
                        No users found 👀
                    </Typography>
                )}
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

export default SearchProfiles;
