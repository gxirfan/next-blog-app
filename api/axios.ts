import axios from "axios";
import { ENV } from "@/config/env.config";

const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 5000,
  withCredentials: true,
});

export default api;
