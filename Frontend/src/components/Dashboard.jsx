import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiShoppingBag, FiActivity } from 'react-icons/fi';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

const Dashboard = ({ orderData, loading }) => {
    const [dateRange, setDateRange] = useState('today');

    // Process order data for dashboard analytics
    const processData = () => {
        if (!orderData || orderData.length === 0) {
            return {
                totalSales: 0,
                totalOrders: 0,
                averageOrder: 0,
                topItems: [],
                salesByCategory: {},
                salesOverTime: {}
            };
        }

        let filteredOrders = [...orderData];
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Filter orders based on selected date range
        if (dateRange !== 'all') {
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.timestamp);
                if (dateRange === 'today') return orderDate >= today;
                if (dateRange === 'week') {
                    const oneWeekAgo = new Date(today);
                    oneWeekAgo.setDate(today.getDate() - 7);
                    return orderDate >= oneWeekAgo;
                }
                if (dateRange === 'month') {
                    const oneMonthAgo = new Date(today);
                    oneMonthAgo.setMonth(today.getMonth() - 1);
                    return orderDate >= oneMonthAgo;
                }
                return true;
            });
        }

        // Compute total sales & total orders
        const totalSales = filteredOrders.reduce((total, order) => total + order.totalPrice, 0);
        const totalOrders = filteredOrders.length;
        const averageOrder = totalOrders > 0 ? totalSales / totalOrders : 0;

        // Top selling items calculation
        const itemCounts = {};
        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
            });
        });

        const topItems = Object.entries(itemCounts)
            .map(([name, quantity]) => ({ name, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        // Sales by category (Using item names instead of missing `category` field)
        const categorySales = {};
        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                categorySales[item.name] = (categorySales[item.name] || 0) + item.price * item.quantity;
            });
        });

        // Sales over time calculation
        const salesByDate = {};
        filteredOrders.forEach(order => {
            const date = new Date(order.timestamp).toLocaleDateString();
            salesByDate[date] = (salesByDate[date] || 0) + order.totalPrice;
        });

        return {
            totalSales,
            totalOrders,
            averageOrder,
            topItems,
            salesByCategory: categorySales,
            salesOverTime: salesByDate
        };
    };

    const dashboardData = processData();

    // Chart data for Sales Overview
    const salesChartData = {
        labels: Object.keys(dashboardData.salesOverTime),
        datasets: [
            {
                label: 'Sales',
                data: Object.values(dashboardData.salesOverTime),
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.3,
                fill: true
            }
        ]
    };

    // Chart data for Sales by Category
    const categoryChartData = {
        labels: Object.keys(dashboardData.salesByCategory),
        datasets: [
            {
                label: 'Sales by Item',
                data: Object.values(dashboardData.salesByCategory),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderWidth: 1
            }
        ]
    };

    // Animation variants for Framer Motion
    const containerVariant = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariant = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
    };

    const statCards = [
        {
            title: 'Total Sales',
            value: `₹${dashboardData.totalSales.toFixed(2)}`,
            icon: <FiDollarSign />,
            color: 'bg-indigo-600'
        },
        {
            title: 'Total Orders',
            value: dashboardData.totalOrders,
            icon: <FiShoppingBag />,
            color: 'bg-green-500'
        },
        {
            title: 'Avg. Order Value',
            value: `₹${dashboardData.averageOrder.toFixed(2)}`,
            icon: <FiActivity />,
            color: 'bg-purple-500'
        }
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
            <motion.div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold text-gray-800 dark:text-white"
                >
                    Dashboard
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 md:mt-0"
                >
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="all">All Time</option>
                    </select>
                </motion.div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                variants={containerVariant}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariant}
                        whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
                        className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className={`${stat.color} rounded-full p-3 text-white`}>
                                    {stat.icon}
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {stat.title}
                                    </h2>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Sales Overview
                    </h2>
                    <div className="h-64">
                        <Line data={salesChartData} options={{ maintainAspectRatio: false, responsive: true }} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Sales by Category
                    </h2>
                    <div className="h-64">
                        <Pie data={categoryChartData} options={{ maintainAspectRatio: false, responsive: true }} />
                    </div>
                </motion.div>
            </div>

            {/* Top Selling Items */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6"
            >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Top Selling Items
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                            <th className="pb-3">Item</th>
                            <th className="pb-3">Quantity Sold</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dashboardData.topItems.map((item, index) => (
                            <motion.tr
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 + index * 0.1 }}
                                className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                            >
                                <td className="py-3 text-gray-800 dark:text-white">{item.name}</td>
                                <td className="py-3 text-gray-800 dark:text-white">{item.quantity}</td>
                            </motion.tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
