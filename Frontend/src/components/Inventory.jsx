import { motion } from 'framer-motion';

const Inventory = ({ loading }) => {
    // Dummy inventory data – replace with API data as needed
    const inventoryItems = [
        { id: 'I101', name: 'Burger Buns', stock: 100, unit: 'pcs' },
        { id: 'I102', name: 'Chicken Patty', stock: 50, unit: 'pcs' },
        { id: 'I103', name: 'Lettuce', stock: 30, unit: 'kg' },
        { id: 'I104', name: 'Tomato', stock: 25, unit: 'kg' },
        { id: 'I105', name: 'Cheese Slices', stock: 200, unit: 'pcs' }
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
                Inventory Management
            </motion.h1>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                            <th className="pb-3">Item ID</th>
                            <th className="pb-3">Name</th>
                            <th className="pb-3">Stock Level</th>
                            <th className="pb-3">Unit</th>
                        </tr>
                        </thead>
                        <tbody>
                        {inventoryItems.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                                <td className="py-3 text-gray-800 dark:text-white">{item.id}</td>
                                <td className="py-3 text-gray-800 dark:text-white">{item.name}</td>
                                <td className="py-3 text-gray-800 dark:text-white">{item.stock}</td>
                                <td className="py-3 text-gray-800 dark:text-white">{item.unit}</td>
                            </tr>
                        ))}
                        {inventoryItems.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-gray-500 dark:text-gray-400">
                                    No inventory items found.
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

export default Inventory;
