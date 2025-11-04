import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Grid,
    Chip,
    Modal,
    IconButton,
    Fade,
} from "@mui/material";
import TopBar from "../components/Topbar";


const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`https://rantingapp.onrender.com/api/user/${id}`, {
                    headers: { token },
                });
                const data = await res.json();
                console.log(data);
                if (res.ok) {
                    setUser(data.user);
                    setPlans(data.recentPlans);
                    const myId = JSON.parse(atob(token.split(".")[1]))?._id;
                    setIsFollowing(data.user.followers.some(f => f.toString() === myId));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    const fetchPlanDetails = async (planId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`https://rantingapp.onrender.com/api/plan/${planId}`, {
                headers: { token },
            });
            const data = await res.json();
            if (res.ok) return data.plan;
            else console.error("Failed to fetch plan details:", data.message);
        } catch (err) {
            console.error("Error fetching plan details:", err);
        }
    };

    const handleOpenModal = async (plan) => {
        if (!plan || !plan._id) return;
        const fullPlan = await fetchPlanDetails(plan._id);
        setSelectedPlan(fullPlan || plan);
        setOpenModal(true);
    };


    const handleCloseModal = () => {
        setOpenModal(false);
        setTimeout(() => setSelectedPlan(null), 300);
    };

    console.log("User Data:", user);

    const handleFollowToggle = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`https://rantingapp.onrender.com/api/follow/${id}`, {
                method: "POST",
                headers: { token },
            });
            const data = await res.json();
            if (res.ok) {
                setIsFollowing((prev) => !prev);
                const myId = JSON.parse(atob(token.split(".")[1]))?._id;
                setUser((prev) => ({
                    ...prev,
                    followers: isFollowing
                        ? (prev.followers || []).filter(f => f !== myId)
                        : [...(prev.followers || []), myId],
                }));

            }
        } catch (err) {
            console.error("Follow error:", err);
        }
    };


    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );

    if (!user)
        return (
            <Box textAlign="center" mt={6}>
                <Typography variant="h6" color="error">
                    User not found.
                </Typography>
            </Box>
        );

    const gradients = [
        "linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)",
        "linear-gradient(135deg, #F6D365 0%, #FDA085 100%)",
        "linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)",
        "linear-gradient(135deg, #FCCB90 0%, #D57EEB 100%)",
        "linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)",
    ];

    return (
        <>
            <TopBar />
            <Box sx={{ bgcolor: "#f9fafc", minHeight: "100vh", p: 4 }}>
                {/* Header Section */}
                <Box textAlign="center" mb={4}>
                    <Typography variant="h3" fontWeight={700} color="primary">
                        {user.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {user.email}
                    </Typography>

                    <Box display="flex" justifyContent="center" gap={3} mt={2}>
                        <Chip label={`Followers: ${user.followersCount}`} color="primary" />
                        <Chip label={`Following: ${user.followingCount}`} color="secondary" />
                        <Chip
                            label={`Rewards: ${user.stats?.totalRewards ?? 0}`}
                            color="success"
                        />
                    </Box>
{/* 
                    <Button
                        variant={isFollowing ? "contained" : "outlined"}
                        color={isFollowing ? "success" : "primary"}
                        onClick={handleFollowToggle}
                        sx={{ mt: 3 }}
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </Button> */}
                </Box>

                {/* Stats Section */}
                <Box
                    display="flex"
                    justifyContent="center"
                    gap={3}
                    flexWrap="wrap"
                    mb={4}
                >
                    <Card sx={{ p: 2, boxShadow: 4 }}>
                        <Typography variant="subtitle1" color="textSecondary">
                            Total Tasks Done
                        </Typography>
                        <Typography variant="h5">{user.stats?.totalTasksDone ?? 0}</Typography>
                    </Card>
                    <Card sx={{ p: 2, boxShadow: 4 }}>
                        <Typography variant="subtitle1" color="textSecondary">
                            SDE Tasks
                        </Typography>
                        <Typography variant="h5">{user.stats?.sdeTasksDone ?? 0}</Typography>
                    </Card>
                    <Card sx={{ p: 2, boxShadow: 4 }}>
                        <Typography variant="subtitle1" color="textSecondary">
                            Core Tasks
                        </Typography>
                        <Typography variant="h5">{user.stats?.coreTasksDone ?? 0}</Typography>
                    </Card>
                    <Card sx={{ p: 2, boxShadow: 4 }}>
                        <Typography variant="subtitle1" color="textSecondary">
                            Non-Core Tasks
                        </Typography>
                        <Typography variant="h5">{user.stats?.nonCoreTasksDone ?? 0}</Typography>
                    </Card>
                </Box>

                {/* Plans Section */}
                <Typography variant="h5" fontWeight={600} mb={3}>
                    📅 Plans by {user.name}
                </Typography>

                <Grid container spacing={3} justifyContent="center">
                    {plans?.length > 0 ? (
                        plans.map((plan, index) => {
                            const date = new Date(plan.planDate).toLocaleDateString("en-IN", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                            });
                            return (
                                <Grid item xs={12} sm={6} md={4} key={plan._id}>
                                    <Card
                                        onClick={() => handleOpenModal(plan)}
                                        sx={{
                                            borderRadius: 4,
                                            boxShadow: 6,
                                            background: gradients[index % gradients?.length],
                                            transition: "0.3s",
                                            "&:hover": {
                                                transform: "translateY(-6px)",
                                                boxShadow: 10,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ textAlign: "center", color: "#fff" }}>
                                            <Typography variant="h5" fontWeight={700}>
                                                {date}
                                            </Typography>
                                            <Typography variant="subtitle1" mt={1}>
                                                {plan.title || "Untitled Plan"}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })
                    ) : (
                        <Typography variant="body1" color="textSecondary">
                            No plans yet 😅
                        </Typography>
                    )}
                </Grid>
                <Modal open={openModal} onClose={handleCloseModal}>
                    <Fade in={openModal}>
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 480,
                                bgcolor: "#ffffff",
                                borderRadius: 4,
                                boxShadow: 24,
                                p: 4,
                                maxHeight: "80vh",
                                overflowY: "auto",
                                borderTop: "6px solid #2196f3",
                            }}
                        >
                            {selectedPlan && (
                                <>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="h6" color="primary">
                                            {new Date(selectedPlan.planDate).toLocaleDateString("en-IN", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                            })}
                                        </Typography>
                                    </Box>

                                    {/* Task List */}
                                    {selectedPlan.tasks && selectedPlan.tasks.length > 0 ? (
                                        selectedPlan.tasks.map((task, i) => (
                                            <Box
                                                key={i}
                                                sx={{
                                                    p: 2,
                                                    mb: 2,
                                                    borderRadius: 3,
                                                    backgroundColor: task.completed ? "#d1e7dd" : "#fff3cd",
                                                    borderLeft: task.isRewarded
                                                        ? "6px solid #4caf50"
                                                        : "4px solid #ccc",
                                                    boxShadow: 2,
                                                }}
                                            >
                                                <Typography fontWeight={600} mb={0.5}>
                                                    {task.description}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Duration: {task.expectedDuration || "N/A"} hours
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Field: {task.field}
                                                </Typography>
                                                {task.isRewarded && (
                                                    <Chip
                                                        label="⭐ Rewarded Task"
                                                        color="success"
                                                        size="small"
                                                        sx={{ mt: 1 }}
                                                    />
                                                )}
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">
                                            No tasks available for this plan.
                                        </Typography>
                                    )}

                                    {/* Close Button */}
                                    <Button
                                        onClick={handleCloseModal}
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                    >
                                        Close
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Fade>
                </Modal>
            </Box>
        </>
    );
};

export default UserProfile;
