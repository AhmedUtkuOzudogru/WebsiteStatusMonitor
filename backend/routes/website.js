import express from "express";
import {
    addWebsite,
    getUserWebsites,
    deleteWebsite,
    updateUserWebsites,
    getWebsiteStatus
} from "../controllers/website.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add", verifyToken, addWebsite);
router.get("/user-websites", verifyToken, getUserWebsites);
router.delete("/:websiteId", verifyToken, deleteWebsite);
router.post("/update-status", verifyToken, updateUserWebsites);
router.get("/:websiteId", verifyToken,getWebsiteStatus );


export default router;