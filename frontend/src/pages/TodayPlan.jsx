import React, { useState, useEffect } from "react";
import TopBar from "../components/Topbar";
import {
    Box,
    Typography,
    LinearProgress,
    Button,
    Checkbox,
    FormControlLabel,
    Paper,
    Divider,
    Chip,
} from "@mui/material";

const TodayPlan = () => {
    const [plan, setPlan] = useState(null);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch today's plan
    useEffect(() => {
        const fetchTodayPlan = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://localhost:4000/api/plan/today", {
                    headers: { token },
                });
                const data = await res.json();
                if (res.status === 200) {
                    setPlan(data.plan);
                    setStats(data.stats);
                } else {
                    setPlan(null);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTodayPlan();
    }, []);

    // Handle marking tasks done
    const handleMarkDone = async (taskId) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:4000/api/plan/${plan._id}/complete`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    token,
                },
                body: JSON.stringify({ taskIds: [taskId] }),
            });

            if (res.status === 200) {
                const updatedPlan = {
                    ...plan,
                    tasks: plan.tasks.map((task) =>
                        task._id === taskId ? { ...task, completed: true } : task
                    ),
                };
                setPlan(updatedPlan);
                alert("Task marked as completed!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading)
        return (
            <Typography
                variant="h5"
                align="center"
                sx={{ mt: 10, color: "#777" }}
            >
                Loading your plan...
            </Typography>
        );

    if (!plan)
        return (
            <Typography
                variant="h5"
                align="center"
                sx={{ mt: 10, color: "#777" }}
            >
                No plan found for today. Create one to get started!
            </Typography>
        );

    return (
        <><TopBar />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "100vh",
                    bgcolor: "#eef6fb",
                    py: 6,
                }}
            >
                <Paper
                    elevation={5}
                    sx={{
                        width: "90%",
                        maxWidth: 800,
                        p: 4,
                        borderRadius: 4,
                        background: "#fff",
                    }}
                >
                    <Typography variant="h4" textAlign="center" color="#1976d2" gutterBottom>
                        {plan.title}
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        textAlign="center"
                        sx={{ mb: 3, color: "#555" }}
                    >
                        Plan Date: {new Date(plan.planDate).toDateString()}
                    </Typography>

                    <Divider sx={{ mb: 3 }}>
                        <Chip label="Today's Progress" color="primary" />
                    </Divider>

                    <Box sx={{ mb: 3 }}>
                        <Typography gutterBottom>Completion: {stats.completionRate}</Typography>
                        <LinearProgress
                            variant="determinate"
                            value={parseFloat(stats.completionRate)}
                            sx={{ height: 10, borderRadius: 2 }}
                        />
                        <Typography sx={{ mt: 1, color: "#888" }}>
                            {stats.completedTasks}/{stats.totalTasks} tasks completed • 🎁{" "}
                            {stats.rewardedTasks} rewards
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Typography variant="h6" gutterBottom>
                        Tasks:
                    </Typography>

                    {plan.tasks.map((task) => (
                        <Box
                            key={task._id}
                            sx={{
                                border: "1px solid #ddd",
                                borderRadius: 3,
                                p: 2,
                                mb: 2,
                                backgroundColor: task.completed ? "#d4edda" : "#fff",
                                transition: "0.3s",
                            }}
                        >
                            <Typography variant="body1" fontWeight="bold">
                                {task.description}
                            </Typography>
                            <Typography variant="body2" color="#777">
                                Field: {task.field} | Duration: {task.expectedDuration || "N/A"} hrs
                            </Typography>

                            {!task.completed && (
                                <FormControlLabel
                                    control={<Checkbox onChange={() => handleMarkDone(task._id)} />}
                                    label="Mark as Done"
                                />
                            )}
                        </Box>
                    ))}

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                        onClick={() => window.location.reload()}
                    >
                        Refresh Stats
                    </Button>
                </Paper>
            </Box>
        </>
    );
};

export default TodayPlan;
