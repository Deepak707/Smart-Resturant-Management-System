import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import menuItem from '../../../Backend/api/menuItem';

function WaiterDashboard() {
  const [tables, setTables] = useState([
    { number: 1, status: 'Available' },
    { number: 2, status: 'Available' },
    { number: 3, status: 'Available' },
    // More tables
  ]);

  const[pending, setPending]=useState([])

  const toggleTableStatus = (tableNumber) => {
    setTables(tables.map(table => 
      table.number === tableNumber
        ? { 
            ...table, 
            status: table.status === 'Available' ? 'Occupied' : 'Available' 
          }
        : table
    ));
  };

  const readyOrder=async()=>{
    try{
      const response=await menuItem("/orders")
      const redyorders=response.data.filter(order=>order.status=="Ready")
      return redyorders
    }
    catch(error){
      console.error("error in fetching the ready orders",error)
      return[]
    }
  }

  // useEffect(()=>{
  //   const read_orders=async()=>{
  //     const allorders=await readyOrder()
  //     if(allorders) setPending(allorders)
  //   }
  // read_orders()
  // },[])

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const allOrders = await readyOrder();
      if (allOrders.length > 0) {
        setPending(prev => {
          const newOrders = allOrders.filter(order => !prev.some(p => p.id === order.id));
          return [...newOrders, ...prev];
        });
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-r from-purple-100 to-purple-200 min-h-screen"
    >
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Waiters Table Management
        </h1>

        <div className="grid grid-cols-4 gap-6">
          {tables.map(table => (
            <motion.div 
              key={table.number}
              whileHover={{ scale: 1.05 }}
              onClick={() => toggleTableStatus(table.number)}
              className={`p-6 rounded-lg shadow-lg text-center cursor-pointer
                ${table.status === 'Available' 
                  ? 'bg-green-100 border-green-500' 
                  : 'bg-red-100 border-red-500'
                }`}
            >
              <h2 className="text-2xl font-bold mb-4">
                Table {table.number}
              </h2>
              <div className={`text-lg font-semibold
                ${table.status === 'Available' 
                  ? 'text-green-700' 
                  : 'text-red-700'
                }`}>
                {table.status}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="mt-8 bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">
            Pending Order Notifications
          </h2>
          <div className="space-y-4">
          {pending.length > 0 ? (
          pending.map(item=>(
            <div key={item.tableNumber} className="bg-blue-50 p-4 rounde d-lg">
              <span>
                Table {item.tableNumber} : {item.items.map(i=>`${i.quantity} ${i.name}`).join(", ")}
                </span>
            </div>
            ))
          ):(
            <p>No pending orders at the moment.</p>
          )}
          </div>
          

        </motion.div>
      </div>
    </motion.div>
  );
}

export default WaiterDashboard;