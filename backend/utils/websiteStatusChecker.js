import https from 'https';
import http from 'http';
import dns from 'dns';
import { Website } from '../models/website.js';
import {User} from "../models/user.js";

const followRedirects = async (url, protocol, redirectCount = 0) => {
    if (redirectCount > 5) {
        throw new Error('Too many redirects');
    }

    return new Promise((resolve, reject) => {
        const client = protocol === 'https:' ? https : http;
        const req = client.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                const redirectUrl = new URL(res.headers.location, url);
                followRedirects(redirectUrl.href, redirectUrl.protocol, redirectCount + 1)
                    .then(resolve)
                    .catch(reject);
            } else {
                resolve(res);
            }
        });

        req.on('error', reject);

        req.setTimeout(10000, () => {
            req.abort();
            reject(new Error('Request timeout'));
        });
    });
};

export const checkWebsiteStatus = async (website) => {
    try {
        // First, check if the domain resolves
        await new Promise((resolve, reject) => {
            dns.resolve(website.domainName, (err) => {
                if (err) {
                    website.isAvailable = false;
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        // If DNS resolves, check if the website is accessible
        if (website.isAvailable !== false) {
            try {
                const res = await followRedirects(`https://${website.domainName}`, 'https:');
                website.isAvailable = true;

                if (res.socket.encrypted) {
                    const cert = res.socket.getPeerCertificate();
                    if (cert && cert.valid_to) {
                        website.sslStatus = 'Valid';
                        website.expiryDate = new Date(cert.valid_to);
                    } else {
                        website.sslStatus = 'Invalid or Not Found';
                        website.expiryDate = null;
                    }
                } else {
                    website.sslStatus = 'Not Secure (HTTP)';
                    website.expiryDate = null;
                }
            } catch (error) {
                if (error.message === 'Too many redirects') {
                    website.isAvailable = true;
                    website.sslStatus = 'Too Many Redirects';
                } else {
                    // If HTTPS fails, try HTTP as a fallback
                    try {
                        await followRedirects(`http://${website.domainName}`, 'http:');
                        website.isAvailable = true;
                        website.sslStatus = 'Not Secure (HTTP)';
                    } catch (httpError) {
                        website.isAvailable = false;
                        website.sslStatus = 'Not Accessible';
                    }
                }
                website.expiryDate = null;
            }
        }
    } catch (error) {
        console.error(`Error checking status for ${website.domainName}:`, error);
        website.isAvailable = false;
        website.sslStatus = 'Error Checking';
        website.expiryDate = null;
    }

    website.lastChecked = new Date();
    await website.save();
};
export const updateUserWebsitesStatus = async (userId) => {
    const user = await User.findById(userId).populate('domains');
    if (!user) {
        console.error(`User with ID ${userId} not found`);
        return;
    }

    for (const website of user.domains) {
        await checkWebsiteStatus(website);
    }
};

export const updateAllWebsitesStatus = async () => {
    const websites = await Website.find();
    for (const website of websites) {
        await checkWebsiteStatus(website);
    }
};