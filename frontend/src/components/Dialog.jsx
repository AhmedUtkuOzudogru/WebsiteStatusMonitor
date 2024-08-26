import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Dialog = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="bg-gray-800 p-6 rounded-lg max-w-md w-full"
                    onClick={e => e.stopPropagation()}
                >
                    <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
                    {children}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default Dialog;