import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, MenuItem, Checkbox, FormControlLabel, Modal } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/Topbar";

const CreatePlan = ({ mode }) => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [planDate, setPlanDate] = useState("");
    const [currentPlanDate, setCurrentPlanDate] = useState("");
    const [tasks, setTasks] = useState([
        { description: "", field: "SDE", expectedDuration: "", isRewarded: false },
    ]);
    const [plannedDates, setPlannedDates] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (mode === 'edit' && id) {
            const fetchPlan = async () => {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:4000/api/plan/${id}`, {
                    headers: { token },
                });
                const data = await res.json();
                if (res.ok) {
                    setTitle(data.plan.title || '');
                    setPlanDate(data.plan.planDate?.split("T")[0] || "");
                    setCurrentPlanDate(data.plan.planDate?.split("T")[0] || "");
                    setTasks(data.plan.tasks || []);
                }
            };
            fetchPlan();
        }
    }, [mode, id]);

    useEffect(() => {
        const fetchPlannedDates = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('http://localhost:4000/api/myplans', {
                    headers: { 'token': token }
                });
                const data = await res.json();
                if (res.ok) {
                    const dates = data.plans.map(plan =>
                        new Date(plan.planDate).toISOString().split("T")[0]
                    );
                    setPlannedDates(dates);
                }
            } catch (err) {
                console.error("Error fetching planned dates:", err);
            }
        };
        fetchPlannedDates();
    }, []);


    const handleTaskChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const updatedTasks = [...tasks];
        updatedTasks[index][name] = type === "checkbox" ? checked : value;
        setTasks(updatedTasks);
    };

    const addTask = () => {
        setTasks([
            ...tasks,
            { description: "", field: "SDE", expectedDuration: "", isRewarded: false },
        ]);
    };

    const removeTask = (index) => {
        const updated = [...tasks];
        updated.splice(index, 1);
        setTasks(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const url =
                mode === 'edit'
                    ? `http://localhost:4000/api/plan/${id}`
                    : 'http://localhost:4000/api/plan';
            const method = mode === 'edit' ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    token,
                },
                body: JSON.stringify({ title, planDate, tasks }),
            });

            const data = await response.json();
            if (response.status === 201) {
                setOpenModal(true);
            }
            else if (response.status === 200) {
                setOpenModal(true);
            } else {
                alert(data.message);
            }

        } catch (err) {
            console.error("Error creating plan:", err);
            alert("Server error while creating plan.");
        }
    };
    const isDateBlocked =
        plannedDates.includes(planDate) && planDate !== currentPlanDate;


    return (
        <>
            <TopBar />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#e9f5ff",
                    minHeight: "100vh",
                    py: 6,
                }}
            >
                <Box
                    sx={{
                        bgcolor: "white",
                        p: 5,
                        borderRadius: 4,
                        boxShadow: 4,
                        width: "90%",
                        maxWidth: 700,
                    }}
                >
                    <Typography variant="h4" gutterBottom color="#3722c0ff" mb="50px">
                        {mode === 'edit' ? '✏️ Edit Plan' : '🗓 Create a New Plan'}
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Plan Title"
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 2 }}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Plan Date"
                            type="date"
                            value={planDate}
                            onChange={(e) => setPlanDate(e.target.value)}
                            sx={{ mb: 3 }}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                                min: new Date().toISOString().split("T")[0],
                            }}
                            error={isDateBlocked}
                            helperText={
                                isDateBlocked
                                    ? "You already have a plan for this day! Go and edit instead."
                                    : ""
                            }

                        />

                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Tasks
                        </Typography>

                        {tasks.map((task, index) => (
                            <Box
                                key={index}
                                sx={{
                                    border: "1px solid #ccc",
                                    borderRadius: 3,
                                    p: 2,
                                    mb: 2,
                                    bgcolor: "#f9f9f9",
                                }}
                            >
                                <TextField
                                    label="Task Description"
                                    name="description"
                                    value={task.description}
                                    onChange={(e) => handleTaskChange(index, e)}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    select
                                    label="Field"
                                    name="field"
                                    value={task.field}
                                    onChange={(e) => handleTaskChange(index, e)}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                >
                                    <MenuItem value="SDE">SDE</MenuItem>
                                    <MenuItem value="Core">Core</MenuItem>
                                    <MenuItem value="Non-core">Non-core</MenuItem>
                                </TextField>

                                <TextField
                                    label="Expected Duration (hrs)"
                                    name="expectedDuration"
                                    value={task.expectedDuration}
                                    onChange={(e) => handleTaskChange(index, e)}
                                    fullWidth
                                    type="number"
                                    sx={{ mb: 2 }}
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={task.isRewarded}
                                            name="isRewarded"
                                            onChange={(e) => handleTaskChange(index, e)}
                                        />
                                    }
                                    label="Reward Task"
                                />

                                {tasks.length > 1 && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        sx={{ mt: 1 }}
                                        onClick={() => removeTask(index)}
                                    >
                                        Remove Task
                                    </Button>
                                )}
                            </Box>
                        ))}

                        <Button
                            variant="outlined"
                            sx={{ mb: 3, mt: 1 }}
                            onClick={addTask}
                        >
                            + Add Another Task
                        </Button>

                        <Button type="submit" variant="contained" fullWidth disabled={isDateBlocked}>
                            Submit Plan
                        </Button>
                    </form>
                    <Modal
                        open={openModal}
                        onClose={() => {
                            setOpenModal(false);
                            navigate('/todayplan');
                        }}
                        aria-labelledby="plan-created-modal"
                        aria-describedby="motivational-message"
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 400,
                                bgcolor: "#fff",
                                borderRadius: 3,
                                boxShadow: 24,
                                p: 4,
                                textAlign: "center",
                            }}
                        >
                            <Typography id="plan-created-modal" variant="h6" component="h2" mb={2}>
                                🌟 Great Job!
                            </Typography>
                            <Typography id="motivational-message" mb={3}>
                                You’ve just created a new plan for your success. Keep the consistency alive — one step at a time!
                            </Typography>

                            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/allplans')}
                                >
                                    View All Plans
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    onClick={() => navigate('/todayplan')}
                                >
                                    Go to Today’s Plan
                                </Button>
                            </Box>
                        </Box>
                    </Modal>

                </Box>
            </Box>
        </>
    );
};

export default CreatePlan;
