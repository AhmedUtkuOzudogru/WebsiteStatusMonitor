import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path'
import cookieParser from 'cookie-parser';

import authRoutes from "./routes/auth.js";
import websiteRoutes from "./routes/website.js";

import { connectDB } from "./db/connectDB.js";
import { startCleanupService } from './utils/cleanupService.js';
import { scheduledWebsiteStatusUpdate } from './utils/scheduledWebsiteStatusUpdate.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use('/api/auth', authRoutes);
app.use('/api/websites', websiteRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  startCleanupService();  // Start the cleanup service
  scheduledWebsiteStatusUpdate(); // Start the scheduled website status update
  console.log('Server is running on port', PORT);
});