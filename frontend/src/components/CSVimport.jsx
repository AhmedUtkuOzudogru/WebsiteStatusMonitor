import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { useWebsiteFunctions } from "../hooks/useWebsiteFunctions.js";
import { Loader } from 'lucide-react';

const CsvImport = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { addWebsite } = useWebsiteFunctions();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleImport = () => {
        if (file) {
            setIsLoading(true);
            Papa.parse(file, {
                complete: (results) => {
                    results.data.forEach((row) => {
                        if (row[0]) {  // Assuming the domain is in the first column
                            addWebsite({ domainName: row[0] });
                        }
                    });
                    setIsLoading(false);
                },
                header: false
            });
        }
    };

    return (
        <div>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleImport}
                className='w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white
                           font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                disabled={isLoading}
            >
                {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : 'Import CSV'}
            </motion.button>
        </div>
    );
};

export default CsvImport;