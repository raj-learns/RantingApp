import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    message : String,
    createdAt : Date,
    deadLine : Date,
    applyLink : String
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;