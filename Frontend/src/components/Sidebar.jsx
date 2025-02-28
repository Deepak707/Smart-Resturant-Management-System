import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiUsers, FiBox, FiUser, FiBarChart2, FiMenu, FiX } from 'react-icons/fi';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Hamburger Button for Mobile */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2 rounded"
                onClick={() => setIsOpen(true)}
            >
                <FiMenu className="w-6 h-6" />
            </button>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 w-64 h-screen bg-white dark:bg-gray-900 shadow-md p-6 transform transition-transform duration-300 z-50
                ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                {/* Close Button for Mobile */}
                <button
                    className="md:hidden absolute top-4 right-4 text-gray-600 dark:text-gray-300"
                    onClick={() => setIsOpen(false)}
                >
                    <FiX className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
                    Restaurant Manager
                </h2>

                <nav className="space-y-4">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center p-2 bg-indigo-600 text-white rounded"
                                : "flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        <FiHome className="mr-3" /> Dashboard
                    </NavLink>
                    <NavLink
                        to="/orders"
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center p-2 bg-indigo-600 text-white rounded"
                                : "flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        <FiShoppingBag className="mr-3" /> Orders
                    </NavLink>
                    <NavLink
                        to="/customers"
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center p-2 bg-indigo-600 text-white rounded"
                                : "flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        <FiUsers className="mr-3" /> Customers
                    </NavLink>
                    <NavLink
                        to="/inventory"
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center p-2 bg-indigo-600 text-white rounded"
                                : "flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        <FiBox className="mr-3" /> Inventory
                    </NavLink>
                    <NavLink
                        to="/staff"
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center p-2 bg-indigo-600 text-white rounded"
                                : "flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        <FiUser className="mr-3" /> Staff
                    </NavLink>
                    <NavLink
                        to="/reports"
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center p-2 bg-indigo-600 text-white rounded"
                                : "flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        <FiBarChart2 className="mr-3" /> Reports
                    </NavLink>
                </nav>
            </div>

            {/* Background Overlay for Mobile Sidebar */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Sidebar;
