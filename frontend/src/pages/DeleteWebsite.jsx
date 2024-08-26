// DeleteWebsite.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useWebsiteFunctions } from "../hooks/useWebsiteFunctions.js";
import Sidebar from '../components/Sidebar';
import { Loader, X } from "lucide-react";

const DeleteWebsite = () => {
    const [inputValue, setInputValue] = useState('');
    const [selectedWebsite, setSelectedWebsite] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { websites, fetchWebsites, deleteWebsite, isLoading, error } = useWebsiteFunctions();
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchWebsites();
    }, [fetchWebsites]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDelete = async () => {
        if (selectedWebsite) {
            await deleteWebsite(selectedWebsite._id);
            setSelectedWebsite(null);
            setInputValue('');
        }
    };

    const filteredWebsites = websites.filter(website =>
        website.domainName.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setSelectedWebsite(null);
        setIsDropdownOpen(true);
    };

    const handleSelectWebsite = (website) => {
        setSelectedWebsite(website);
        setInputValue(website.domainName);
        setIsDropdownOpen(false);
    };

    return (
        <div className="flex">
            <Sidebar />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl mx-auto bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl p-8 ml-20"
            >
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-400 to-red-500 text-transparent bg-clip-text">
                    Delete Website
                </h2>
                <div className="relative w-full" ref={dropdownRef}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => setIsDropdownOpen(true)}
                        placeholder="Search or select a website"
                        className="w-full p-2 pr-8 mb-4 rounded-lg"
                    />
                    {selectedWebsite && (
                        <button
                            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                            onClick={() => {
                                setSelectedWebsite(null);
                                setInputValue('');
                            }}
                        >
                            <X size={20} />
                        </button>
                    )}
                    {isDropdownOpen && filteredWebsites.length > 0 && (
                        <div className="absolute w-full mt-1 max-h-60 overflow-auto bg-white rounded-lg shadow-lg z-10">
                            {filteredWebsites.map((website) => (
                                <div
                                    key={website._id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelectWebsite(website)}
                                >
                                    <span className="font-medium">{website.domainName}</span>
                                    <span className="text-sm text-gray-500 ml-2">{website.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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