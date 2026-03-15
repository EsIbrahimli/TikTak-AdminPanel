import { create } from "zustand";
import { fetchOrders, fetchOrdersStats } from "../../services/ordersApi";

export const useOrderStore = create((set) => ({
  orders: [],
  totalOrders: 0,
  totalSales: 0,
  pending: 0,
  preparing: 0,
  delivered: 0,
  canceled: 0,
  loading: false,
  error: null,

  getOrdersAndStats: async () => {
    set({ loading: true, error: null });

    try {
      const ordersData = await fetchOrders();
      const statsData = await fetchOrdersStats();

      set({
        orders: ordersData,
        totalOrders: statsData.TOTAL,
        totalSales: statsData.TOTAL_REVENUE,
        pending: statsData.PENDING,
        preparing: statsData.PREPARING,
        delivered: statsData.DELIVERED,
        canceled: statsData.CANCELED || 0,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || err.message,
        loading: false,
      });
    }
  },
}));