import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    email: String,
    postId: { type: String, unique: true },
    post: String
});

const Post = mongoose.model('Post', postSchema);

export default Post;