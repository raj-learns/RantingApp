import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Chip,
    Modal,
    IconButton,
    Fade,
    Paper,            // Added
    LinearProgress,   // Added
    Avatar,           // Added
    Divider,          // Added
} from "@mui/material";
import TopBar from "../components/Topbar";
import downloadImg from "../assets/download.jpeg"; // Added
import {
    User,             // Added
    Check,            // Added
    Plus,             // Added
    X,                // Added
    Calendar,         // Added
    Clock,            // Added
    BookText,         // Added
} from "lucide-react"; // Added

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    // ... (All your existing useEffect and handler logic remains unchanged) ...
    // ... (useEffect for fetchProfile) ...
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

    // ... (fetchPlanDetails) ...
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

    // ... (handleOpenModal) ...
    const handleOpenModal = async (plan) => {
        if (!plan || !plan._id) return;
        const fullPlan = await fetchPlanDetails(plan._id);
        setSelectedPlan(fullPlan || plan);
        setOpenModal(true);
    };

    // ... (handleCloseModal) ...
    const handleCloseModal = () => {
        setOpenModal(false);
        setTimeout(() => setSelectedPlan(null), 300);
    };

    // ... (handleFollowToggle) ...
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
                // Update follower count locally for instant feedback
                setUser((prev) => ({
                    ...prev,
                    followersCount: isFollowing ? prev.followersCount - 1 : prev.followersCount + 1,
                    followers: isFollowing
                        ? (prev.followers || []).filter(f => f !== myId)
                        : [...(prev.followers || []), myId],
                }));

            }
        } catch (err) {
            console.error("Follow error:", err);
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
                            Loading profile...
                        </Typography>
                        <LinearProgress sx={{ mt: 2, borderRadius: 2 }} />
                    </Paper>
                </Box>
            </>
        );

    // 🎨 Styled Empty State
    if (!user)
        return (
            <>
                <TopBar />
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundImage: `url(${downloadImg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundAttachment: "fixed",
                        position: "relative",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                        },
                    }}
                >
                    <Paper
                        elevation={20}
                        sx={{
                            p: 6,
                            borderRadius: 4,
                            textAlign: "center",
                            background: "#eee8aa",
                            backdropFilter: "blur(20px)",
                            maxWidth: 500,
                            mx: 2,
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        <Typography variant="h4" color="#63461aff" gutterBottom>
                            User Not Found
                        </Typography>
                        <Typography variant="body1" color="#63461aff" sx={{ mt: 2 }}>
                            This profile could not be loaded or may not exist.
                        </Typography>
                    </Paper>
                </Box>
            </>
        );

    // Helper for simple stat cards
    const SimpleStat = ({ label, value }) => (
        <Grid item xs={6} md={3}>
            <Paper
                elevation={6}
                sx={{
                    p: 2,
                    textAlign: 'center',
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 3,
                    color: '#ffffff',
                }}
            >
                <Typography variant="h5" fontWeight="bold">{value}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>{label}</Typography>
            </Paper>
        </Grid>
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
                    {/* 🎨 "Different" Profile Header Card */}
                    <Paper
                        elevation={10}
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: 4,
                            background: "rgba(255, 255, 255, 0.3)",
                            backdropFilter: "blur(10px)",
                            color: "white",
                            textAlign: 'center'
                        }}
                    >
                        <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.2)' }}>
                            <User size={40} />
                        </Avatar>
                        <Typography variant="h3" fontWeight={700}>
                            {user.name}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.8, mb: 3 }}>
                            {user.email}
                        </Typography>

                        {isFollowing ? (
                            <Button
                                variant="contained"
                                startIcon={<Check />}
                                onClick={handleFollowToggle}
                                sx={{
                                    borderRadius: 3,
                                    bgcolor: '#4caf50', // Green
                                    fontWeight: "bold",
                                    "&:hover": { bgcolor: '#388e3c' }
                                }}
                            >
                                Following
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                startIcon={<Plus />}
                                onClick={handleFollowToggle}
                                sx={{
                                    borderRadius: 3,
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    fontWeight: "bold",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                                    }
                                }}
                            >
                                Follow
                            </Button>
                        )}

                        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 3 }} />

                        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                            <Chip
                                label={`Followers: ${user.followersCount}`}
                                variant="outlined"
                                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.7)' }}
                            />
                            <Chip
                                label={`Following: ${user.followingCount}`}
                                variant="outlined"
                                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.7)' }}
                            />
                            <Chip
                                label={`Rewards: ${user.stats?.totalRewards ?? 0}`}
                                variant="outlined"
                                sx={{ color: '#ff9800', borderColor: '#ff9800' }} // Highlight rewards
                            />
                        </Box>
                    </Paper>

                    {/* 🎨 "Different" Stats Section */}
                    <Grid container spacing={21}>
                        <SimpleStat label="Total Tasks Done" value={user.stats?.totalTasksDone ?? 0} />
                        <SimpleStat label="SDE Tasks" value={user.stats?.sdeTasksDone ?? 0} />
                        <SimpleStat label="Core Tasks" value={user.stats?.coreTasksDone ?? 0} />
                        <SimpleStat label="Non-Core Tasks" value={user.stats?.nonCoreTasksDone ?? 0} />
                    </Grid>

                    {/* 🎨 Consistent Plans Section */}
                    <Typography variant="h5" fontWeight={600} color="white" sx={{ mb: -1 }}>
                        📅 Plans by {user.name}
                    </Typography>

                    <Grid container spacing={3}>
                        {plans?.length > 0 ? (
                            plans.map((plan) => (
                                <Grid item xs={12} sm={6} md={4} key={plan._id}>
                                    <Card
                                        onClick={() => handleOpenModal(plan)}
                                        sx={{
                                            cursor: "pointer",
                                            borderRadius: 3,
                                            boxShadow: 6,
                                            transition: "0.3s",
                                            background: "#eee8aa", // Golden theme
                                            color: "#63461aff",
                                            height: "100%",
                                            "&:hover": {
                                                transform: "translateY(-6px)",
                                                boxShadow: 10,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ textAlign: "center" }}>
                                            <Typography variant="h5" fontWeight={700}>
                                                {new Date(plan.planDate).toLocaleDateString("en-IN", {
                                                    weekday: "short",
                                                    day: "numeric",
                                                    month: "short",
                                                })}
                                            </Typography>
                                            <Typography variant="subtitle1" mt={1}>
                                                {plan.title || "Untitled Plan"}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Paper
                                    sx={{
                                        p: 4,
                                        textAlign: 'center',
                                        background: "rgba(255, 255, 255, 0.3)",
                                        backdropFilter: "blur(10px)",
                                        borderRadius: 3,
                                        color: '#ffffff',
                                    }}
                                >
                                    <Typography variant="body1">
                                        This user hasn't made any public plans yet 😅
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>

                    {/* 🎨 Consistent Modal */}
                    <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition>
                        <Fade in={openModal}>
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: { xs: '90%', sm: 480 },
                                    bgcolor: "#ffffff",
                                    borderRadius: 4,
                                    boxShadow: 24,
                                    p: 4,
                                    maxHeight: "80vh",
                                    overflowY: "auto",
                                }}
                            >
                                <IconButton
                                    onClick={handleCloseModal}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        color: 'grey.500'
                                    }}
                                >
                                    <X />
                                </IconButton>

                                {selectedPlan && (
                                    <>
                                        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}><Calendar /></Avatar>
                                            <Typography variant="h6" color="primary" fontWeight="bold">
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
                                                        backgroundColor: task.completed ? "#d4edda" : "#eee8aa",
                                                        color: task.completed ? 'inherit' : '#63461aff',
                                                        borderLeft: task.isRewarded
                                                            ? "6px solid #4caf50"
                                                            : "4px solid #ccc",
                                                        boxShadow: 2,
                                                    }}
                                                >
                                                    <Typography fontWeight={600} mb={0.5}>
                                                        {task.description}
                                                    </Typography>
                                                    <Chip
                                                        icon={<Clock size={16} />}
                                                        label={`${task.expectedDuration || "N/A"} hours`}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ mr: 1, color: 'inherit', borderColor: 'rgba(0,0,0,0.23)' }}
                                                    />
                                                    <Chip
                                                        icon={<BookText size={16} />}
                                                        label={task.field}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ color: 'inherit', borderColor: 'rgba(0,0,0,0.23)' }}
                                                    />
                                                    {task.isRewarded && (
                                                        <Chip
                                                            label="⭐ Rewarded Task"
                                                            color="success"
                                                            size="small"
                                                            sx={{ mt: 1, display: 'flex' }}
                                                        />
                                                    )}
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">
                                                No tasks available for this plan.
                                            </Typography>
                                        )}

                                        <Button
                                            onClick={handleCloseModal}
                                            fullWidth
                                            variant="contained"
                                            size="large"
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
                                            Close
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Fade>
                    </Modal>
                </Box>
            </Box>
        </>
    );
};

export default UserProfile;