import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Modal } from '@mui/material';

const Login = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
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
            setMessage(data.message);
            //localStorage.setItem('email', data.email);
            localStorage.setItem('token', data.token);
            handleOpen();
            //navigate('/createpost');
        } else {
            const err = await response.json();
            setMessage(err.message);
        }
        console.log('Login Data:', formData);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#155212"
            noValidate
        >
            <Typography variant="h4" gutterBottom color="white" mb="50px">
                Login to Your Account
            </Typography>
            <TextField
                type="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                variant="outlined"
                fullWidth
                required
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                    },
                    '& .MuiInputLabel-root': {
                        color: '#d4c8c8ff',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ccc',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6', // Tailwind blue-500 equivalent
                    },
                }}
            />


            <TextField
                type="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                variant="outlined"
                fullWidth
                required
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                    },
                    '& .MuiInputLabel-root': {
                        color: '#d4c8c8ff',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ccc',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6', // Tailwind blue-500 equivalent
                    },
                }}
            />
            {message && <Typography color="green" mt={2}>{message}</Typography>}



            <Button
                type="submit"
                variant="contained"
                disabled={!formData.email || !formData.password}
                sx={{
                    width: '15%',
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    borderRadius: 3,
                    textTransform: 'none',
                    backgroundColor: '#d2c619ff',
                    '&:hover': {
                        backgroundColor: '#1565c0',
                        boxShadow: '0 4px 12px rgba(25,118,210,0.3)',
                    },
                }}
            >
                Login
            </Button>


            <p className="text-center text-gray-600 text-sm mt-4">
                New User?{' '}
                <a href="/signup" className="text-blue-500 hover:underline">
                    Sign Up
                </a>
            </p>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: '#e49bd4ff', border: '2px solid #000', boxShadow: 24, p: 4, borderRadius: 6 }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2" color='#14b835ff'>
                        You have successfully logged in.
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        To continue, please proceed to create a plan. We are excited to have you back!
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: '#1565c0', '&:hover': { backgroundColor: '#0d47a1' } }}
                        onClick={() => {
                            handleClose();
                            navigate('/createpost');
                        }}
                    >
                        Create Plan
                    </Button>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Or directly jump to your today's plan.
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: '#5c9117ff', '&:hover': { backgroundColor: '#0d47a1' } }}
                        onClick={() => {
                            handleClose();
                            navigate('/todayplan');
                        }}
                    >
                        My Today's Plan
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default Login;
