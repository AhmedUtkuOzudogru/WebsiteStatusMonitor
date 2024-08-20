import mongoose from "mongoose";
//TODO add domains of the user as a cvs file
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true,
        unique: true,
    },
    password: {
        type:String,
        required:true
    },
    username: {
        type: String,
        required:true,
        unique: true,
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },domains: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Website',
    }],
    resetPasswordToken:String,
    resetPasswordExpires:Date,
    verificationToken:String,
    verificationTokenExpires:Date,
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);