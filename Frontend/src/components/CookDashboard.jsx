import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import menuItem from '../../../Backend/api/menuItem';

function CookDashboard() {

  const [orders, setOrders] = useState([]);


  const pendingorders=async()=>{
    try{
    const response = await menuItem.get("/orders")
    const pendingorders=response.data.filter(order=> order.status=="pending")
    return pendingorders
    }
    catch(error){
console.error("error in fetching order", error)
return []
    }
  }

  useEffect(()=>{
    const pending_order=async()=>{
      const allorders= await pendingorders()
      if(allorders) setOrders(allorders)
    }
  pending_order()
  },[])

  const updateOrderStatus = async(orderId, newStatus) => {
    try {
      await menuItem.patch(`/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
    } catch (error) {
      console.error("Error updating order status", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const allOrders = await pendingorders();
      if (allOrders) setOrders(allOrders);
    }, 10000); 

    return () => clearInterval(intervalId);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-r from-green-100 to-green-200 min-h-screen"
    >
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Cook Kitchen Dashboard</h1>
        
        <div className="grid grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-yellow-600">
              Pending Orders
            </h2>
            {orders.filter(order => order.status === "pending").map(order => (
              <motion.div 
                key={order.id}
                whileHover={{ scale: 1.05 }}
                className="bg-yellow-50 p-4 rounded-lg mb-4"
              >
                <div className="flex justify-between">
                  <span>Table {order.tableNumber}</span>
                  <button 
                    onClick={() => updateOrderStatus(order.id, "cooking")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Start Cooking
                  </button>
                </div>
                {order.items.map(item => (
                  <div key={item.name} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-orange-600">
              Cooking
            </h2>
            {orders.filter(order => order.status === "cooking").map(order => (
              <motion.div 
                key={order.id}
                whileHover={{ scale: 1.05 }}
                className="bg-orange-50 p-4 rounded-lg mb-4"
              >
                <div className="flex justify-between">
                  <span>Table {order.tableNumber}</span>
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'Ready')}
                    className="bg-orange-500 text-white px-3 py-1 rounded"
                  >
                    Mark Ready
                  </button>
                </div>
                {order.items.map(item => (
                  <div key={item.name} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-green-600">
              Ready to Serve
            </h2>
            {orders.filter(order => order.status === 'Ready').map(order => (
              <motion.div 
                key={order.id}
                whileHover={{ scale: 1.05 }}
                className="bg-green-50 p-4 rounded-lg mb-4"
              >
                <div className="flex justify-between">
                  <span>Table {order.tableNumber}</span>
                </div>
                {order.items.map(item => (
                  <div key={item.name} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default CookDashboard