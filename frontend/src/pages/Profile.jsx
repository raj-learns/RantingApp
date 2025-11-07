import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Divider,
    Tooltip,
    Modal,
    Fade,
    Chip,
    Paper,        // Added
    Grid,         // Added
    Avatar,       // Added
    LinearProgress, // Added
    IconButton,
} from "@mui/material";
import TopBar from "../components/Topbar";
import { useNavigate } from "react-router-dom";
import downloadImg from "../assets/download.jpeg";
import {
    CheckCircle,
    BookText,
    Target,
    Award,
    Calendar,
    RefreshCcw, // Added
    User,         // Added
    ArrowUpWideNarrow,
    X,           // Added
    Clock,        // Added
} from "lucide-react"; // Added icons

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [autoFixed, setAutoFixed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();

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

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://rantingapp.onrender.com/api/profile", {
                headers: { token },
            });

            const data = await res.json();
            if (res.status === 200) {
                setUser(data.user);
                setAutoFixed(data.autoFixed);
            } else {
                console.error("Error fetching profile:", data.message);
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
        } finally {
            setLoading(false);
        }
    };

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

    useEffect(() => {
        fetchProfile();
    }, []);

    // 🎨 Styled Loading State (from TodayPlan)
    if (loading)
        return (
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
                        Loading your profile...
                    </Typography>
                    <LinearProgress sx={{ mt: 2, borderRadius: 2 }} />
                </Paper>
            </Box>
        );

    // 🎨 Styled Empty State (from TodayPlan)
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
                            background: "#eee8aa", // Consistent color
                            backdropFilter: "blur(20px)",
                            maxWidth: 500,
                            mx: 2,
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        <Typography variant="h4" color="#63461aff" gutterBottom>
                            Profile Not Found
                        </Typography>
                        <Typography variant="body1" color="#63461aff" sx={{ mt: 2 }}>
                            We were unable to load your profile. Please try again later.
                        </Typography>
                    </Paper>
                </Box>
            </>
        );

    // 🎨 Styled PlanCard (to match TodayPlan TaskCard)
    const PlanCard = ({ label, plan }) => (
        <Grid item xs={12} md={4}>
            <Card
                onClick={() => handleOpenModal(plan)}
                sx={{
                    cursor: plan ? "pointer" : "default",
                    borderRadius: 3,
                    boxShadow: 6,
                    background: "#eee8aa", // Consistent color
                    color: "#63461aff",    // Consistent text color
                    height: "100%",
                    transition: "all 0.3s",
                    "&:hover": {
                        transform: plan ? "translateY(-4px)" : "none",
                        boxShadow: plan ? 12 : 6
                    },
                }}
            >
                <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                        {label}
                    </Typography>
                    <Divider sx={{ background: "rgba(0,0,0,0.12)", my: 1 }} />
                    {plan ? (
                        <>
                            <Typography variant="subtitle1" fontWeight="500">{plan.title}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                {new Date(plan.planDate).toLocaleDateString()}
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            No plan found
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Grid>
    );

    // 🎨 Helper component for Stats Cards (from TodayPlan)
    const StatCard = ({ icon, color, value, label }) => (
        <Grid item xs={12} sm={6} md={4}>
            <Card
                elevation={8}
                sx={{
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 3,
                    transition: "transform 0.3s",
                    "&:hover": { transform: "translateY(-5px)" },
                    textAlign: "center",
                    height: "100%",
                }}
            >
                <CardContent>
                    <Avatar
                        sx={{
                            bgcolor: color,
                            width: 60,
                            height: 60,
                            mx: "auto",
                            mb: 2,
                        }}
                    >
                        {icon}
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: color }}>
                        {value}
                    </Typography>
                    <Typography variant="body2" color="#ffffff">
                        {label}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );

    return (
        <>
            <TopBar />
            {/* 🎨 Main Layout Wrapper (from TodayPlan) */}
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
                {/* 🎨 Centered Content Box (from TodayPlan) */}
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
                    {/* 🎨 HEADER (Styled as TodayPlan Header Card) */}
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
                                My Profile
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate("/createplan")}
                                    sx={{
                                        borderRadius: 3,
                                        background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)", // Swapped for hover effect
                                        fontWeight: "bold",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        },
                                    }}
                                >
                                    Create New Plan
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit" // Makes it white
                                    sx={{ borderRadius: 3, fontWeight: "bold" }}
                                    onClick={() => navigate("/allplans")}
                                >
                                    View All Plans
                                </Button>
                            </Box>
                        </Box>
                    </Paper>

                    {/* 🎨 USER INFO (Styled as TodayPlan Frosted Card) */}
                    <Paper
                        elevation={10}
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            background: "rgba(255, 255, 255, 0.3)",
                            backdropFilter: "blur(10px)",
                            color: "#ffffff",
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            mt: 5
                        }}
                    >
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 60, height: 60 }}>
                            <User size={30} />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="bold">
                                {user.name}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.8 }}>
                                {user.email}
                            </Typography>
                        </Box>
                    </Paper>

                    {/* 🎨 STATS (Styled as TodayPlan Stats Cards) */}
                    <Grid container spacing={12} mt={5}>
                        <StatCard
                            icon={<CheckCircle size={30} />}
                            color="#4caf50"
                            value={user.stats.totalTasksDone}
                            label="Total Tasks Done"
                        />
                        <StatCard
                            icon={<BookText size={30} />}
                            color="#2196f3"
                            value={user.stats.sdeTasksDone}
                            label="SDE Tasks"
                        />
                        <StatCard
                            icon={<Target size={30} />}
                            color="#f44336"
                            value={user.stats.coreTasksDone}
                            label="Core Tasks"
                        />
                        <StatCard
                            icon={<Award size={30} />}
                            color="#ff9800"
                            value={user.stats.totalRewards}
                            label="Rewards Earned"
                        />
                        <StatCard
                            icon={<ArrowUpWideNarrow size={30} />}
                            color="#9e9e9e"
                            value={user.stats.nonCoreTasksDone}
                            label="Non-Core Tasks"
                        />
                    </Grid>

                    {/* 🎨 PLAN CARDS (Grid container) */}
                    <Grid container spacing={30} mt={5}>
                        <PlanCard label="Last Plan" plan={user.lastPlan} />
                        <PlanCard label="Today's Plan" plan={user.currentPlan} />
                        <PlanCard label="Next Plan" plan={user.nextPlan} />
                    </Grid>

                    {/* 🎨 AutoFix Notice (Styled for new background) */}
                    {autoFixed && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#ffffff",
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1
                            }}
                        >
                            <RefreshCcw size={16} />
                            Profile auto-updated to reflect latest plan changes!
                        </Typography>
                    )}

                    {/* 🔹 Modal for Selected Plan (Styling updated internally) */}
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
                                                        sx={{ mr: 1, color: 'inherit' }}
                                                    />
                                                    <Chip
                                                        icon={<BookText size={16} />}
                                                        label={task.field}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ color: 'inherit' }}
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

                                        {/* 🎨 Close Button (Styled as TodayPlan main button) */}
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

export default ProfilePage;