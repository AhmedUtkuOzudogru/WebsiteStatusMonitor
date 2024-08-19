import cron from 'node-cron';
import { User } from '../models/user.js';

export const startCleanupService = () => {

    cron.schedule('0 * * * *', async () => { // Run every hour
        try {
            console.log('Running cleanup service...');

            const deleteResult = await User.deleteMany({
                isVerified: false,
                createdAt: { $lt: new Date(Date.now() - 12 * 60 * 60 * 1000) }
            });

            console.log(`Deleted ${deleteResult.deletedCount} unverified users.`);
        } catch (error) {
            console.error('Error in cleanup service:', error);
        }
    });

    console.log('Cleanup service started');
};