import React from 'react';
import { useTable, useSortBy } from 'react-table';

const WebsiteTable = ({ websites }) => {
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
                Cell: ({ value }) => new Date(value).toLocaleString(),
            },
            {
                Header: 'Availability',
                accessor: 'isAvailable',
                Cell: ({ value }) => value ? 'Available' : 'Not Available',
                sortType: (rowA, rowB) => {
                    const a = rowA.original.isAvailable ? 1 : 0;
                    const b = rowB.original.isAvailable ? 1 : 0;
                    return a - b;
                }
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

    return (
        <table {...getTableProps()} className="min-w-full bg-white">
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())} className="py-2">
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
                    <tr {...row.getRowProps()} className={!row.original.isAvailable ? 'bg-red-100' : ''}>
                        {row.cells.map(cell => {
                            return <td {...cell.getCellProps()} className="border px-4 py-2">{cell.render('Cell')}</td>
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    );
};

export default WebsiteTable;