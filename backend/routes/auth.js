import express from "express";
import {
    signup,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    checkAuth,
    changeEmail, changeUsername, deleteAccount
} from "../controllers/auth.js";
import {verifyToken} from "../middleware/verifyToken.js";


const router = express.Router();

router.get("/check-auth",verifyToken, checkAuth);
router.put("/change-username", verifyToken, changeUsername);
router.put("/change-email", verifyToken, changeEmail);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.delete("/delete-account", verifyToken, deleteAccount);

export default router;