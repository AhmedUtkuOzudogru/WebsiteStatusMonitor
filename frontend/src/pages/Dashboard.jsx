import React from 'react';
import { useTable, useSortBy } from 'react-table';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWebsiteFunctions } from "../hooks/useWebsiteFunctions.js";
import Sidebar from '../components/Sidebar';
import { Loader } from "lucide-react";

const Dashboard = () => {
    const { websites, fetchWebsites, updateAndFetchWebsites, error, isLoading } = useWebsiteFunctions();

    useEffect(() => {
        fetchWebsites();
    }, [fetchWebsites]);

    useEffect(() => {
        const interval = setInterval(updateAndFetchWebsites, 120000);
        return () => clearInterval(interval);
    }, [updateAndFetchWebsites]);

    const handleRefresh = () => {
        updateAndFetchWebsites();
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const columns = React.useMemo(
        () => [
            {
                Header: 'Domain Name',
                accessor: 'domainName',
            },
            {
                Header: 'SSL Status',
                accessor: 'sslStatus',
            },
            {
                Header: 'Expiry Date',
                accessor: 'expiryDate',
                Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A',
            },
            {
                Header: 'Last Checked',
                accessor: 'lastChecked',
                Cell: ({ value }) => formatDateTime(value),
            },
            {
                Header: 'Availability',
                accessor: 'isAvailable',
                Cell: ({ value }) => value ? 'Available' : 'Not Available',
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: websites }, useSortBy);

    if (isLoading) {
        return (
            <div className="flex">
                <Sidebar/>
                <div className="flex justify-center items-center h-screen">
                    <Loader className='animate-spin' size={24}/>
                </div>
            </div>
        )
    }

    return (
        <div className="flex">
            <Sidebar/>
            {websites.length === 0 ? (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-2xl text-center">No websites found. Add a website to get started.</p>
                </div>
            ) : (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="max-w-7xl w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl p-8 ml-20"
                >
                    <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                        Dashboard
                    </h2>
                    <div className="overflow-x-auto">
                        <table {...getTableProps()} className="min-w-full bg-white">
                            <thead>
                            {headerGroups.map(headerGroup => (
                                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())} className="py-2">
                                            {column.render('Header')}
                                            <span>
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? ' 🔽'
                                                        : ' 🔼'
                                                    : ''}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row)
                                return (
                                    <tr key={row.id} {...row.getRowProps()}>
                                        {row.cells.map(cell => {
                                            return <td key={cell.id} {...cell.getCellProps()} className="border px-4 py-2">{cell.render('Cell')}</td>
                                        })}
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={handleRefresh}
                        className='w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white
                        font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                    >
                        Refresh
                    </motion.button>
                    {error && <p className='text-red-500 text-sm mt-4'>{error}</p>}
                </motion.div>
            )}
        </div>
    );
};

export default Dashboard;