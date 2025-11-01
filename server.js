import User from './models/Users.js';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import './db.js';
import Post from './models/Posts.js';
import cors from 'cors';

const app = express();
const saltRounds = 10;
const fakeDb = { users: [], posts: [] };
app.use(express.json());
app.use(cors());
app.get('/', async (req, res) => {
    const users = await User.find();
    res.send(users);
});
app.post('/api/signup', async (req, res) => {
    const { email, name, password } = req.body;
    const existingUser = await User.findOne({ email })
    //const existingUser = fakeDb.users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Yo man! Email already in use' });
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const newUser = { email, name, password: hash };
    const data = new User(newUser);
    await data.save();
    res.status(201).json({ message: 'User created successfully' });
})

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        const match = await bcrypt.compare(password, existingUser.password);
        var token = jwt.sign({ email: existingUser.email, name: existingUser.name }, 'secret-key', { expiresIn: '1h' });
        if (match) {
            return res.status(200).json({ message: 'Yo bro! Login successful', token: token, name: existingUser.name });
        } else {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
    }
    else {
        return res.status(400).json({ message: 'Signup first bro!' });
    }
});

app.post('/api/post', async(req, res) => {
    try {
        var decoded = jwt.verify(req.headers.token, 'secret-key');
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token. Please login again." });
    }
    if (decoded) {
        const postId = decoded.email + Date.now();
        const postdata = { email: decoded.email, postId: postId, post: req.body.content };
        const newPost = new Post(postdata);
        await newPost.save();
        await User.findOneAndUpdate(
            { email: decoded.email },
            { $push: { posts: newPost._id } }
        );
        return res.status(201).json({ message: 'Post created successfully', postId: postId });
    }
    else {
        return res.status(401).json({ message: "Yo man! we don't know you. Please login" });
    }
})

app.get('/api/myposts', async(req, res) => {
    try{
        var decoded = jwt.verify(req.headers.token, 'secret-key');
    } catch (err) {
        return res.status(401).json({ message: "Invalid token. Please login again." });
    }
    if (decoded) {
        const user = await User.findOne({ email: decoded.email }).populate('posts');
        return res.status(200).json({ posts: user.posts });
    } else {
        return res.status(401).json({ message: "Yo man! we don't know you. Please login" });
    }
})
app.listen(4000, () => console.log('Server running on port 4000'));