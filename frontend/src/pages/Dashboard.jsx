import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import {useWebsiteFunctions} from "../hooks/useWebsiteFunctions.js";
import Sidebar from '../components/Sidebar';
import {Loader} from "lucide-react";

const Dashboard = () => {
    //const [loading, setLoading] = useState(true);
    const {websites,fetchWebsites,updateAndFetchWebsites,error,isLoading} = useWebsiteFunctions();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        fetchWebsites();
    }, [fetchWebsites]);

    useEffect(() => {
        const interval = setInterval(updateAndFetchWebsites, 120000); // Check for updates every 2 minutes
        return () => clearInterval(interval);
    }, [updateAndFetchWebsites]);

    const handleRefresh = () => {
        updateAndFetchWebsites();
    };

    const getCellColor = (value, type) => {
        switch (type) {
            case 'sslStatus':
                return value === 'Valid' ? 'bg-green-200' : 'bg-red-200';
            case 'expiryDate':
                return new Date(value) < new Date() ? 'bg-red-200' : 'bg-green-200';
            case 'isAvailable':
                return value ? 'bg-green-200' : 'bg-red-200';
            default:
                return '';
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl p-8 ml-20"
            >
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Dashboard
                </h2>
                 <Loader className='animate-spin mx-auto' size={24} />
            </motion.div>
        );
    }

    if (!websites || websites.length === 0) {
        return (
            <div className="flex">
                <Sidebar  />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-7xl w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl p-8 ml-20"
                >
                    <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                        Dashboard
                    </h2>
                    <div>No websites available</div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex">
            <Sidebar  />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl p-8 ml-20"
            >
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Dashboard
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                        <tr>
                            <th className="py-2">Domain Name</th>
                            <th className="py-2">SSL Status</th>
                            <th className="py-2">Expiry Date</th>
                            <th className="py-2">Last Checked</th>
                            <th className="py-2">Availability</th>
                        </tr>
                        </thead>
                        <tbody>
                        {websites.map((website) => (
                            <tr key={website._id}>
                                <td className={`border px-4 py-2 ${getCellColor(website.domainName, 'domainName')}`}>{website.domainName}</td>
                                <td className={`border px-4 py-2 ${getCellColor(website.sslStatus, 'sslStatus')}`}>{website.sslStatus}</td>
                                <td className={`border px-4 py-2 ${getCellColor(website.expiryDate, 'expiryDate')}`}>{website.expiryDate ? new Date(website.expiryDate).toLocaleDateString() : 'N/A'}</td>
                                <td className="border px-4 py-2">{formatDateTime(website.lastChecked)}</td>
                                <td className={`border px-4 py-2 ${getCellColor(website.isAvailable, 'isAvailable')}`}>{website.isAvailable ? 'Available' : 'Not Available'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white
                    font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                >
                    Logout
                </motion.button>
            </motion.div>
        </div>
    );
};

export default Dashboard;