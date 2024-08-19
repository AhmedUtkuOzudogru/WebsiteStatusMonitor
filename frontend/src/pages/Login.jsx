import {useState} from "react";
import {motion} from "framer-motion";
import {Mail, Lock, Loader} from "lucide-react";
import {Link} from "react-router-dom";
import InputLabel from "../components/InputLabel.jsx";
import {useAuthStore} from "../store/authStore.js";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {login, isLoading, error} = useAuthStore();
    const handleLogin = async (e) => {
        e.preventDefault();
        await login(email, password);

    };
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl'
        >
            <div className='p-8'>
                <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                    Login
                </h2>

                <form onSubmit={handleLogin}>
                    <InputLabel
                        icon={Mail}
                        type='email'
                        placeholder='Email Address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputLabel
                        icon={Lock}
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                <div className='mt-4 text-center'>
                    <Link to='/forgot-password' className='text-blue-400 hover:underline'>
                        Forgot Password?
                    </Link>
                </div>
                {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
                <motion.button
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                    className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white
                        font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none
                        focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
                        transition duration-200'
                    type='submit'
                >
                    {isLoading? <Loader className='animate-spin mx-auto' size={24}/> : "Login"}

                </motion.button>
                </form>
                <div className='mt-4 text-center'>
                    <span className='text-gray-400'>Don't have an account? </span>
                    <Link to='/signup' className='text-blue-400 hover:underline'>
                        Sign Up
                    </Link>
                    </div>
            </div>

        </motion.div>
    );
}
export default Login;