import cron from 'node-cron';
import { updateUserWebsitesStatus } from './websiteStatusChecker.js';
import { User } from '../models/user.js';

export const scheduledEmailUpdate = () => {

    cron.schedule('1 * * * *', async () => {
        console.log('Running scheduled website status update');
        const users = await User.find();
        for (const user of users) {
            await updateUserWebsitesStatus(user._id);
        }
    });

};