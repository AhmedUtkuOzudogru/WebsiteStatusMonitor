import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import {useAuthStore} from "../store/authStore.js";
import toast from "react-hot-toast";

const EmailVerification = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]), [isCodeComplete,
            setIsCodeComplete] = useState(false),
        inputRef = useRef([]), navigate = useNavigate();
    const {error, isLoading, verifyEmail,user,logout} = useAuthStore();

    useEffect(() => {
        const handlePaste = (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').slice(0, 6);
            const pastedCode = pastedData.split('').filter(char => /^\d$/.test(char));
            const newCode = [...code];
            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || '';
            }
            setCode(newCode);

            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== '');
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRef.current[focusIndex].focus();
        };

        document.addEventListener('paste', handlePaste);

        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, [code]);

    useEffect(() => {
        setIsCodeComplete(code.every(digit => digit !== ''));
    }, [code]);

    const handleChange = (index, value) => {
        if (/^\d$/.test(value) || value === '') {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);
            if (value && index < 5) {
                inputRef.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (code[index] === "") {
                if (index > 0) {
                    inputRef.current[index - 1].focus();
                    const newCode = [...code];
                    newCode[index - 1] = "";
                    setCode(newCode);
                }
            } else {
                const newCode = [...code];
                newCode[index] = "";
                setCode(newCode);
            }
        } else if (e.key === 'Delete') {
            if (index < 5) {
                const newCode = [...code];
                newCode[index] = "";
                setCode(newCode);
                inputRef.current[index].focus();
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRef.current[index - 1].focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRef.current[index + 1].focus();
        }
    };

    const handleVerification = async (e) => {
        e.preventDefault();
        try {
            await verifyEmail(code.join(""));
            logout();
            navigate("/login");
            toast.success("Email verified successfully");
        } catch (error) {
            toast.error(error.message || "Error verifying email");
        }
    };
    return (
        <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl
         overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full
                max-w-md"
            >
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500
                text-transparent bg-clip-text">
                    Verify Your Email
                </h2>
                <p className='text-center text-gray-300 mb-6'>Enter your 6 digit verification code</p>
                <form className='space-y-6' onSubmit={handleVerification}>
                    <div className='flex justify-between'>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRef.current[index] = el)}
                                type='text'
                                maxLength='1'
                                value={digit}
                                onChange={(e) => handleChange(index,
                                    e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2
                                border-gray-700 rounded-lg focus:border-green-500 focus:outline-none'
                                style={{
                                    caretColor: 'transparent',
                                    fontFamily: 'monospace',
                                }}
                            />
                        ))}
                    </div>
                    {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
                    <motion.button
                        whileHover={{scale: isCodeComplete ? 1.02 : 1}}
                        whileTap={{scale: isCodeComplete ? 0.98 : 1}}
                        className={`mt-5 w-full py-3 px-4 text-white font-bold rounded-lg shadow-lg focus:outline-none
                         focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 ${
                            isCodeComplete
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 ' +
                                'hover:to-emerald-700 focus:ring-green-500'
                                : 'bg-gray-500 cursor-not-allowed'
                        }`}
                        type='submit'
                        disabled={!isCodeComplete}
                    >
                        {isLoading ? <Loader className='animate-spin mx-auto' size={24}/> : "Verify"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}

export default EmailVerification;