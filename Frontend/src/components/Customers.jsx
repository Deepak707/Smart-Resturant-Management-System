// import { motion } from 'framer-motion';
//
// const Customers = ({ orderData, loading }) => {
//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-full">
//                 <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-600"></div>
//             </div>
//         );
//     }
//
//     // Aggregate customers from orderData
//     const customersMap = {};
//     orderData.forEach(order => {
//         if (!customersMap[order.customerId]) {
//             customersMap[order.customerId] = {
//                 id: order.customerId,
//                 name: order.customerName,
//                 email: order.customerEmail,
//                 phone: order.customerPhone,
//                 orders: 1
//             };
//         } else {
//             customersMap[order.customerId].orders += 1;
//         }
//     });
//     const customers = Object.values(customersMap);
//
//     return (
//         <div className="space-y-8">
//             <motion.h1
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="text-3xl font-bold text-gray-800 dark:text-white"
//             >
//                 Customers Management
//             </motion.h1>
//
//             <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead>
//                         <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
//                             <th className="pb-3">Customer ID</th>
//                             <th className="pb-3">Name</th>
//                             <th className="pb-3">Email</th>
//                             <th className="pb-3">Phone</th>
//                             <th className="pb-3">Orders</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {customers.map((customer, index) => (
//                             <tr key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
//                                 <td className="py-3 text-gray-800 dark:text-white">{customer.id}</td>
//                                 <td className="py-3 text-gray-800 dark:text-white">{customer.name}</td>
//                                 <td className="py-3 text-gray-800 dark:text-white">{customer.email}</td>
//                                 <td className="py-3 text-gray-800 dark:text-white">{customer.phone}</td>
//                                 <td className="py-3 text-gray-800 dark:text-white">{customer.orders}</td>
//                             </tr>
//                         ))}
//                         {customers.length === 0 && (
//                             <tr>
//                                 <td colSpan="5" className="text-center py-4 text-gray-500 dark:text-gray-400">
//                                     No customers found.
//                                 </td>
//                             </tr>
//                         )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Customers;
