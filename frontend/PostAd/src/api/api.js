import axios from "axios";

const apiUrl = process.env.VITE_API_URL; 

// This is the correct and simplest way
const API = axios.create({
  baseURL: apiUrl,
});

export default API;