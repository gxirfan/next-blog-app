import { ENV } from "@/config/env.config";
import axios from "axios";

const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
