import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';

const CreatePost = () => {
     const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch("http://localhost:4000/api/post", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                body: JSON.stringify({
                    email: localStorage.getItem('email'),
                    content: content
                })
            });
            const data = await response.json();
            if (response.status === 201) {
                alert(data.message);
            } else {
                alert(data.message);
            }
            setContent('');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('An error occurred while creating the post. Please try again.');
        }
    };

    return (

        <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#155212"
            noValidate
            autoComplete="off"
        >
            <Typography variant="h4" gutterBottom color="white" mb="50px">
                Create a Post
            </Typography>
            <TextField
                variant="filled"
                multiline
                maxRows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post here..."
            />
            <Button variant="contained" color="#9aa887" onClick={handleSubmit}>
                Submit
            </Button>
            <Button variant="contained" color="#9aa887" sx={{ mt: 2 }} onClick={() => navigate('/myposts')}>
                See your posts
            </Button>

        </Box>
    );
};

export default CreatePost;
