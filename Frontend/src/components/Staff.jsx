import React from 'react';
import { motion } from 'framer-motion';

const Staff = ({ loading }) => {
    const staffMembers = [
        { id: 'S101', name: 'Alice Johnson', role: 'Manager', shift: 'Morning' },
        { id: 'S102', name: 'Bob Smith', role: 'Chef', shift: 'Evening' },
        { id: 'S103', name: 'Carol White', role: 'Waiter', shift: 'Afternoon' },
        { id: 'S104', name: 'David Brown', role: 'Cleaner', shift: 'Morning' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold text-gray-800 dark:text-white"
            >
                Staff Management
            </motion.h1>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                            <th className="pb-3">Staff ID</th>
                            <th className="pb-3">Name</th>
                            <th className="pb-3">Role</th>
                            <th className="pb-3">Shift</th>
                        </tr>
                        </thead>
                        <tbody>
                        {staffMembers.map((staff, index) => (
                            <tr key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                                <td className="py-3 text-gray-800 dark:text-white">{staff.id}</td>
                                <td className="py-3 text-gray-800 dark:text-white">{staff.name}</td>
                                <td className="py-3 text-gray-800 dark:text-white">{staff.role}</td>
                                <td className="py-3 text-gray-800 dark:text-white">{staff.shift}</td>
                            </tr>
                        ))}
                        {staffMembers.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-gray-500 dark:text-gray-400">
                                    No staff members found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Staff;
