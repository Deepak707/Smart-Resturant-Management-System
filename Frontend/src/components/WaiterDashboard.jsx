import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import menuItem from "../../../Backend/api/menuItem";
import { FiCheckCircle, FiClock, FiTable } from "react-icons/fi";

function WaiterDashboard() {
  const [tables, setTables] = useState([
    { number: 1, status: "Available" },
    { number: 2, status: "Available" },
    { number: 3, status: "Available" },
    { number: 4, status: "Available" },
    { number: 5, status: "Available" },
    { number: 6, status: "Available" },
  ]);

  const [pending, setPending] = useState([]);
  const lastFetchedOrders = useRef([]); // Store last fetched orders to prevent unnecessary updates

  const toggleTableStatus = (tableNumber) => {
    setTables((prevTables) =>
        prevTables.map((table) =>
            table.number === tableNumber
                ? {
                  ...table,
                  status: table.status === "Available" ? "Occupied" : "Available",
                }
                : table
        )
    );
  };

  const fetchReadyOrders = async () => {
    try {
      const response = await menuItem.get("/orders", {
        params: { status: "Ready" }, // Fetch only necessary data
      });

      const sortedOrders = response.data
          .filter((order) => order.status === "Ready")
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort newest first

      return sortedOrders;
    } catch (error) {
      console.error("Error fetching ready orders:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchOrdersFast = async () => {
      const allOrders = await fetchReadyOrders();
      if (
          JSON.stringify(allOrders) !== JSON.stringify(lastFetchedOrders.current)
      ) {
        setPending(allOrders);
        lastFetchedOrders.current = allOrders; // Store last fetched orders
      }
    };

    fetchOrdersFast(); // Fetch immediately on mount

    const intervalId = setInterval(fetchOrdersFast, 5000); // Faster updates (5 seconds)

    return () => clearInterval(intervalId);
  }, []);

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-6 flex flex-col items-center"
      >
        <h1 className="text-4xl font-extrabold text-center text-white mb-6">
          🍽️ Waiter Dashboard
        </h1>

        {/* Tables Management */}
        <div className="w-full max-w-5xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2 mb-4">
            <FiTable className="text-2xl" /> Manage Tables
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {tables.map((table) => (
                <motion.div
                    key={table.number}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => toggleTableStatus(table.number)}
                    className={`p-6 rounded-lg shadow-lg text-center cursor-pointer transition duration-200
                ${
                        table.status === "Available"
                            ? "bg-green-600 text-white border border-green-400"
                            : "bg-red-600 text-white border border-red-400"
                    }`}
                >
                  <h2 className="text-xl font-bold">Table {table.number}</h2>
                  <div className="text-lg font-semibold">{table.status}</div>
                </motion.div>
            ))}
          </div>
        </div>

        {/* Ready Orders Notifications */}
        <div className="mt-8 w-full max-w-5xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2 mb-4">
            <FiCheckCircle className="text-2xl" /> Ready to Serve Orders
          </h2>

          <div className="max-h-[300px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {pending.length > 0 ? (
                pending.map((item) => (
                    <div
                        key={item.id}
                        className="bg-gray-700 p-4 rounded-lg mb-4 border border-gray-600"
                    >
                      <div className="flex justify-between text-white">
                        <span className="font-medium">Table {item.tableNumber}</span>
                        <FiClock className="text-yellow-400" />
                      </div>
                      <p className="text-gray-300">
                        {item.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                      </p>
                    </div>
                ))
            ) : (
                <p className="text-gray-400">No orders ready to serve at the moment.</p>
            )}
          </div>
        </div>
      </motion.div>
  );
}

export default WaiterDashboard;
