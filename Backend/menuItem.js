import axios from "axios"

const API_BASE_URL = "https://smart-resturant-management-system.onrender.com/api" || "http://localhost:5000/api"



export default axios.create({
    baseURL: API_BASE_URL
})