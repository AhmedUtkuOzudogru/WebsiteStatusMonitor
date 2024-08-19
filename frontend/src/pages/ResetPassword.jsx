import {useState} from 'react';
import {motion} from "framer-motion";
import {useAuthStore} from "../store/authStore.js";
import {useNavigate, useParams} from "react-router-dom";
import InputLabel from "../components/InputLabel.jsx";
import toast from "react-hot-toast";
import {Lock} from "lucide-react";

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {resetPassword, error, isLoading, message} = useAuthStore();

    const {token} = useParams();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return;
        }
        try {
            await resetPassword(password, token);
            toast.success("Password reset successfully");
            setTimeout(() => {navigate("/login")}, 1000);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "An error occurred. Please try again.");
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
            >
                <div className='p-8'>
                    <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                        Reset Password
                    </h2>
                    {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
                    {message && <p className='text-green-500 text-sm mb-4'>{message}</p>}

                    <form onSubmit={handleSubmit}>
                        <InputLabel
                            icon={Lock}
                            type='password'
                            placeholder='New Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <InputLabel
                            icon={Lock}
                            type='password'
                            placeholder='Confirm New Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? "Resetting..." : "Set New Password"}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </>
    );
}
export default ResetPassword;