import {axiosInstance} from "./axiosInstance";

export const fetchOrders = async () => {
  const response = await axiosInstance.get("/orders/admin");
  return response.data.data;
};

export const fetchOrdersStats = async () => {
  const response = await axiosInstance.get("/orders/admin/stats");
  return response.data;
};