import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWebsiteFunctions } from "../hooks/useWebsiteFunctions.js";
import Sidebar from '../components/Sidebar';
import { Loader } from "lucide-react";

const AddWebsite = () => {
    const [domainName, setDomainName] = useState('');
    const { addWebsite, isLoading, error } = useWebsiteFunctions();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addWebsite({ domainName });
        setDomainName('');
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
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Add Website
                </h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                        placeholder="Enter domain name"
                        className="w-full p-2 mb-4 rounded-lg"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className='w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white
                        font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className='animate-spin mx-auto' size={24}/> : 'Add Website'}
                    </motion.button>
                </form>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </motion.div>
        </div>
    );
};

export default AddWebsite;