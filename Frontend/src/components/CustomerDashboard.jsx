import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import menuItemApi from '../../../Backend/menuItem.js';



function CustomerDashboard() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [allmenu,setAllmenu]=useState([])

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    checkDeviceType();

    window.addEventListener('resize', checkDeviceType);

    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);



  const menuItems= async ()=>{
    const response= await menuItemApi.get("/menuItems")
    return response.data
  } 



  useEffect(()=>{
    const fetchmenuitems=async()=>{
      const allItems=await menuItems()
      if(allItems) setAllmenu(allItems)
    }

    fetchmenuitems()
  },[])

  const addToOrder = (item) => {
    const existingItemIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );
  
    if (existingItemIndex !== -1) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: (updatedItems[existingItemIndex].quantity || 1) + 1
      };
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([
        ...selectedItems, 
        { ...item, quantity: 1 }
      ]);
    }
  };

  const updateItemQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeFromOrder(index);
      return;
    }
    const updatedItems = [...selectedItems];
  updatedItems[index] = {
    ...updatedItems[index],
    quantity: newQuantity
  };
  setSelectedItems(updatedItems);
};

  const removeFromOrder = (index) => {
    const newSelectedItems = [...selectedItems];
    newSelectedItems.splice(index, 1);
    setSelectedItems(newSelectedItems);
  };

  const handleConfirmOrder = async() => {
    if (!tableNumber.trim()) {
      alert('Please enter a table number');
      return;
    }

    if (selectedItems.length === 0) {
      alert('Please add items to your order');
      return;
    }

    const newOrderNumber = `ORDER-${Math.floor(Math.random() * 1000000)}`;   
    const totalPrice = selectedItems.reduce(
      (total, item) => total + (item.price * (item.quantity || 1)), 
      0
    );

    const orderData = {
      orderNumber: newOrderNumber,
      tableNumber: tableNumber,
      items: selectedItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1
      })),
      totalPrice: totalPrice,
      timestamp: new Date().toISOString(),
      status:"pending"
    };
    

    try {
      const response = await menuItemApi.post('/orders', orderData);
      if (response.status === 201) {
        setOrderNumber(newOrderNumber);
        setIsOrderPlaced(true);
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  
  };

  const handleReorder = () => {
    setSelectedItems([]);
    setTableNumber('');
    setIsOrderPlaced(false);
    setOrderNumber('');
  };

  if (isOrderPlaced) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md w-full"
        >
          <div className="text-green-500 mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-20 w-20 mx-auto" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">Your order has been received.</p>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="font-semibold">Order Number:</p>
            <p className="text-xl font-bold text-blue-600">{orderNumber}</p>
          </div>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleReorder}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Reorder
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Mobile View
if (isMobile) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex flex-col"
    >
      <div className="flex-grow overflow-y-auto pb-[300px]">
        <h1 className="text-2xl font-bold text-center my-4">Order Menu</h1>

        <div className="grid grid-cols-2 gap-4 px-4">
          {allmenu.map(item => (
            <motion.div 
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-32 object-cover"
              />
              <div className="p-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">{item.name}</h3>
                  <span className="text-green-600">₹{item.price}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <button 
                    onClick={() => addToOrder(item)}
                    className="bg-blue-500 text-white py-1 px-3 rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg p-4 z-50"
        style={{ 
          height: '300px', 
          overflowY: 'auto' 
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Order</h2>
        </div>

        <input 
          type="text"
          placeholder="Table Number"
          className="w-full p-2 border rounded mb-4"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />

        <div className="space-y-2 max-h-[150px] overflow-y-auto">
          {selectedItems.map((item, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <div className="flex items-center">
                <span className="mr-2">{item.name}</span>
                <div className="flex items-center">
                  <button 
                    onClick={() => updateItemQuantity(index, (item.quantity || 1) - 1)}
                    className="bg-gray-200 px-2 rounded-l"
                  >
                    -
                  </button>
                  <span className="px-2 bg-gray-50">{item.quantity || 1}</span>
                  <button 
                    onClick={() => updateItemQuantity(index, (item.quantity || 1) + 1)}
                    className="bg-gray-200 px-2 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-2">
                  ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                </span>
                <button 
                  onClick={() => removeFromOrder(index)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex justify-between font-bold mb-2">
            <span>Total:</span>
            <span>
              ₹{selectedItems.reduce(
                (total, item) => total + (item.price * (item.quantity || 1)), 
                0
              ).toFixed(2)}
            </span>
          </div>

          <button 
            onClick={handleConfirmOrder}
            className="w-full bg-green-500 text-white py-2 rounded"
            disabled={selectedItems.length === 0 || !tableNumber.trim()}
          >
            Confirm Order
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

  // Tablet and Desktop View
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-r from-blue-100 to-blue-200 min-h-screen flex"
    >
      <div className="container mx-auto p-4 lg:p-8 flex flex-col lg:flex-row">
        <motion.div 
          className="w-full lg:w-[70%] bg-white rounded-lg shadow-lg p-4 lg:p-6 lg:mr-8 mb-4 lg:mb-0"
        >
          <h2 className="text-2xl font-semibold mb-4">Menu</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4">
            {allmenu.map(item => (
              <motion.div 
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white border rounded-lg shadow-md overflow-hidden"
              >
                <div className="h-32 md:h-40 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-2 md:p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm md:text-xl font-bold truncate">{item.name}</h3>
                    <span className="text-green-600 font-semibold text-xs md:text-base">
                      ₹{item.price}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <motion.button 
                    onClick={() => addToOrder(item)}
                    whileHover={{ backgroundColor: '#3b82f6' }}
                    className="w-full bg-blue-500 text-white py-1 md:py-2 rounded-md text-xs md:text-base transition-colors"
                  >
                    Add to Order
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
  
        <motion.div 
          className="w-full lg:w-[30%] bg-white rounded-lg shadow-lg p-4 lg:p-6 sticky top-8 h-fit"
        >
          <h2 className="text-xl lg:text-2xl font-semibold mb-4">Your Order</h2>
          <input 
            type="text" 
            placeholder="Enter Table Number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full p-2 mb-4 border rounded text-sm lg:text-base"
          />
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {selectedItems.map((item, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <div className="flex items-center">
                  <span className="text-sm lg:text-base">{item.name}</span>
                  <div className="flex items-center ml-2 lg:ml-4">
                    <button 
                      onClick={() => updateItemQuantity(index, (item.quantity || 1) - 1)}
                      className="px-1 lg:px-2 bg-gray-200 rounded-l text-sm"
                    >
                      -
                    </button>
                    <span className="px-1 lg:px-2 bg-gray-100 text-sm">
                      {item.quantity || 1}
                    </span>
                    <button 
                      onClick={() => updateItemQuantity(index, (item.quantity || 1) + 1)}
                      className="px-1 lg:px-2 bg-gray-200 rounded-r text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm lg:text-base">
                    ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => removeFromOrder(index)}
                    className="text-red-500 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between font-bold text-sm lg:text-base">
              <span>Total:</span>
              <span>
                ₹{selectedItems.reduce(
                  (total, item) => total + (item.price * (item.quantity || 1)), 
                  0
                ).toFixed(2)}
              </span>
            </div>
          </div>
  
          <motion.button 
            onClick={handleConfirmOrder}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-green-500 text-white py-2 mt-4 rounded hover:bg-green-600 transition-colors text-sm lg:text-base"
            disabled={selectedItems.length === 0 || !tableNumber.trim()}
          >
            Confirm Order
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default CustomerDashboard;