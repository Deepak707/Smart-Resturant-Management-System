import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

const Reports = ({ orderData, loading }) => {
    const [dateRange, setDateRange] = useState('today');

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    // Process order data for reports
    const processReportsData = () => {
        if (!orderData || orderData.length === 0) {
            return {
                ordersByDate: {},
                totalSalesByDate: {},
                ordersByStatus: {},
                topItems: {}
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

        const ordersByDate = {};
        const totalSalesByDate = {};
        const ordersByStatus = {};
        const topItems = {};

        filteredOrders.forEach(order => {
            const date = new Date(order.timestamp).toLocaleDateString();
            ordersByDate[date] = (ordersByDate[date] || 0) + 1;
            totalSalesByDate[date] = (totalSalesByDate[date] || 0) + order.totalPrice;
            ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;

            order.items.forEach(item => {
                topItems[item.name] = (topItems[item.name] || 0) + item.quantity;
            });
        });

        return {
            ordersByDate,
            totalSalesByDate,
            ordersByStatus,
            topItems
        };
    };

    const reportData = processReportsData();

    // Daily Orders Chart Data
    const dailyOrdersChartData = {
        labels: Object.keys(reportData.ordersByDate),
        datasets: [
            {
                label: 'Orders',
                data: Object.values(reportData.ordersByDate),
                backgroundColor: 'rgba(99, 102, 241, 0.6)'
            }
        ]
    };

    // Total Sales Chart Data
    const totalSalesChartData = {
        labels: Object.keys(reportData.totalSalesByDate),
        datasets: [
            {
                label: 'Total Sales (₹)',
                data: Object.values(reportData.totalSalesByDate),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.3,
                fill: true
            }
        ]
    };

    // Sales by Status Chart Data
    const orderStatusChartData = {
        labels: Object.keys(reportData.ordersByStatus),
        datasets: [
            {
                label: 'Orders by Status',
                data: Object.values(reportData.ordersByStatus),
                backgroundColor: [
                    'rgba(99, 255, 132, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ]
            }
        ]
    };

    // Top Selling Items Chart Data
    const topItemsChartData = {
        labels: Object.keys(reportData.topItems),
        datasets: [
            {
                label: 'Top Items Sold',
                data: Object.values(reportData.topItems),
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }
        ]
    };

    return (
        <div className="space-y-8">
            <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold text-gray-800 dark:text-white"
            >
                Reports & Analytics
            </motion.h1>

            {/* Date Range Filter */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4"
            >
                <label className="text-gray-800 dark:text-white font-medium">Select Date Range:</label>
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="ml-3 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="all">All Time</option>
                </select>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Orders Report */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Daily Orders Report
                    </h2>
                    <div className="h-64">
                        <Bar data={dailyOrdersChartData} options={{ maintainAspectRatio: false, responsive: true }} />
                    </div>
                </motion.div>

                {/* Total Sales Report */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Total Sales Report
                    </h2>
                    <div className="h-64">
                        <Line data={totalSalesChartData} options={{ maintainAspectRatio: false, responsive: true }} />
                    </div>
                </motion.div>

                {/* Orders by Status */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Orders by Status
                    </h2>
                    <div className="h-64">
                        <Doughnut data={orderStatusChartData} options={{ maintainAspectRatio: false, responsive: true }} />
                    </div>
                </motion.div>

                {/* Top Selling Items */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Top Selling Items
                    </h2>
                    <div className="h-64">
                        <Bar data={topItemsChartData} options={{ maintainAspectRatio: false, responsive: true }} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Reports;
