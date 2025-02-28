import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSearch } from 'react-icons/fi';

const OrdersPage = ({ orderData, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showOrderDetails, setShowOrderDetails] = useState(null);

    const filteredOrders = orderData.filter(order => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.tableNumber.toString().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'ready':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'cooking':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const OrderDetailsModal = ({ order, onClose }) => {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            {order.orderNumber} - Table {order.tableNumber}
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Order Details</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Date:</span> {new Date(order.timestamp).toLocaleString()}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Total Price:</span> ₹{order.totalPrice}
                        </p>

                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Items Ordered</h3>
                        <ul className="list-disc pl-6 text-gray-800 dark:text-gray-300">
                            {order.items.map(item => (
                                <li key={item.id}>
                                    {item.quantity} x {item.name} - ₹{item.price}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

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
                Orders Management
            </motion.h1>

            {/* Filters and Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="all">All Statuses</option>
                            <option value="ready">Ready</option>
                            <option value="cooking">Cooking</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Orders List */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                            <th className="pb-3">Order #</th>
                            <th className="pb-3">Table</th>
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Total</th>
                            <th className="pb-3">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrders.map((order, index) => (
                            <tr key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                                <td className="py-3 text-gray-800 dark:text-white">{order.orderNumber}</td>
                                <td className="py-3 text-gray-800 dark:text-white">{order.tableNumber}</td>
                                <td className="py-3 text-gray-800 dark:text-white">{new Date(order.timestamp).toLocaleString()}</td>
                                <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                </td>
                                <td className="py-3 text-gray-800 dark:text-white">₹{order.totalPrice}</td>
                                <td className="py-3">
                                    <button onClick={() => setShowOrderDetails(order)} className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {showOrderDetails && <OrderDetailsModal order={showOrderDetails} onClose={() => setShowOrderDetails(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default OrdersPage;
