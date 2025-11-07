import React, { useState, useEffect } from "react";
import TopBar from "../components/Topbar";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Modal,
    Button,
    Chip,
    IconButton,
    Fade,
    Paper,            // Added
    LinearProgress,   // Added
    Avatar,           // Added
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import downloadImg from "../assets/download.jpeg"; // Added
import {
    Calendar,       // Added
    X,              // Added
    Pencil,         // Added
    Clock,          // Added
    BookText,       // Added
    Home,           // Added
    FilePlus,       // Added
} from "lucide-react"; // Added

const AllPlans = () => {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true); // Added loading state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("https://rantingapp.onrender.com/api/myplans", {
                    headers: { token },
                });
                const data = await res.json();
                console.log("Fetched Plans:", data);
                if (res.ok) setPlans(data.plans);
            } catch (error) {
                console.error("Error fetching plans:", error);
            } finally {
                setLoading(false); // Added
            }
        };
        fetchPlans();
    }, []);

    const handleOpenModal = (plan) => {
        setSelectedPlan(plan);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setTimeout(() => setSelectedPlan(null), 300);
    };

    // 🎨 Styled Loading State
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
                        Loading all plans...
                    </Typography>
                    <LinearProgress sx={{ mt: 2, borderRadius: 2 }} />
                </Paper>
            </Box>
        );

    // 🎨 Styled Empty State
    if (!loading && plans.length === 0)
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
                            No Plans Found
                        </Typography>
                        <Typography variant="body1" color="#63461aff" sx={{ mt: 2 }}>
                            You haven't created any plans yet. Get started by creating one!
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate("/createplan")}
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
                            Create a Plan
                        </Button>
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
                                📅 All My Plans
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<Home />}
                                    onClick={() => navigate("/todayplan")}
                                    sx={{
                                        borderRadius: 3,
                                        background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                                        fontWeight: "bold",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        },
                                    }}
                                >
                                    Today's Plan
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit" // Makes it white
                                    startIcon={<FilePlus />}
                                    sx={{ borderRadius: 3, fontWeight: "bold" }}
                                    onClick={() => navigate("/createplan")} // Corrected path
                                >
                                    Create New
                                </Button>
                            </Box>
                        </Box>
                    </Paper>

                    {/* 🎨 Plans Grid */}
                    <Grid container spacing={3}>
                        {plans.map((plan) => {
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
                                            cursor: "pointer",
                                            borderRadius: 3, // Consistent border radius
                                            boxShadow: 6,
                                            transition: "0.3s",
                                            // 🎨 Consistent Card Styling
                                            background: "#eee8aa",
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
                                                {date}
                                            </Typography>
                                            <Typography variant="subtitle1" mt={1}>
                                                {plan.title || "Untitled Plan"}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>

                    {/* 🔹 Modal for Selected Plan (Styled like ProfilePage) */}
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
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}><Calendar /></Avatar>
                                                <Typography variant="h6" color="primary" fontWeight="bold">
                                                    {new Date(selectedPlan.planDate).toLocaleDateString("en-IN", {
                                                        weekday: "long",
                                                        day: "numeric",
                                                        month: "long",
                                                    })}
                                                </Typography>
                                            </Box>
                                            <IconButton
                                                onClick={() => navigate(`/editplan/${selectedPlan._id}`)}
                                                color="primary"
                                            >
                                                <Pencil />
                                            </IconButton>
                                        </Box>

                                        {/* Task List */}
                                        {selectedPlan.tasks.map((task, i) => (
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
                                        ))}

                                        {/* Close Button */}
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

export default AllPlans;