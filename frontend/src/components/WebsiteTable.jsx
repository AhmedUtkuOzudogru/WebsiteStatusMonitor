import React, { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Search } from 'lucide-react';

const WebsiteTable = ({ websites }) => {
    const [filterText, setFilterText] = useState('');

    const columns = [
        {
            name: 'Domain Name',
            selector: row => row.domainName,
            sortable: true,
            width: '250px',
            cell: row => <div className="truncate">{row.domainName}</div>,
        },
        {
            name: 'SSL Status',
            selector: row => row.sslStatus,
            sortable: true,
            width: '120px',
        },
        {
            name: 'Expiry Date',
            selector: row => row.expiryDate,
            sortable: true,
            width: '150px',
            cell: row => row.expiryDate ? new Date(row.expiryDate).toLocaleDateString() : 'N/A',
        },
        {
            name: 'Last Checked',
            selector: row => row.lastChecked,
            sortable: true,
            width: '200px',
            cell: row => new Date(row.lastChecked).toLocaleString(),
        },
        {
            name: 'Availability',
            selector: row => row.isAvailable,
            sortable: true,
            width: '120px',
            cell: row => row.isAvailable ? 'Available' : 'Not Available',
        },
    ];

    const conditionalRowStyles = [
        {
            when: row => !row.isAvailable,
            style: {
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
            },
        },
    ];

    const filteredItems = useMemo(() => {
        return websites.filter(item =>
            item.domainName && item.domainName.toLowerCase().includes(filterText.toLowerCase())
        );
    }, [websites, filterText]);

    const subHeaderComponent = useMemo(() => {
        return (
            <div className="relative w-full mb-4">
                <input
                    type="text"
                    placeholder="Search by domain name"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                    className="pl-10 w-full p-2 rounded-lg"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2" size={20} />
            </div>
        );
    }, [filterText]);

    const customStyles = {
        table: {
            style: {
                minWidth: '840px',
            },
        },
        headRow: {
            style: {
                backgroundColor: '#f3f4f6',
                borderBottom: '1px solid #e5e7eb',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        },
    };

    return (
        <DataTable
            columns={columns}
            data={filteredItems}
            pagination
            highlightOnHover
            striped
            responsive
            subHeader
            subHeaderComponent={subHeaderComponent}
            conditionalRowStyles={conditionalRowStyles}
            fixedHeader
            fixedHeaderScrollHeight="calc(100vh - 300px)"
            customStyles={customStyles}
        />
    );
};

export default WebsiteTable;