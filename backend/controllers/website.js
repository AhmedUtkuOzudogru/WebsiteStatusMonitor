import { Website } from "../models/website.js";
import {checkWebsiteStatus, updateUserWebsitesStatus} from "../utils/websiteStatusChecker.js";
import {User} from "../models/user.js";

export const addWebsite = async (req, res) => {
    try {
        const { domainName } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const existingWebsite = await Website.findOne({ domainName, user: userId });
        if (existingWebsite) {
            return res.status(400).json({ success: false, message: "Website already exists" });
        }

        const website = new Website({
            domainName,
            user: userId
        });

        await website.save();

        user.domains.push(website._id);
        await user.save();

        await updateUserWebsitesStatus(userId);

        res.status(201).json({ success: true, message: "Website added successfully", website });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getUserWebsites = async (req, res) => {
    try {
        const userId = req.userId;
        const websites = await Website.find({ user: userId });
        res.status(200).json({ success: true, websites });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateUserWebsites = async (req, res) => {
    try {
        const userId = req.userId;
        await updateUserWebsitesStatus(userId);
        res.status(200).json({ success: true, message: "Websites status updated successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getLatestWebsiteUpdates = async (req, res) => {
    try {
        const userId = req.userId;
        const updatedWebsites = await Website.find({ user: userId, updatedAt: { $gte: new Date(Date.now() - 60000) } }); // Get websites updated in the last minute
        res.status(200).json({ success: true, websites: updatedWebsites });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteWebsite = async (req, res) => {
    try {
        const { websiteId } = req.params;
        const userId = req.userId;

        const website = await Website.findOneAndDelete({ _id: websiteId, user: userId });

        if (!website) {
            return res.status(404).json({ success: false, message: "Website not found" });
        }

        // Remove website from user's domains array
        await User.findByIdAndUpdate(userId, { $pull: { domains: websiteId } });

        res.status(200).json({ success: true, message: "Website deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getWebsiteStatus = async (req, res) => {
    try {
        const { websiteId } = req.params;
        const userId = req.userId;

        const website = await Website.findOne({ _id: websiteId, user: userId });

        if (!website) {
            return res.status(404).json({ success: false, message: "Website not found" });
        }
        await checkWebsiteStatus(website);
        res.status(200).json({ success: true, website });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};