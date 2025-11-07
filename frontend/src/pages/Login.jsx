import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Modal,
    Paper,            // Added
    Link,             // Added
    Alert,            // Added
    InputAdornment,  // Added
} from '@mui/material';
import {
    User,       // Added
    Lock,       // Added
    LogIn,      // Added
    CheckCircle // Added
} from 'lucide-react'; // Added
import downloadImg from "../assets/download.jpeg"; // Added

// 🎨 sx prop for consistent white/themed text fields (from CreatePlan)
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
};

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(''); // Changed from 'message'
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        // Cleaned up unused fields
        setFormData({
            email: '',
            password: '',
        })
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear old errors
        const response = await fetch("https://rantingapp.onrender.com/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password
            })
        })
        if (response.status === 200) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            handleOpen();
        } else {
            const err = await response.json();
            setError(err.message); // Set error message
        }
        console.log('Login Data:', formData);
    };

    return (
        // 🎨 Main Layout Wrapper
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper
                elevation={10}
                sx={{
                    // 🎨 Frosted glass form container
                    background: "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(10px)",
                    color: "#ffffff",
                    p: { xs: 3, md: 5 },
                    borderRadius: 4,
                    width: "90%",
                    maxWidth: 450, // Better width for a login form
                    position: "relative",
                    zIndex: 1,
                    textAlign: "center"
                }}
            >
                <Typography variant="h4" gutterBottom color="inherit" mb={4} fontWeight="bold">
                    Login to Your Account
                </Typography>

                {/* 🎨 Error Alert */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2, bgcolor: 'rgba(255, 100, 100, 0.1)', color: 'white' }}
                    >
                        {error}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <TextField
                        type="email"
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        required
                        sx={textFieldSx} // 🎨 Applied themed sx
                        InputProps={{ // 🎨 Added icon
                            startAdornment: (
                                <InputAdornment position="start">
                                    <User style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        type="password"
                        name="password"
                        label="Password"
                        value={formData.password}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        required
                        sx={textFieldSx} // 🎨 Applied themed sx
                        InputProps={{ // 🎨 Added icon
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={!formData.email || !formData.password}
                        startIcon={<LogIn />}
                        // 🎨 Themed gradient button
                        sx={{
                            mt: 2,
                            mb: 3,
                            py: 1.5,
                            borderRadius: 3,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                            "&:hover": {
                                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                            },
                            '&.Mui-disabled': {
                                background: 'rgba(0,0,0,0.12)',
                                color: 'rgba(255,255,255,0.3)'
                            }
                        }}
                    >
                        Login
                    </Button>

                    {/* 🎨 Themed Sign Up Link */}
                    <Typography color="inherit" sx={{ opacity: 0.9 }}>
                        New User?{' '}
                        <Link
                            onClick={() => navigate("/signup")}
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Sign Up
                        </Link>
                    </Typography>
                </Box>
            </Paper>

            {/* 🎨 Styled Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: '90%', sm: 400 },
                        bgcolor: "#ffffff", // Standard white
                        borderRadius: 4,      // Standard radius
                        boxShadow: 24,
                        p: 4,
                        textAlign: "center",
                    }}
                >
                    <CheckCircle size={48} color="#4caf50" style={{ marginBottom: 16 }} />
                    <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight="bold">
                        Login Successful!
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, mb: 3 }} color="text.secondary">
                        Welcome back! We're excited to see your progress.
                    </Typography>
                    <Button
                        variant="contained"
                        fullWidth
                        // 🎨 Consistent gradient button
                        sx={{
                            mb: 2,
                            py: 1.5,
                            borderRadius: 3,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            fontWeight: "bold",
                            "&:hover": {
                                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                            },
                        }}
                        onClick={() => {
                            handleClose();
                            navigate('/todayplan'); // Go to today's plan first
                        }}
                    >
                        My Today's Plan
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{ borderRadius: 3, py: 1.5 }}
                        onClick={() => {
                            handleClose();
                            navigate('/createplan'); // Corrected path
                        }}
                    >
                        Create New Plan
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default Login;