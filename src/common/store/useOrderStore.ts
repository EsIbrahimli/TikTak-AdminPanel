import { create } from "zustand";
import { AxiosError } from "axios";
import { fetchOrders, fetchOrdersStats } from "../../services/ordersApi";
import { useAuthStore } from "./useAuthStore";

export interface OrderItem {
  quantity: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  createdAt: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: "PENDING" | "PREPARING" | "DELIVERED" | "CANCELED";
}

interface OrderStats {
  TOTAL: number;
  TOTAL_REVENUE: number;
  PENDING: number;
  PREPARING: number;
  DELIVERED: number;
  CANCELED?: number;
}

interface OrdersApiResponse {
  data?: Order[];
  orders?: Order[];
}

interface StatsApiResponse {
  data?: Partial<OrderStats>;
  TOTAL?: number;
  TOTAL_REVENUE?: number;
  PENDING?: number;
  PREPARING?: number;
  DELIVERED?: number;
  CANCELED?: number;
}

interface OrderState {
  orders: Order[];
  totalOrders: number;
  totalSales: number;
  pending: number;
  preparing: number;
  delivered: number;
  canceled: number;
  loading: boolean;
  error: string | null;
  getOrdersAndStats: () => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
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
    const token = useAuthStore.getState().token ?? localStorage.getItem("token");

    if (!token) {
      set({
        orders: [],
        loading: false,
        error: "Unauthorized",
      });
      return;
    }

    set({ loading: true, error: null });

    try {
      const ordersRaw = (await fetchOrders()) as Order[] | OrdersApiResponse;
      const statsRaw = (await fetchOrdersStats()) as OrderStats | StatsApiResponse;

      const normalizedOrders = Array.isArray(ordersRaw)
        ? ordersRaw
        : Array.isArray(ordersRaw?.data)
          ? ordersRaw.data
          : Array.isArray(ordersRaw?.orders)
            ? ordersRaw.orders
            : [];

      const statsData =
        "data" in (statsRaw as StatsApiResponse) && (statsRaw as StatsApiResponse).data
          ? (statsRaw as StatsApiResponse).data
          : (statsRaw as StatsApiResponse);

      set({
        orders: normalizedOrders,
        totalOrders: Number(statsData.TOTAL ?? 0),
        totalSales: Number(statsData.TOTAL_REVENUE ?? 0),
        pending: Number(statsData.PENDING ?? 0),
        preparing: Number(statsData.PREPARING ?? 0),
        delivered: Number(statsData.DELIVERED ?? 0),
        canceled: Number(statsData.CANCELED ?? 0),
        loading: false,
      });
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const status = axiosError.response?.status;

      if (status === 401) {
        useAuthStore.getState().logout();
        set({
          orders: [],
          totalOrders: 0,
          totalSales: 0,
          pending: 0,
          preparing: 0,
          delivered: 0,
          canceled: 0,
          error: "Unauthorized",
          loading: false,
        });
        return;
      }

      const message =
        axiosError.response?.data?.message ||
        (err instanceof Error
          ? err.message
          : "Sifarişlər alınarkən xəta baş verdi");

      set({
        error: message,
        loading: false,
      });
    }
  },
}));