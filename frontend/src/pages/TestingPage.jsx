import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

function Post() {
    const [text, setText] = useState("");
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
                value={text}    
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your post here..."
            />
            <Button variant="contained" color="#c6ed93" onClick={() => { }}>
                Submit
            </Button>

        </Box>
    );
}

export default Post;

