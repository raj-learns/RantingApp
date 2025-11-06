import React, { useState, useEffect } from "react";
import TopBar from "../components/Topbar";
import NewDefault from "../assets/bluebg.png"
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
    Card,
    CardContent,
    Grid,
    Avatar,
    Snackbar,
    Alert
} from "@mui/material";
import {
    CheckCircle,
    Circle,
    Trophy,
    Calendar,
    Clock,
    BookText
} from "lucide-react";
import downloadImg from "../assets/download.jpeg";



const TodayPlan = () => {
    const [plan, setPlan] = useState(null);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchTodayPlan = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("https://rantingapp.onrender.com/api/plan/today", {
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
            const res = await fetch(`https://rantingapp.onrender.com/api/plan/${plan._id}/complete`, {
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
                setSnackbarOpen(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

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
                        Loading your plan...
                    </Typography>
                    <LinearProgress sx={{ mt: 2, borderRadius: 2 }} />
                </Paper>
            </Box>
        );

    if (!plan)
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
                            No Plan Found
                        </Typography>
                        <Typography variant="body1" color="#63461aff" sx={{ mt: 2 }}>
                            No plan found for today. Create one to get started!
                        </Typography>
                    </Paper>
                </Box>
            </>
        );

    return (
        <>
            <TopBar />
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
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        maxWidth: 1000,
                        mx: "auto",
                    }}
                >
                    {/* Header Card */}
                    <Paper
                        elevation={10}
                        sx={{
                            p: 4,
                            mb: 3,
                            borderRadius: 4,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            {plan.title}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                            <Calendar size={18} />
                            <Typography variant="h6">
                                {new Date(plan.planDate).toDateString()}
                            </Typography>
                        </Box>
                    </Paper>

                    {/* Stats Cards */}
                    <Grid container spacing={38} sx={{ mb: 3 }}>
                        <Grid container spacing={3} alignItems="stretch">
                            <Card
                                elevation={8}
                                sx={{
                                    background: "rgba(255, 255, 255, 0.2)",
                                    backdropFilter: "blur(10px)",
                                    borderRadius: 3,
                                    transition: "transform 0.3s",
                                    "&:hover": { transform: "translateY(-5px)" },
                                }}
                            >
                                <CardContent sx={{ textAlign: "center" }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: "#4caf50",
                                            width: 60,
                                            height: 60,
                                            mx: "auto",
                                            mb: 2,
                                        }}
                                    >
                                        <CheckCircle size={30} />
                                    </Avatar>
                                    <Typography variant="h4" fontWeight="bold" color="#4caf50">
                                        {stats.completedTasks}
                                    </Typography>
                                    <Typography variant="body2" color="#ffffff">
                                        Completed Tasks
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid container spacing={3} alignItems="stretch">
                            <Card
                                elevation={8}
                                sx={{
                                    background: "rgba(255, 255, 255, 0.2)",
                                    backdropFilter: "blur(10px)",
                                    borderRadius: 3,
                                    transition: "transform 0.3s",
                                    "&:hover": { transform: "translateY(-5px)" },
                                }}
                            >
                                <CardContent sx={{ textAlign: "center" }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: "#2196f3",
                                            width: 60,
                                            height: 60,
                                            mx: "auto",
                                            mb: 2,
                                        }}
                                    >
                                        <BookText size={30} />
                                    </Avatar>
                                    <Typography variant="h4" fontWeight="bold" color="#2196f3">
                                        {stats.totalTasks}
                                    </Typography>
                                    <Typography variant="body2" color="#ffffff">
                                        Total Tasks
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid container spacing={3} alignItems="stretch">
                            <Card
                                elevation={8}
                                sx={{
                                    background: "rgba(255, 255, 255, 0.2)",
                                    backdropFilter: "blur(10px)",
                                    borderRadius: 3,
                                    transition: "transform 0.3s",
                                    "&:hover": { transform: "translateY(-5px)" },
                                }}
                            >
                                <CardContent sx={{ textAlign: "center" }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: "#ff9800",
                                            width: 60,
                                            height: 60,
                                            mx: "auto",
                                            mb: 2,
                                        }}
                                    >
                                        <Trophy size={18} />
                                    </Avatar>
                                    <Typography variant="h4" fontWeight="bold" color="#ff9800">
                                        {stats.rewardedTasks}
                                    </Typography>
                                    <Typography variant="body2" color="#ffffff">
                                        Rewards Earned
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Progress Card */}
                    <Paper
                        elevation={10}
                        sx={{
                            p: 3,
                            mb: 3,
                            borderRadius: 4,
                            background: "rgba(255, 255, 255, 0.3)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <Typography variant="h6" gutterBottom fontWeight="bold" color="#ffffffff">
                            Overall Progress
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={parseFloat(stats.completionRate)}
                                    sx={{
                                        height: 12,
                                        borderRadius: 6,
                                        bgcolor: "#ffffff",
                                        "& .MuiLinearProgress-bar": {
                                            borderRadius: 6,
                                            background: (() => {
                                                const value = parseFloat(stats.completionRate);

                                                if (value === 0) return "#ffffff"; 
                                                if (value < 50) return "#ffeb3b"; 
                                                if (value < 100) return "#ff9800";
                                                return "#4caf50"; 
                                            })(),
                                            transition: "background 0.3s ease",
                                        },
                                    }}
                                />

                            </Box>
                            <Typography variant="h6" fontWeight="bold" color="#ffffff">
                                {stats.completionRate}
                            </Typography>
                        </Box>
                    </Paper>

                    {/* Tasks Card */}
                    <Paper
                        elevation={10}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            background: "rgba(255, 255, 255, 0.3)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <Typography variant="h5" gutterBottom fontWeight="bold" color="#ffffff" sx={{ mb: 3 }}>
                            Your Tasks
                        </Typography>

                        {plan.tasks.map((task, index) => (
                            <Card
                                key={task._id}
                                elevation={task.completed ? 2 : 6}
                                sx={{
                                    mb: 2,
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    transition: "all 0.3s",
                                    border: task.completed ? "2px solid #4caf50" : "2px solid transparent",
                                    background: task.completed
                                        ? "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)"
                                        : `#eee8aa`,
                                    "&:hover": {
                                        transform: "translateX(5px)",
                                        boxShadow: task.completed ? 4 : 12,
                                    },
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: task.completed ? "#4caf50" : "#63461aff",
                                                width: 45,
                                                height: 45,
                                            }}
                                        >
                                            {task.completed ? (
                                                <CheckCircle />
                                            ) : (
                                                <Typography fontWeight="bold">{index + 1}</Typography>
                                            )}
                                        </Avatar>

                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                variant="h6"
                                                fontWeight="bold"
                                                sx={{
                                                    textDecoration: task.completed ? "line-through" : "none",
                                                    color: task.completed ? "#4caf50" : "#63461aff",
                                                }}
                                            >
                                                {task.description}
                                            </Typography>

                                            <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
                                                <Chip
                                                    label={task.field}
                                                    size="small"
                                                    variant="outlined"
                                                    color="#63461aff"
                                                />
                                                <Chip
                                                    icon={<Clock />}
                                                    label={`${task.expectedDuration || "N/A"} hrs`}
                                                    size="small"
                                                    variant="outlined"
                                                    color="#63461aff"
                                                />
                                            </Box>

                                            {!task.completed && (
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            onChange={() => handleMarkDone(task._id)}
                                                            sx={{
                                                                color: "#63461aff",
                                                                "&.Mui-checked": { color: "#4caf50" },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Typography fontWeight="500" color="#63461aff">
                                                            Mark as Done
                                                        </Typography>
                                                    }
                                                    sx={{ mt: 1 }}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius: 3,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                fontWeight: "bold",
                                fontSize: "1.1rem",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                                    transform: "translateY(-2px)",
                                    boxShadow: 8,
                                },
                                transition: "all 0.3s",
                            }}
                            onClick={() => window.location.reload()}
                        >
                            Refresh Stats
                        </Button>
                    </Paper>
                </Box>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Task marked as completed!
                </Alert>
            </Snackbar>

        </>
    );
};

export default TodayPlan;