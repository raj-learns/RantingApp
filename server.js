import User from './models/Users.js';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import './db.js';
import Post from './models/Posts.js';
import cors from 'cors';
import Plan from './models/Plan.js';
import Notification from './models/Notification.js';

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

app.post('/api/notification', async (req, res) => {
    const createdAt = Date.now();
    const notificationData = { message: req.body.message, createdAt: createdAt, dealdLine: req.body.dealdLine, applyLink: req.body.applyLink }
    const newNotification = new Notification(notificationData);
    await newNotification.save();
    return res.status(201).json({ message: 'Notification added successfully', notificationData: newNotification })
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
            planDate: { $gte: startOfDay, $lte: endOfDay },
        });
        if (existingPlan) {
            return res.status(400).json({ message: "You already have a plan for this day!" });
        }

        const newPlan = new Plan({
            user: decoded._id,
            title: req.body.title,
            planDate,
            tasks: req.body.tasks || [],
        });
        await newPlan.save();

        const now = new Date();
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        const todayEnd = new Date(now.setHours(23, 59, 59, 999));

        const user = await User.findById(decoded._id);
        let updates = {};

        if (planDate >= todayStart && planDate <= todayEnd) {
            if (user.currentPlan) updates.lastPlan = user.currentPlan;
            updates.currentPlan = newPlan._id;
            updates.nextPlan = user.nextPlan;
        }
        else if (planDate > todayEnd) {
            updates.nextPlan = newPlan._id;
        }
        else {
            updates.lastPlan = newPlan._id;
        }
        const planIds = [updates.lastPlan, updates.currentPlan, updates.nextPlan].filter(Boolean);
        if (planIds.length > 1) {
            updates.lastPlan = planIds[0];
            if (planIds[1]) updates.currentPlan = planIds[1];
            if (planIds[2]) updates.nextPlan = planIds[2];
        }

        await User.findByIdAndUpdate(decoded._id, updates);

        return res.status(201).json({
            message: 'Plan created successfully and user plan pointers updated',
            planId: newPlan._id,
            updates,
        });

    } catch (err) {
        console.error('Error creating plan:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});



app.post("/api/follow/:userId", async (req, res) => {
    try {
        const decoded = jwt.verify(req.headers.token, "secret-key");
        if (!decoded) return res.status(401).json({ message: "Invalid token" });

        const targetUserId = req.params.userId;
        if (decoded._id === targetUserId)
            return res.status(400).json({ message: "You can’t follow yourself" });

        const user = await User.findById(decoded._id);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) return res.status(404).json({ message: "User not found" });

        const isAlreadyFollowing = user.following.includes(targetUserId);

        if (isAlreadyFollowing) {
            await User.findByIdAndUpdate(decoded._id, { $pull: { following: targetUserId } });
            await User.findByIdAndUpdate(targetUserId, { $pull: { followers: decoded._id } });
            return res.status(200).json({ message: `Unfollowed ${targetUser.name}` });
        } else {
            await User.findByIdAndUpdate(decoded._id, { $addToSet: { following: targetUserId } });
            await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: decoded._id } });
            return res.status(200).json({ message: `You are now following ${targetUser.name}` });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/api/profile", async (req, res) => {
    try {
        const decoded = jwt.verify(req.headers.token, "secret-key");
        if (!decoded) return res.status(401).json({ message: "Invalid token" });

        const user = await User.findById(decoded._id)
            .populate("lastPlan currentPlan nextPlan", "title planDate")
            .select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        const now = new Date();
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        const todayEnd = new Date(now.setHours(23, 59, 59, 999));

        let updates = {};

        if (user.currentPlan && new Date(user.currentPlan.planDate) < todayStart) {
            updates.lastPlan = user.currentPlan._id;
            updates.currentPlan = null;
        }

        if (
            user.nextPlan &&
            new Date(user.nextPlan.planDate) >= todayStart &&
            new Date(user.nextPlan.planDate) <= todayEnd
        ) {
            updates.currentPlan = user.nextPlan._id;
            updates.nextPlan = null;
        }

        if (user.nextPlan && new Date(user.nextPlan.planDate) < todayStart) {
            updates.lastPlan = user.nextPlan._id;
            updates.nextPlan = null;
        }

        if (!user.currentPlan) {
            const todayPlan = await Plan.findOne({
                user: user._id,
                planDate: { $gte: todayStart, $lte: todayEnd },
            });
            if (todayPlan) updates.currentPlan = todayPlan._id;
        }

        if (Object.keys(updates).length > 0) {
            await User.findByIdAndUpdate(user._id, updates);
            const refreshedUser = await User.findById(user._id)
                .populate("lastPlan currentPlan nextPlan", "title planDate")
                .select("-password");
            return res.status(200).json({ user: refreshedUser, autoFixed: true });
        }

        res.status(200).json({ user, autoFixed: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/api/notifications", async (req, res) => {
    try {
        const notifications = await Notification.find();

        const today = new Date();

        // Process notifications
        const validNotifications = notifications
            .map((n) => {
                const createdAt = new Date(n.createdAt);
                let deadline = n.deadLine ? new Date(n.deadLine) : null;

                // Assign 10 days deadline if missing
                if (!deadline || isNaN(deadline.getTime())) {
                    deadline = new Date(createdAt.getTime() + 10 * 24 * 60 * 60 * 1000);
                }

                return {
                    ...n.toObject(),
                    deadLine: deadline
                };
            })
            .filter((n) => new Date(n.deadLine) >= today) // Only future deadlines
            .sort((a, b) => new Date(a.deadLine) - new Date(b.deadLine)); // Sort soonest first

        res.status(200).json({ notifications: validNotifications });

    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ message: "Server error" });
    }
});


app.get("/api/user/:userId", async (req, res) => {
    try {
        const decoded = jwt.verify(req.headers.token, "secret-key");
        if (!decoded) return res.status(401).json({ message: "Invalid token" });

        const targetUserId = req.params.userId;
        const targetUser = await User.findById(targetUserId)
            .populate("lastPlan currentPlan nextPlan", "title planDate")
            .select("-password");

        if (!targetUser) return res.status(404).json({ message: "User not found" });

        const recentPlans = await Plan.find({ user: targetUserId })
            .sort({ planDate: -1 })
            .limit(3)
            .select("title planDate tasks");

        const recentPosts = await Post.find({ email: targetUser.email })
            .sort({ _id: -1 })
            .limit(3)
            .select("post createdAt");

        const isFollowing = await User.exists({
            _id: decoded._id,
            following: targetUserId,
        });

        res.status(200).json({
            user: {
                _id: targetUser._id,
                name: targetUser.name,
                email: targetUser.email,
                stats: targetUser.stats,
                followersCount: targetUser.followers.length,
                followingCount: targetUser.following.length,
                lastPlan: targetUser.lastPlan,
                currentPlan: targetUser.currentPlan,
                nextPlan: targetUser.nextPlan,
            },
            recentPlans,
            recentPosts,
            isFollowing: !!isFollowing,
        });
    } catch (err) {
        console.error("Error fetching user profile:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/api/users/search", async (req, res) => {
    try {
        const decoded = jwt.verify(req.headers.token, "secret-key");
        if (!decoded) return res.status(401).json({ message: "Invalid token" });

        const query = req.query.q?.trim();
        if (!query) return res.status(400).json({ message: "Search query required" });

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
            ],
        })
            .select("name email followers following stats")
            .limit(10);

        res.status(200).json({ results: users });
    } catch (err) {
        console.error("Error searching users:", err);
        res.status(500).json({ message: "Server error" });
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
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const plan = await Plan.findOne({
            user: userId,
            planDate: { $gte: todayStart, $lte: todayEnd },
        });

        if (!plan) {
            return res.status(404).json({ message: 'No plan found for today.' });
        }

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


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
