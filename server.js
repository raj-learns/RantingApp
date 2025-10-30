const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const fakeDb = { users: [], posts: [] };
app.use(express.json());
app.get('/', (req, res) => res.send(fakeDb.users));
app.post('/api/signup', async (req, res) => {
    const { email, name, password } = req.body;
    const existingUser = fakeDb.users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Yo man! Email already in use' });
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const newUser = { email, name, password: hash };
    fakeDb.users.push(newUser);
    res.status(201).json({ message: 'User created successfully' });
})

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const existingUser = fakeDb.users.find(u => u.email === email);
    if (existingUser) {
        const match = await bcrypt.compare(password, existingUser.password);
        var token = jwt.sign({ email: existingUser.email, name: existingUser.name }, 'secret-key', { expiresIn: '1h' });
        if (match) {
            return res.status(200).json({ message: 'Yo bro! Login successful', token: token });
        } else {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
    }
    else {
        return res.status(400).json({ message: 'Signup first bro!' });
    }
});

app.post('/api/post', (req, res) => {
    try {
    var decoded = jwt.verify(req.headers.token, 'secret-key');}
    catch(err) {
        return res.status(401).json({ message: "Invalid token. Please login again." });
    }
    if (decoded) {
        postId = req.body.email + Date.now();
        posts = fakeDb.posts.push({ email: req.body.email, postId: postId, post: req.body.content });
        return res.status(201).json({ message: 'Post created successfully', postId: postId });
    }
    else {
        return res.status(401).json({ message: "Yo man! we don't know you. Please login" });
    }
})
app.listen(4000, () => console.log('Server running on port 4000'));