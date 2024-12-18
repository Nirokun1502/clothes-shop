import routes from "./routes";
import apiurls from "./apiurls";
import axios from "axios";
export const API_BASE_URL = "https://localhost:7121";
const jwt = localStorage.getItem("jwt");

export const header = {
  Authorization: `Bearer ${jwt}`,
  "Content-Type": "application/json",
};

const config = {
  routes,
  apiurls,
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${jwt}`,
  },
});

export default config;
