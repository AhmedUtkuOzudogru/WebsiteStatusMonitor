import cron from 'node-cron';
import { checkWebsiteStatus } from './websiteStatusChecker.js';
import { Website } from '../models/website.js';
import { User } from '../models/user.js';
import { sendWebsiteDownWarningEmail } from './emailService.js';

export const scheduledWebsiteStatusUpdate = () => {
    console.log('Starting scheduled website status update');

    cron.schedule('1 * * * *', async () => {
        console.log('Running scheduled website status update');

        const websites = await Website.find();

        for (const website of websites) {
            const previousStatus = website.isAvailable;

            await checkWebsiteStatus(website);

            if (previousStatus === true && website.isAvailable === false) {
                const user = await User.findById(website.user);

                if (user && user.email) {
                    await sendWebsiteDownWarningEmail(user.email, website.domainName);
                }
            }
        }
    });
};