import React, { useState } from 'react';

const DataTable = ({ columns, data, actions }) => {
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState(null);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = React.useMemo(() => {
        let sortableData = [...data];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    const filteredData = sortedData.filter((item) =>
        Object.values(item).some((val) =>
            String(val).toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <div className="w-full">
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    className="px-4 py-2 border rounded-lg"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {actions && <div>{actions}</div>}
            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="py-2 px-4 bg-gray-50 border-b border-gray-200 text-left text-sm font-semibold text-gray-600"
                                onClick={() => handleSort(column.key)}
                            >
                                {column.title}
                                {sortConfig && sortConfig.key === column.key ? (
                                    sortConfig.direction === 'ascending' ? (
                                        <i className="fas fa-sort-up ml-2"></i>
                                    ) : (
                                        <i className="fas fa-sort-down ml-2"></i>
                                    )
                                ) : (
                                    <i className="fas fa-sort ml-2"></i>
                                )}
                            </th>
                        ))}
                        <th className="py-2 px-4 bg-gray-50 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-100">
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="py-2 px-4 border-b border-gray-200 text-sm"
                                >
                                    {row[column.key]}
                                </td>
                            ))}
                            <td className="py-2 px-4 border-b border-gray-200 text-sm">
                                {actions && actions(row)}
                            </td>
                        </tr>
                    ))}
                    {filteredData.length === 0 && (
                        <tr>
                            <td
                                colSpan={columns.length + 1}
                                className="py-4 px-4 text-center text-sm text-gray-600"
                            >
                                No data found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;