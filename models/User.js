import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: [true,"Usernaem is required"],
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters"]
    },
    password:{
        type: String,
        required: [true, "password is required"],
        minlength: [6, "Password has to be 6 characters or more"],
        select: false
    },
    role:{
        type: String,
        required: true,
        enum: {
            values: ['user','admin'],
            message: "Role must be user or admin"
        },
        default: 'user'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", userSchema);

export default User;