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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AllPlans = () => {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:4000/api/myplans", {
                    headers: { token },
                });
                const data = await res.json();
                console.log("Fetched Plans:", data);
                if (res.ok) setPlans(data.plans);
            } catch (error) {
                console.error("Error fetching plans:", error);
            }
        };
        fetchPlans();
    }, []);

    const gradients = [
        "linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)",
        "linear-gradient(135deg, #F6D365 0%, #FDA085 100%)",
        "linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)",
        "linear-gradient(135deg, #FCCB90 0%, #D57EEB 100%)",
        "linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)",
    ];

    const handleOpenModal = (plan) => {
        setSelectedPlan(plan);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setTimeout(() => setSelectedPlan(null), 300);
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
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4" fontWeight={700} color="primary">
                        📅 All Plans
                    </Typography>
                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => navigate("/todayplan")}
                        >
                            Go to Today’s Plan
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => navigate("/createplan")}
                        >
                            + Create New Plan
                        </Button>
                    </Box>
                </Box>

                <Grid container spacing={3} justifyContent="center">
                    {plans.map((plan, index) => {
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
                                        borderRadius: 4,
                                        boxShadow: 6,
                                        transition: "0.3s",
                                        background: gradients[index % gradients.length],
                                        "&:hover": {
                                            transform: "translateY(-6px)",
                                            boxShadow: 10,
                                        },
                                    }}
                                >
                                    <CardContent sx={{ textAlign: "center", color: "#fff" }}>
                                        <Typography variant="h4" fontWeight={700}>
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

                {/* 🔹 Modal for Selected Plan */}
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
                                        <IconButton
                                            onClick={() => navigate(`/editplan/${selectedPlan._id}`)}
                                            color="primary"
                                        >
                                            Edit
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
                                                backgroundColor: task.completed ? "#d1e7dd" : "#fff3cd",
                                                borderLeft: task.isRewarded ? "6px solid #4caf50" : "4px solid #ccc",
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
                                    ))}

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

export default AllPlans;
