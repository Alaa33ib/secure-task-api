import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    "title": {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    "priority":{
        type: String,
        required: true,
        enum:{
            values: ['high', 'medium', 'low'],
            message: "Priority must be either high, medium, or low"
        },
        default: 'medium'
    },
    "progress":{
        type: Number,
        required: true,
        min: [0, "Progress must be 0 or more"],
        max: [100, "Progress must be 100 or less"],
        default: 0
    },
    "createdAt":{
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model('Task', taskSchema);

export default Task;