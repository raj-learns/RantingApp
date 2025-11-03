import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Button,
    Divider,
    Tooltip,
    Modal,
    Fade,
    IconButton,
    Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import TopBar from "../components/Topbar";
import { useNavigate } from "react-router-dom";

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

    if (loading)
        return (
            <Box className="flex justify-center items-center h-screen">
                <CircularProgress />
            </Box>
        );

    if (!user)
        return (
            <Box className="flex flex-col items-center mt-10">
                <Typography variant="h6" color="error">
                    Unable to load profile.
                </Typography>
            </Box>
        );

    const PlanCard = ({ label, plan, color }) => (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-[30%] transition-all"
        >
            <Card
                onClick={() => handleOpenModal(plan)}
                sx={{
                    cursor: "pointer",
                    borderRadius: "20px",
                    boxShadow: 4,
                    background: color,
                    color: "white",
                    width: "80%",
                    margin: "0 auto",
                    mt: 2,
                    transition: "0.3s",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: 8 },
                }}
            >
                <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                        {label}
                    </Typography>
                    <Divider sx={{ background: "rgba(255,255,255,0.5)", my: 1 }} />
                    {plan ? (
                        <>
                            <Typography variant="subtitle1">{plan.title}</Typography>
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
        </motion.div>
    );

    return (
        <><TopBar />
            <Box className="p-6 flex flex-col gap-8" sx={{ mb: 4, width: '80%' }}>
                {/* HEADER */}
                <Box className="flex justify-between items-center" sx={{ mb: 4, width: '80%' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        My Profile
                    </Typography>
                    <Box className="flex gap-3" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, gap: 5 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/createplan")}
                        >
                            Create New Plan
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate("/allplans")}
                        >
                            View All Plans
                        </Button>
                    </Box>
                </Box>

                {/* USER INFO */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Card sx={{ borderRadius: "20px", boxShadow: 3, p: 2, width: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold">
                                {user.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {user.email}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                                <Tooltip title="Total Tasks Completed">
                                    <Typography>
                                        <b>{user.stats.totalTasksDone}</b> Tasks Done
                                    </Typography>
                                </Tooltip>
                                <Tooltip title="SDE-related tasks done">
                                    <Typography>
                                        <b>{user.stats.sdeTasksDone}</b> SDE Tasks
                                    </Typography>
                                </Tooltip>
                                <Tooltip title="Core-related tasks done">
                                    <Typography>
                                        <b>{user.stats.coreTasksDone}</b> Core Tasks
                                    </Typography>
                                </Tooltip>
                                <Tooltip title="Non-core tasks done">
                                    <Typography>
                                        <b>{user.stats.nonCoreTasksDone}</b> Non-Core Tasks
                                    </Typography>
                                </Tooltip>
                                <Tooltip title="Total Rewards Earned">
                                    <Typography>
                                        <b>{user.stats.totalRewards}</b> Rewards
                                    </Typography>
                                </Tooltip>
                            </Box>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* PLAN CARDS */}
                <Box className="flex flex-col md:flex-row justify-between gap-6">
                    <PlanCard label="Last Plan" plan={user.lastPlan} color="#9C27B0" />
                    <PlanCard label="Today's Plan" plan={user.currentPlan} color="#1976D2" />
                    <PlanCard label="Next Plan" plan={user.nextPlan} color="#2E7D32" />
                </Box>

                {/* AutoFix Notice */}
                {autoFixed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 text-center"
                    >
                        <Typography variant="body2" color="success.main">
                            🔄 Profile auto-updated to reflect latest plan changes!
                        </Typography>
                    </motion.div>
                )}
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

export default ProfilePage;
