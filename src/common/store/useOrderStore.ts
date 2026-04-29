import { create } from "zustand";
import { AxiosError } from "axios";
import { fetchOrders, fetchOrdersStats } from "../../services/ordersApi";
import { useAuthStore } from "./useAuthStore";

export interface OrderItem {
  id?: number | string;
  quantity: number;
  name?: string;
  image?: string;
  category?: string;
  weight?: string;
  price?: number;
  pricePerKg?: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  createdAt: string;
  address: string;
  phone?: string;
  paymentMethod?: string;
  deliveryPrice?: number;
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
  updateOrderStatusLocal: (id: number, status: Order["status"]) => void;
}

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

const toText = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

const toOrderItem = (value: unknown): OrderItem | null => {
  const data = asRecord(value);
  if (!data) {
    return null;
  }

  const product =
    asRecord(data.product) ??
    asRecord(data.item) ??
    asRecord(data.product_data) ??
    asRecord(data.productItem);

  const categoryData = asRecord(data.category) ?? asRecord(product?.category);
  const rawId = data.id ?? data.product_id ?? product?.id;
  const itemId = typeof rawId === "string" || typeof rawId === "number" ? rawId : undefined;

  return {
    id: itemId,
    quantity: toNumber(data.quantity ?? data.qty ?? data.count, 1),
    name: toText(data.name, product?.name, product?.title),
    image: toText(data.image, data.img_url, product?.image, product?.img_url),
    category: toText(
      data.category,
      categoryData?.name,
      product?.type,
      product?.category_name,
    ),
    weight: toText(data.weight, product?.weight, product?.gram, product?.size),
    price: toNumber(data.price ?? data.unit_price ?? product?.price, 0),
    pricePerKg: toNumber(
      data.pricePerKg ?? data.price_per_kg ?? product?.pricePerKg ?? product?.price_per_kg,
      0,
    ),
  };
};

const toOrder = (value: unknown): Order | null => {
  const data = asRecord(value);
  if (!data) {
    return null;
  }

  const id = toNumber(data.id, NaN);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  const itemsSource =
    (Array.isArray(data.items) ? data.items : null) ??
    (Array.isArray(data.order_items) ? data.order_items : null) ??
    (Array.isArray(data.orderItems) ? data.orderItems : null) ??
    [];

  const items = itemsSource
    .map(toOrderItem)
    .filter((item): item is OrderItem => item !== null);

  const rawStatus = toText(data.status).toUpperCase() as Order["status"] | "";

  return {
    id,
    orderNumber: toText(data.orderNumber, data.order_number, `ORD-${id}`),
    createdAt: toText(data.createdAt, data.created_at),
    address: toText(data.address, data.delivery_address, data.shipping_address),
    phone: toText(data.phone, data.phone_number, data.customer_phone),
    paymentMethod: toText(data.paymentMethod, data.payment_method),
    deliveryPrice: toNumber(data.deliveryPrice ?? data.delivery_price, 0),
    items,
    total: toNumber(data.total ?? data.total_price ?? data.subtotal, 0),
    status:
      rawStatus === "PENDING" ||
      rawStatus === "PREPARING" ||
      rawStatus === "DELIVERED" ||
      rawStatus === "CANCELED"
        ? rawStatus
        : "PENDING",
  };
};

const toOrderList = (value: unknown): Order[] => {
  const list: unknown[] = (
    Array.isArray(value)
      ? value
      : Array.isArray((value as OrdersApiResponse)?.data)
      ? (value as OrdersApiResponse).data
      : Array.isArray((value as OrdersApiResponse)?.orders)
      ? (value as OrdersApiResponse).orders
      : Array.isArray((value as { data?: { data?: unknown[] } })?.data?.data)
      ? (value as { data: { data: unknown[] } }).data.data
      : []) ?? [];

  return list.map(toOrder).filter((order): order is Order => order !== null);
};

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

  updateOrderStatusLocal: (id, status) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    }));
  },

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
      const normalizedOrders = toOrderList(ordersRaw);

      const statsData: Partial<OrderStats> =
        "data" in (statsRaw as StatsApiResponse) && (statsRaw as StatsApiResponse).data
          ? (statsRaw as StatsApiResponse).data!
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