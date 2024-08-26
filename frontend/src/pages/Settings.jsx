import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import Sidebar from '../components/Sidebar';
import Dialog from '../components/Dialog';
import { Loader, Edit2 } from "lucide-react";
import { useWebsiteFunctions } from '../hooks/useWebsiteFunctions';

const Settings = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const {
        isLoading,
        error,
        message,
        changeUsername,
        requestEmailChange,
        changePassword,
        deleteAccount
    } = useWebsiteFunctions();

    const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);
    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangeUsername = async (e) => {
        e.preventDefault();
        await changeUsername(newUsername);
    };

    const handleRequestEmailChange = async (e) => {
        e.preventDefault();
        const success = await requestEmailChange(newEmail);
        if (success) {
            navigate('/verify-email');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        await changePassword(currentPassword, newPassword, confirmPassword);
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            const success = await deleteAccount();
            if (success) {
                navigate('/login');
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
                className="max-w-6xl w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl
                shadow-xl p-8 ml-20"
            >
                <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-pink-500
                text-transparent bg-clip-text leading-tight pb-2 ">
                    Settings
                </h2>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-300">Username</h3>
                    <div className="flex items-center justify-between">
                        <p className="text-white">{user.username}</p>
                        <button onClick={() => setIsUsernameDialogOpen(true)} className="text-blue-500 hover:text-blue-600">
                            <Edit2 size={20} />
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-300">Email</h3>
                    <div className="flex items-center justify-between">
                        <p className="text-white">{user.email}</p>
                        <button onClick={() => setIsEmailDialogOpen(true)} className="text-blue-500 hover:text-blue-600">
                            <Edit2 size={20} />
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-300">Password</h3>
                    <div className="flex items-center justify-between">
                        <p className="text-white">••••••••</p>
                        <button onClick={() => setIsPasswordDialogOpen(true)} className="text-blue-500 hover:text-blue-600">
                            <Edit2 size={20} />
                        </button>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteAccount}
                    className='w-full py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white
                    font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-red-700
                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                    disabled={isLoading}
                >
                    {isLoading ? <Loader className='animate-spin mx-auto' size={24}/> : 'Delete Account'}
                </motion.button>

                {error && <p className="text-red-500 mt-4">{error}</p>}
                {message && <p className="text-green-500 mt-4">{message}</p>}

                <Dialog isOpen={isUsernameDialogOpen} onClose={() => setIsUsernameDialogOpen(false)} title="Change Username">
                    <form onSubmit={handleChangeUsername}>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="New username"
                            className="w-full p-2 mb-4 rounded-lg"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className='w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white
                            font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-700
                            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader className='animate-spin mx-auto' size={24}/> : 'Change Username'}
                        </motion.button>
                    </form>
                </Dialog>

                <Dialog isOpen={isEmailDialogOpen} onClose={() => setIsEmailDialogOpen(false)} title="Change Email">
                    <form onSubmit={handleRequestEmailChange}>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="New email"
                            className="w-full p-2 mb-4 rounded-lg"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className='w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white
                            font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader className='animate-spin mx-auto' size={24}/> : 'Request Email Change'}
                        </motion.button>
                    </form>
                </Dialog>

                <Dialog isOpen={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)} title="Change Password">
                    <form onSubmit={handleChangePassword}>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current password"
                            className="w-full p-2 mb-4 rounded-lg"
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password"
                            className="w-full p-2 mb-4 rounded-lg"
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full p-2 mb-4 rounded-lg"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className='w-full py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white
                            font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
                            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader className='animate-spin mx-auto' size={24}/> : 'Change Password'}
                        </motion.button>
                    </form>
                </Dialog>
            </motion.div>
        </div>
    );
};

export default Settings;