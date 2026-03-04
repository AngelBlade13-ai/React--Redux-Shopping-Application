import axios from "axios";

const apiUrl =
  process.env.REACT_APP_API_URL ||
  process.env.VITE_API_URL ||
  "http://localhost:1337/api";
const apiToken = process.env.REACT_APP_API_TOKEN || process.env.VITE_API_TOKEN || "";

export const makeRequest = axios.create({
  baseURL: apiUrl,
  headers: apiToken ? { Authorization: "bearer " + apiToken } : {},
});
