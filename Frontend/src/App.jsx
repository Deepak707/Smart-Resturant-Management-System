import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerDashboard from "./components/CustomerDashboard"
import CookDashboard from "./components/CookDashboard"
import WaiterDashboard from "./components/WaiterDashboard"

function App() {

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<CustomerDashboard />} />
        <Route path="/cook" element={<CookDashboard />} />
        <Route path="/waiter" element={<WaiterDashboard />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
