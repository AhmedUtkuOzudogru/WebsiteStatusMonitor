import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderSync, Plus, Trash,LogOut } from 'lucide-react';
import {useAuthStore} from "../store/authStore.js";

const Sidebar = ({ onRefresh, onAdd, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { user, logout } = useAuthStore();
    const handleLogout = () => {
        logout();
    };

    const toggleSidebar = () => {
        console.log("Toggle clicked, current state:", isExpanded);
        setIsExpanded(!isExpanded);
    };

    return (
        <motion.div
            animate={{ width: isExpanded ? 250 : 60 }}
            className="h-full bg-gray-800 shadow-lg fixed top-0 left-0 flex flex-col items-center"
            style={{ border: '2px solid red', zIndex: 1000 }} // Debug border and z-index
        >
            <button
                onClick={toggleSidebar}
                className="p-4 focus:outline-none bg-blue-500" // Debug background
            >
                Toggle ({isExpanded ? 'Close' : 'Open'})
            </button>

            <div className="flex flex-col mt-10 space-y-4">
                <button
                    onClick={onRefresh}
                    className="bg-green-500 text-white p-2 rounded-lg shadow-lg w-44 flex items-center justify-center"
                >
                    {isExpanded ? 'Refresh' : <FolderSync />}
                </button>
                <button
                    onClick={onAdd}
                    className="bg-blue-500 text-white p-2 rounded-lg shadow-lg w-44 flex items-center justify-center"
                >
                    {isExpanded ? 'Add Website' : <Plus />}
                </button>
                <button
                    onClick={onDelete}
                    className="bg-red-500 text-white p-2 rounded-lg shadow-lg w-44 flex items-center justify-center"
                >
                    {isExpanded ? 'Delete Website' : <Trash />}
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white p-2 rounded-lg shadow-lg w-44 flex items-center justify-center"
                >
                    {isExpanded ? 'Logout' : <LogOut />}
                </button>
            </div>
        </motion.div>
    );
};

export default Sidebar;