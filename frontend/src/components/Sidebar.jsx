import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderSync, Plus, Trash, LogOut, ArrowLeft, ArrowRight, User, Home, Settings } from 'lucide-react';
import { useAuthStore } from "../store/authStore.js";
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
    };

    const toggleSidebar = () => {
        console.log("Toggle clicked, current state:", isExpanded);
        setIsExpanded(!isExpanded);
    };

    const goToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <motion.div
            animate={{ width: isExpanded ? 250 : 60 }}
            className="h-full fixed top-0 left-0 flex flex-col items-center
            bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl shadow-xl"
            style={{ zIndex: 1000 }}
        >
            <div className="w-full p-4 text-center text-white bg-gray-900">
                {isExpanded ? user.username : <User />}
            </div>

            <motion.button
                onClick={toggleSidebar}
                className="p-4 focus:outline-none bg-fuchsia-400 absolute"
                style={{
                    top: '50%',
                    transform: 'translateY(-50%)',
                    right: isExpanded ? '-20px' : '-20px',
                    zIndex: 1050
                }}
                animate={{ right: isExpanded ? '-20px' : '-20px' }}
            >
                {isExpanded ? <ArrowLeft /> : <ArrowRight />}
            </motion.button>

            <div className="flex flex-col mt-10 space-y-4 flex-grow">
                <button
                    onClick={goToDashboard}
                    className={`bg-yellow-500 text-white p-2 rounded-lg shadow-lg flex items-center justify-center ${isExpanded ? 'w-44' : 'w-12'}`}
                >
                    {isExpanded ? 'Dashboard' : <Home />}
                </button>
                <button
                    // onClick={onRefresh}
                    className={`bg-green-500 text-white p-2 rounded-lg shadow-lg flex items-center justify-center ${isExpanded ? 'w-44' : 'w-12'}`}
                >
                    {isExpanded ? 'Refresh' : <FolderSync />}
                </button>
                <button
                  //  onClick={onAdd}
                    className={`bg-blue-500 text-white p-2 rounded-lg shadow-lg flex items-center justify-center ${isExpanded ? 'w-44' : 'w-12'}`}
                >
                    {isExpanded ? 'Add Website' : <Plus />}
                </button>
                <button
                //    onClick={onDelete}
                    className={`bg-red-500 text-white p-2 rounded-lg shadow-lg flex items-center justify-center ${isExpanded ? 'w-44' : 'w-12'}`}
                >
                    {isExpanded ? 'Delete Website' : <Trash />}
                </button>
            </div>

            <div className="mb-4 flex flex-col space-y-4">
                <button
                    className={`bg-gray-500 text-white p-2 rounded-lg shadow-lg flex items-center justify-center ${isExpanded ? 'w-44' : 'w-12'}`}
                >
                    {isExpanded ? 'Settings' : <Settings/>}
                </button>

                <button
                    //onClick={handleLogout}
                    className={`bg-rose-500 text-white p-2 rounded-lg shadow-lg flex items-center justify-center ${isExpanded ? 'w-44' : 'w-12'}`}
                >
                    {isExpanded ? 'Logout' : <LogOut/>}
                </button>

            </div>
        </motion.div>
    );
};

export default Sidebar;