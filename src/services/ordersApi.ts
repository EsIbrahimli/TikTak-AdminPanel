import {axiosInstance} from "./axiosInstance";

export const fetchOrders = async () => {
  const response = await axiosInstance.get("/orders/admin");
  return response.data;
};

export const fetchOrdersStats = async () => {
  const response = await axiosInstance.get("/orders/admin/stats");
  return response.data;
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const response = await axiosInstance.put(`/orders/admin/${orderId}/status`, { status });
  return response.data;
}
