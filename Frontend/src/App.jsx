import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import OrdersPage from './components/OrdersPage';
import Inventory from './components/Inventory';
import Staff from './components/Staff';
import Reports from './components/Reports';

import CustomerDashboard from "./components/CustomerDashboard";
import CookDashboard from "./components/CookDashboard";
import WaiterDashboard from "./components/WaiterDashboard";

function App() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/orders')
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <Router>
            <Routes>
                {/* Routes without Sidebar (Separate Pages) */}
                <Route path="/customer" element={<CustomerDashboard />} />
                <Route path="/cook" element={<CookDashboard />} />
                <Route path="/waiter" element={<WaiterDashboard />} />

                {/* Routes with Sidebar Layout */}
                <Route
                    path="/*"
                    element={
                        <div className="flex">
                            <Sidebar />
                            <div className="flex-1 overflow-y-auto h-screen p-6 bg-gray-100 dark:bg-gray-800 md:ml-64">
                                <Routes>
                                    <Route path="/" element={<Dashboard orderData={orders} loading={loading} />} />
                                    <Route path="/orders" element={<OrdersPage orderData={orders} loading={loading} />} />
                                    <Route path="/inventory" element={<Inventory loading={loading} />} />
                                    <Route path="/staff" element={<Staff loading={loading} />} />
                                    <Route path="/reports" element={<Reports orderData={orders} loading={loading} />} />
                                </Routes>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
