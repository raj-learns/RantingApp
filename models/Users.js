import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  lastPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  currentPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  nextPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  stats: {
    totalTasksDone: { type: Number, default: 0 },
    sdeTasksDone: { type: Number, default: 0 },
    coreTasksDone: { type: Number, default: 0 },
    nonCoreTasksDone: { type: Number, default: 0 },
    totalRewards: { type: Number, default: 0 }
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
