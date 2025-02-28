import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import menuItem from "../../../Backend/api/menuItem";
import { FiCheckCircle, FiClock, FiPlayCircle } from "react-icons/fi";

function CookDashboard() {
  const [orders, setOrders] = useState([]);

  // Fetch all orders from API
  const fetchOrders = async () => {
    try {
      const response = await menuItem.get("/orders");
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  };

  // Load and filter orders
  useEffect(() => {
    const loadOrders = async () => {
      const allOrders = await fetchOrders();
      if (allOrders) {
        setOrders(allOrders);
      }
    };
    loadOrders();
  }, []);

  // Update order status in API and state
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await menuItem.patch(`/orders/${orderId}`, { status: newStatus });

      setOrders((prevOrders) =>
          prevOrders.map((order) =>
              order.id === orderId ? { ...order, status: newStatus } : order
          )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  // Keep orders in "Cooking" until "Mark Ready" is clicked
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const allOrders = await fetchOrders();
      if (allOrders) {
        setOrders((prevOrders) => {
          const cookingOrders = prevOrders.filter(
              (order) => order.status === "cooking"
          );

          const updatedOrders = allOrders.filter(
              (order) => order.status !== "cooking"
          );

          return [...cookingOrders, ...updatedOrders];
        });
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Remove "Ready" orders older than 24 hours
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setOrders((prevOrders) =>
          prevOrders.filter((order) => {
            if (order.status !== "Ready") return true;
            const orderTime = new Date(order.timestamp);
            const hoursDiff = (now - orderTime) / (1000 * 60 * 60);
            return hoursDiff <= 24; // Keep orders within 24 hours
          })
      );
    }, 60000); // Run every minute

    return () => clearInterval(intervalId);
  }, []);

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-6 flex justify-center"
      >
        <div className="container mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-white mb-8">
            🍽️ Cook's Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pending Orders */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 shadow-lg rounded-xl p-6 border border-yellow-600"
            >
              <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2 mb-4">
                <FiClock className="text-2xl" /> Pending Orders
              </h2>
              <div className="max-h-[400px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {orders.filter((order) => order.status === "pending").length === 0 && (
                    <p className="text-gray-400">No pending orders.</p>
                )}
                {orders
                    .filter((order) => order.status === "pending")
                    .map((order) => (
                        <motion.div
                            key={order.id}
                            whileHover={{ scale: 1.05 }}
                            className="bg-yellow-900 p-4 rounded-lg mb-4 border border-yellow-600"
                        >
                          <div className="flex justify-between items-center">
                      <span className="text-yellow-300 font-medium">
                        Table {order.tableNumber}
                      </span>
                            <button
                                onClick={() => updateOrderStatus(order.id, "cooking")}
                                className="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded-lg transition duration-200"
                            >
                              <FiPlayCircle className="inline-block mr-1" /> Start
                            </button>
                          </div>
                          {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-gray-300">
                                <span>{item.name}</span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                          ))}
                        </motion.div>
                    ))}
              </div>
            </motion.div>

            {/* Cooking Orders */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 shadow-lg rounded-xl p-6 border border-orange-600"
            >
              <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2 mb-4">
                <FiPlayCircle className="text-2xl" /> Cooking Orders
              </h2>
              <div className="max-h-[400px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {orders.filter((order) => order.status === "cooking").length === 0 && (
                    <p className="text-gray-400">No orders currently being cooked.</p>
                )}
                {orders
                    .filter((order) => order.status === "cooking")
                    .map((order) => (
                        <motion.div
                            key={order.id}
                            whileHover={{ scale: 1.05 }}
                            className="bg-orange-900 p-4 rounded-lg mb-4 border border-orange-600"
                        >
                          <div className="flex justify-between items-center">
                      <span className="text-orange-300 font-medium">
                        Table {order.tableNumber}
                      </span>
                            <button
                                onClick={() => updateOrderStatus(order.id, "Ready")}
                                className="bg-orange-500 hover:bg-orange-400 text-white px-3 py-1 rounded-lg transition duration-200"
                            >
                              <FiCheckCircle className="inline-block mr-1" /> Mark Ready
                            </button>
                          </div>
                          {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-gray-300">
                                <span>{item.name}</span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                          ))}
                        </motion.div>
                    ))}
              </div>
            </motion.div>

            {/* Ready to Serve */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 shadow-lg rounded-xl p-6 border border-green-600"
            >
              <h2 className="text-xl font-bold text-green-400 flex items-center gap-2 mb-4">
                <FiCheckCircle className="text-2xl" /> Ready to Serve
              </h2>
              <div className="max-h-[400px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {orders.filter((order) => order.status === "Ready").length === 0 && (
                    <p className="text-gray-400">No orders ready to serve.</p>
                )}
                {orders
                    .filter((order) => order.status === "Ready")
                    .map((order) => (
                        <motion.div
                            key={order.id}
                            whileHover={{ scale: 1.05 }}
                            className="bg-green-900 p-4 rounded-lg mb-4 border border-green-600"
                        >
                          <div className="flex justify-between">
                      <span className="text-green-300 font-medium">
                        Table {order.tableNumber}
                      </span>
                          </div>
                          {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-gray-300">
                                <span>{item.name}</span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                          ))}
                        </motion.div>
                    ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
  );
}

export default CookDashboard;