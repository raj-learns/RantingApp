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
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [autoFixed, setAutoFixed] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                sx={{
                    borderRadius: "20px",
                    boxShadow: 4,
                    background: color,
                    color: "white",
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
        <Box className="p-6 flex flex-col gap-8">
            {/* HEADER */}
            <Box className="flex justify-between items-center">
                <Typography variant="h4" fontWeight="bold" color="primary">
                    My Profile
                </Typography>
                <Box className="flex gap-3">
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
                <Card sx={{ borderRadius: "20px", boxShadow: 3, p: 2 }}>
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
        </Box>
    );
};

export default ProfilePage;
