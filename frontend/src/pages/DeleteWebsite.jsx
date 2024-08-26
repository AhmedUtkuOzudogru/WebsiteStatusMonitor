// DeleteWebsite.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWebsiteFunctions } from "../hooks/useWebsiteFunctions.js";
import Sidebar from '../components/Sidebar';
import { Loader } from "lucide-react";

const DeleteWebsite = () => {
    const [selectedWebsite, setSelectedWebsite] = useState('');
    const { websites, fetchWebsites, deleteWebsite, isLoading, error } = useWebsiteFunctions();

    useEffect(() => {
        fetchWebsites();
    }, [fetchWebsites]);

    const handleDelete = async () => {
        if (selectedWebsite) {
            const websiteToDelete = websites.find(website => website._id === selectedWebsite);
            if (websiteToDelete) {
                await deleteWebsite(websiteToDelete._id);
                setSelectedWebsite('');
            }
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl p-8 ml-20"
            >
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-400 to-red-500 text-transparent bg-clip-text">
                    Delete Website
                </h2>
                <select
                    value={selectedWebsite}
                    onChange={(e) => setSelectedWebsite(e.target.value)}
                    className="w-full p-2 mb-4 rounded-lg"
                >
                    <option value="">Select a website</option>
                    {websites.map((website) => (
                        <option key={website._id} value={website._id}>{website.domainName}</option>
                    ))}
                </select>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    className='w-full mt-4 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white
                    font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-red-700
                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                    disabled={isLoading || !selectedWebsite}
                >
                    {isLoading ? <Loader className='animate-spin mx-auto' size={24}/> : 'Delete Website'}
                </motion.button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </motion.div>
        </div>
    );
};

export default DeleteWebsite;