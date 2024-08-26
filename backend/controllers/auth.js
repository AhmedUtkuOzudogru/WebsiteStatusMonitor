// noinspection ExceptionCaughtLocallyJS
import bcryptjs from "bcryptjs";
import  crypto from "crypto";

import {User} from "../models/user.js";
import {generateTokenAndSetCookie} from "../utils/generateTokenAndSetCookie.js";
import {sendPasswordResetEmail, sendResetPasswordSuccessEmail, sendVerificationEmail} from "../utils/emailService.js";
import {Website} from "../models/website.js";

//TODO !!!!! if user changes the email, and becomes unverified there might be a change that cleanupService might delete
// the user because it is unverified and created before 12 hour mark. Resolve this issue before deployment

export const signup = async (req, res) => {
    const { email, password, username } = req.body;
    try {
        if(!email || !password || !username ){
            throw new Error("Please fill all the fields");
        }
        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({success: false, message: "User already exists"});
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User(
            {
                email,
                password: hashedPassword,
                username,
                verificationToken: verificationToken,
                verificationTokenExpires: Date.now() + 12*60*60*1000 // 12 hours
            });
        await user.save();

        // Send verification email
        await sendVerificationEmail(email, verificationToken, username);

        //json web token
        generateTokenAndSetCookie(res, user._id);
        res.status(201).json({
            success: true,
            message: "User created successfully. Please check your email for verification.",
            user: {
                ...user._doc,
                password: undefined,
            }
        });

    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
}
export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
        // TODO sendWelcomeEmail function
        //  await sendWelcomeEmail(user.email, user.username);
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log("error in verifyEmail ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email || !password){
            throw new Error("Please fill all the fields");
        }
        const user=  await User.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message: "User not found"});
        }
        if(!user.isVerified){
            return res.status(400).json({success: false, message: "Please verify your email to login"});
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({success: false, message: "Invalid credentials"});
        }
        generateTokenAndSetCookie(res, user._id);
        user.lastLogin= new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user:{
                ...user._doc,
                password: undefined
            }
        });

    }
        catch(error){
        console.log("Error Logging in", error);
        res.status(400).json({success: false, message: error.message});

    }

}
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if(!email){
            throw new Error("Please provide your email");
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message: "User not found"});
        }
        if(user.isVerified === false){
            return res.status(400).json({success: false, message: "Please verify your email to reset password"});
        }
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpires = Date.now() + 60*60*1000; // 60 minutes

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpires;
        await user.save();
        //TODO: sendPasswordResetEmail function
        //If you are not running on the dev environment (the case you start the server and frontend with npm run dev separately)
        // in order to see the forgot password email link that is being sent your email, you need to change the API_URL in the following command:  sendPasswordResetEmail
        // to process.env.CLIENT_URL, i know why it happens but the solution at the time of writing this code so you have to
        //change this manually :(
        await sendPasswordResetEmail(user.email, `${process.env.API_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Reset password sent successfully" });
    }catch (error){
        res.status(400).json({success: false, message: error.message});

    }

}
export const resetPassword = async (req, res) => {
    try{
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if(!user){
            return res.status(400).json({success: false, message: "Invalid or expired token"});
        }
        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        await sendResetPasswordSuccessEmail(user.email);
        res.status(200).json({success: true, message: "Password reset successfully"});
    }catch (error){
        console.log("Error in reset password",error);
        res.status(400).json({success: false, message: error.message});

    }
}
export const checkAuth = async (req, res) => {
    try{
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
        res.status(200).json({success:true,user });
    }catch (error){
        console.log("Error in checking auth",error);
        res.status(400).json({success: false, message: error.message});
    }
}
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({success: true, message: "Logged out successfully"});
}
export const changeUsername = async (req, res) => {
    try {
        const { newUsername } = req.body;
        const userId = req.userId;

        if (!newUsername) {
            return res.status(400).json({ success: false, message: "New username is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const usernameExists = await User.findOne({ username: newUsername });
        if (usernameExists) {
            return res.status(400).json({ success: false, message: "Username is already taken" });
        }

        user.username = newUsername;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Username updated successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.log("Error changing username", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const changeEmail = async (req, res) => {
    try {
        const { newEmail } = req.body;
        const userId = req.userId;

        if (!newEmail) {
            return res.status(400).json({ success: false, message: "New email is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return res.status(400).json({ success: false, message: "Email is already in use" });
        }

        user.email = newEmail;
        user.isVerified = false;
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = Date.now() + 12*60*60*1000; // 12 hours

        await user.save();

        await sendVerificationEmail(newEmail, verificationToken, user.username);

+       res.clearCookie("token");

        res.status(200).json({
            success: true,
            message: "Email updated successfully. Please check your new email for verification.",
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.log("Error changing email", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await Website.deleteMany({ user: userId });

        await User.findByIdAndDelete(userId);

        res.clearCookie("token");

        res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });
    } catch (error) {
        console.log("Error deleting account", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
