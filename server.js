import User from './models/Users.js';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import './db.js';
import Post from './models/Posts.js';
import cors from 'cors';
import Plan from './models/Plan.js';

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
        var token = jwt.sign({ _id: existingUser._id, email: existingUser.email, name: existingUser.name }, 'secret-key', { expiresIn: '1h' });
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

app.post('/api/post', async (req, res) => {
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

app.post('/api/plan', async (req, res) => {
    try {
        const decoded = jwt.verify(req.headers.token, 'secret-key');
        if (!decoded) return res.status(401).json({ message: 'Invalid token' });
        const planDate = req.body.planDate ? new Date(req.body.planDate) : new Date();
        const startOfDay = new Date(planDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(planDate.setHours(23, 59, 59, 999));

        const existingPlan = await Plan.findOne({
            user: decoded._id,
            planDate: { $gte: startOfDay, $lte: endOfDay }
        });

        if (existingPlan) {
            return res.status(400).json({ message: "You already have a plan for this day!" });
        }

        const newPlan = new Plan({
            user: decoded._id,
            title: req.body.title,
            planDate,
            tasks: req.body.tasks || []
        });

        await newPlan.save();
        await User.findByIdAndUpdate(decoded._id, { nextPlan: newPlan._id });

        return res.status(201).json({ message: 'Plan created successfully', planId: newPlan._id });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});


app.get('/api/plan/today', async (req, res) => {
    try {
        const decoded = jwt.verify(req.headers.token, 'secret-key');
        if (!decoded) return res.status(401).json({ message: 'Invalid token' });

        const userId = decoded._id;
        if (!userId) {
            return res.status(401).json({ message: 'User ID missing in token' });
        }

        // Get the current day (start and end range)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Find today's plan for this user
        const plan = await Plan.findOne({
            user: userId,
            planDate: { $gte: todayStart, $lte: todayEnd },
        });

        if (!plan) {
            return res.status(404).json({ message: 'No plan found for today.' });
        }

        // Compute quick stats
        const totalTasks = plan.tasks.length;
        const completedTasks = plan.tasks.filter(t => t.completed).length;
        const rewardedTasks = plan.tasks.filter(t => t.completed && t.isRewarded).length;
        const completionRate = totalTasks > 0
            ? ((completedTasks / totalTasks) * 100).toFixed(1)
            : 0;

        res.status(200).json({
            plan,
            stats: {
                totalTasks,
                completedTasks,
                rewardedTasks,
                completionRate: `${completionRate}%`
            },
        });
    } catch (err) {
        console.error('Error fetching today plan:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/plan/:id', async (req, res) => {
    try {
        const decoded = jwt.verify(req.headers.token, 'secret-key');
        if (!decoded) return res.status(401).json({ message: 'Invalid token' });

        const plan = await Plan.findOne({ _id: req.params.id, user: decoded._id });
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        res.status(200).json({ plan });
    } catch (err) {
        console.error('Error fetching plan:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/plan/:id', async (req, res) => {
    try {
        const decoded = jwt.verify(req.headers.token, 'secret-key');
        if (!decoded) return res.status(401).json({ message: 'Invalid token' });

        const { title, planDate, tasks } = req.body;

        const plan = await Plan.findOneAndUpdate(
            { _id: req.params.id, user: decoded._id },
            {
                title,
                planDate: planDate ? new Date(planDate) : undefined,
                tasks,
            },
            { new: true } // return updated plan
        );

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found or unauthorized' });
        }

        res.status(200).json({ message: 'Plan updated successfully', plan });
    } catch (err) {
        console.error('Error updating plan:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/api/myplans', async (req, res) => {
    try {
        const decoded = jwt.verify(req.headers.token, 'secret-key');
        if (!decoded) return res.status(401).json({ message: 'Invalid token' });
        const plans = await Plan.find({ user: decoded._id }).sort({ planDate: 1 });
        return res.status(200).json({ plans });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});


app.patch('/api/plan/:planId/complete', async (req, res) => {
    try {
        const decoded = jwt.verify(req.headers.token, 'secret-key');
        const { planId } = req.params;
        const { taskIds } = req.body;
        const plan = await Plan.findOne({ _id: planId, user: decoded._id });
        if (!plan) {
            return res.status(404).json({ message: "Plan not found or not authorized" });
        }
        let rewardsEarned = 0;
        let fieldCounts = { SDE: 0, Core: 0, "Non-core": 0 };

        plan.tasks.forEach(task => {
            if (taskIds.includes(String(task._id)) && !task.completed) {
                task.completed = true;
                task.completedAt = new Date();

                if (task.isRewarded) rewardsEarned++;
                if (fieldCounts[task.field] !== undefined) fieldCounts[task.field]++;
            }
        });

        await plan.save();
        const totalTasksDone = taskIds.length;

        await User.findOneAndUpdate(
            { _id: decoded._id },
            {
                $inc: {
                    'stats.totalTasksDone': totalTasksDone,
                    'stats.totalRewards': rewardsEarned,
                    'stats.sdeTasksDone': fieldCounts.SDE,
                    'stats.coreTasksDone': fieldCounts.Core,
                    'stats.nonCoreTasksDone': fieldCounts['Non-core']
                }
            }
        );

        return res.status(200).json({
            message: 'Tasks marked as completed successfully',
            rewardsEarned,
            updatedFields: fieldCounts
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});


app.get('/api/myposts', async (req, res) => {
    try {
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