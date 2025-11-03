import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    description: String,
    field : { type: String, enum: ['SDE', 'Non-core', 'Core'] },
    completed: { type: Boolean, default: false },
    isRewarded: { type: Boolean, default: false },
    completedAt: Date,
    expectedDuration: { type: Number, default: 0 }
});

const planSchema = new mongoose.Schema({
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title : String,
    planDate : Date,
    tasks : [taskSchema]
});

const Plan = mongoose.model('Plan', planSchema);
export default Plan;
