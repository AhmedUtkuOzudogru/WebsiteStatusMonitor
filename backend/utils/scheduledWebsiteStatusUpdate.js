import cron from 'node-cron';
import {updateAllWebsitesStatus} from './websiteStatusChecker.js';

//TODO Send warning email if the website is down for more than 1 hour

export const scheduledWebsiteStatusUpdate = () => {

    console.log('Starting scheduled website status update');

    cron.schedule('1 * * * *', async () => {
        console.log('Running scheduled website status update');
        await updateAllWebsitesStatus();
    });

};