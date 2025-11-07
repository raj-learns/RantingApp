import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Modal,
    Paper, // Added
    IconButton, // Added
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/Topbar";
import downloadImg from "../assets/download.jpeg"; // Added
import {
    Plus,       // Added
    Trash2,     // Added
    Send,       // Added
    CheckCircle, // Added
} from "lucide-react"; // Added

// 🎨 sx prop for consistent white/themed text fields
const textFieldSx = {
    mb: 2,
    '& label': { color: '#e0e0e0' },
    '& label.Mui-focused': { color: '#ffffff' },
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.8)' },
        '&.Mui-focused fieldset': { borderColor: '#ffffff' },
    },
    '& .MuiInputBase-input': {
        color: '#ffffff',
    },
    '& .MuiSelect-icon': { // For dropdown
        color: 'rgba(255, 255, 255, 0.7)',
    }
};

// 🎨 sx prop for date field (to style the calendar icon)
const dateFieldSx = {
    ...textFieldSx,
    '& [type="date"]::-webkit-calendar-picker-indicator': {
        filter: 'invert(1) opacity(0.7)',
    }
};

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

    // ... (All your existing useEffect and handler logic remains unchanged) ...
    // ... (useEffect for fetchPlan) ...
    useEffect(() => {
        if (mode === 'edit' && id) {
            const fetchPlan = async () => {
                const token = localStorage.getItem('token');
                const res = await fetch(`https://rantingapp.onrender.com/api/plan/${id}`, {
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

    // ... (useEffect for fetchPlannedDates) ...
    useEffect(() => {
        const fetchPlannedDates = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('https://rantingapp.onrender.com/api/myplans', {
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

    // ... (handleTaskChange) ...
    const handleTaskChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const updatedTasks = [...tasks];
        updatedTasks[index][name] = type === "checkbox" ? checked : value;
        setTasks(updatedTasks);
    };

    // ... (addTask) ...
    const addTask = () => {
        setTasks([
            ...tasks,
            { description: "", field: "SDE", expectedDuration: "", isRewarded: false },
        ]);
    };

    // ... (removeTask) ...
    const removeTask = (index) => {
        const updated = [...tasks];
        updated.splice(index, 1);
        setTasks(updated);
    };

    // ... (handleSubmit) ...
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const url =
                mode === 'edit'
                    ? `https://rantingapp.onrender.com/api/plan/${id}`
                    : 'https://rantingapp.onrender.com/api/plan';
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
                    display: "flex", // Added
                    alignItems: "center", // Added
                    justifyContent: "center", // Added
                }}
            >
                {/* 🎨 Frosted Glass Form Container */}
                <Paper
                    elevation={10}
                    sx={{
                        background: "rgba(255, 255, 255, 0.3)",
                        backdropFilter: "blur(10px)",
                        color: "#ffffff", // Cascade white text
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        boxShadow: 4,
                        width: "90%",
                        maxWidth: 700,
                        position: "relative", // For zIndex
                        zIndex: 1, // Ensure it's above the overlay
                    }}
                >
                    <Typography variant="h4" gutterBottom color="inherit" mb={4}>
                        {mode === 'edit' ? '✏️ Edit Plan' : '🗓 Create a New Plan'}
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Plan Title"
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={textFieldSx} // 🎨 Applied themed sx
                            required
                        />

                        <TextField
                            fullWidth
                            label="Plan Date"
                            type="date"
                            value={planDate}
                            onChange={(e) => setPlanDate(e.target.value)}
                            sx={dateFieldSx} // 🎨 Applied themed sx for date
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
                            FormHelperTextProps={{ // 🎨 Style helper text
                                sx: { color: isDateBlocked ? '#ffcdd2' : 'rgba(255,255,255,0.7)' }
                            }}
                        />

                        <Typography variant="h6" sx={{ mb: 2, mt: 2, color: 'inherit' }}>
                            Tasks
                        </Typography>

                        {tasks.map((task, index) => (
                            <Box
                                key={index}
                                sx={{
                                    // 🎨 Inset dark frosted box
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    bgcolor: "rgba(0, 0, 0, 0.15)",
                                    borderRadius: 3,
                                    p: 2,
                                    mb: 2,
                                    position: 'relative'
                                }}
                            >
                                {tasks.length > 1 && (
                                    <IconButton
                                        aria-label="Remove task"
                                        color="error"
                                        onClick={() => removeTask(index)}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            bgcolor: 'rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </IconButton>
                                )}
                                <TextField
                                    label="Task Description"
                                    name="description"
                                    value={task.description}
                                    onChange={(e) => handleTaskChange(index, e)}
                                    fullWidth
                                    required
                                    sx={{ ...textFieldSx, mt: 1 }} // 🎨 Themed
                                />

                                <TextField
                                    select
                                    label="Field"
                                    name="field"
                                    value={task.field}
                                    onChange={(e) => handleTaskChange(index, e)}
                                    fullWidth
                                    sx={textFieldSx} // 🎨 Themed
                                    SelectProps={{ // 🎨 Style the dropdown menu
                                        MenuProps: {
                                            PaperProps: {
                                                sx: {
                                                    bgcolor: '#333',
                                                    color: '#fff'
                                                }
                                            }
                                        }
                                    }}
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
                                    sx={{...textFieldSx, mb: 1}} // 🎨 Themed
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={task.isRewarded}
                                            name="isRewarded"
                                            onChange={(e) => handleTaskChange(index, e)}
                                            // 🎨 Themed checkbox
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                '&.Mui-checked': { color: '#4caf50' }, // Green from TodayPlan
                                            }}
                                        />
                                    }
                                    label="Reward Task"
                                    sx={{ color: 'inherit' }} // 🎨 White text
                                />
                            </Box>
                        ))}

                        <Button
                            variant="outlined"
                            color="inherit" // 🎨 White button
                            sx={{ mb: 3, mt: 1, borderRadius: 2 }}
                            onClick={addTask}
                            startIcon={<Plus />}
                        >
                            Add Another Task
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isDateBlocked}
                            startIcon={<Send />}
                            // 🎨 Themed gradient button
                            sx={{
                                py: 1.5,
                                borderRadius: 3,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                fontWeight: "bold",
                                fontSize: "1.1rem",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                                },
                                '&.Mui-disabled': { // Style for disabled
                                    background: 'rgba(0,0,0,0.12)',
                                    color: 'rgba(255,255,255,0.3)'
                                }
                            }}
                        >
                            {mode === 'edit' ? 'Update Plan' : 'Submit Plan'}
                        </Button>
                    </form>

                    {/* 🎨 Styled Modal */}
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
                                width: { xs: '90%', sm: 400 },
                                bgcolor: "#ffffff", // White background
                                borderRadius: 4,    // Consistent radius
                                boxShadow: 24,
                                p: 4,
                                textAlign: "center",
                            }}
                        >
                            <CheckCircle size={48} color="#4caf50" style={{ marginBottom: 16 }} />
                            <Typography id="plan-created-modal" variant="h6" component="h2" mb={2} fontWeight="bold">
                                {mode === 'edit' ? 'Plan Updated!' : '🌟 Great Job!'}
                            </Typography>
                            <Typography id="motivational-message" mb={3} color="text.secondary">
                                {mode === 'edit'
                                 ? 'Your plan has been successfully updated. Keep up the momentum!'
                                 : 'You’ve just created a new plan for your success. Keep the consistency alive!'
                                }
                            </Typography>

                            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/allplans')}
                                    // 🎨 Consistent gradient button
                                    sx={{
                                        borderRadius: 2,
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                                        },
                                    }}
                                >
                                    View All Plans
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{ borderRadius: 2 }}
                                    onClick={() => navigate('/todayplan')}
                                >
                                    Go to Today’s Plan
                                </Button>
                            </Box>
                        </Box>
                    </Modal>

                </Paper>
            </Box>
        </>
    );
};

export default CreatePlan;