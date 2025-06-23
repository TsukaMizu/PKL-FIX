import React from 'react';

const TableActions = ({ onEdit, onDelete }) => {
    return (
        <div className="flex space-x-2">
            <button
                onClick={onEdit}
                className="text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out"
                title="Edit"
            >
                <i className="fas fa-edit"></i>
            </button>
            <button
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 transition duration-150 ease-in-out"
                title="Delete"
            >
                <i className="fas fa-trash"></i>
            </button>
        </div>
    );
};

export default TableActions;