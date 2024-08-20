import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema({
    domainName: {
        type: String,
        required: true,
    },
    sslStatus: {
        type: String,
        default: 'Unknown',
    },
    expiryDate: Date,
    lastChecked: {
        type: Date,
        default: Date.now,
    },isAvailable:{
        type: Boolean,
        default: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

export const Website = mongoose.model("Website", websiteSchema);
