import { create } from "zustand";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productsApi";
import type { Product, ProductPayload } from "../../services/productsApi";

interface ProductsState {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (payload: ProductPayload) => Promise<void>;
  editProduct: (id: number, payload: Partial<ProductPayload>) => Promise<void>;
  removeProduct: (id: number) => Promise<void>;
}

type ProductsApiResponse =
  | Product[]
  | {
      data?: Product[] | { data?: Product[]; products?: Product[] };
      products?: Product[];
    };

type ProductApiResponse = unknown;

const normalizeProducts = (payload: ProductsApiResponse): Product[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.products)) {
    return payload.products;
  }

  if (payload?.data && typeof payload.data === "object") {
    if (Array.isArray(payload.data.data)) {
      return payload.data.data;
    }

    if (Array.isArray(payload.data.products)) {
      return payload.data.products;
    }
  }

  return [];
};

const normalizeProduct = (payload: ProductApiResponse): Product | null => {
  const asRecord = (value: unknown): Record<string, unknown> | null => {
    return value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : null;
  };

  const asProduct = (value: unknown): Product | null => {
    const record = asRecord(value);
    if (!record) {
      return null;
    }

    return typeof record.id === "number"
      ? (record as unknown as Product)
      : null;
  };

  const direct = asProduct(payload);
  if (direct) {
    return direct;
  }

  const payloadRecord = asRecord(payload);
  if (!payloadRecord) {
    return null;
  }

  const fromData = asProduct(payloadRecord.data);
  if (fromData) {
    return fromData;
  }

  const nestedDataRecord = asRecord(payloadRecord.data);
  const fromNestedData = asProduct(nestedDataRecord?.data);
  if (fromNestedData) {
    return fromNestedData;
  }

  const fromNestedProduct = asProduct(nestedDataRecord?.product);
  if (fromNestedProduct) {
    return fromNestedProduct;
  }

  return asProduct(payloadRecord.product);
};

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const data = await getProducts();
      const normalizedProducts = normalizeProducts(data as ProductsApiResponse);
      set({ products: normalizedProducts });
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (payload) => {
    set({ loading: true });
    try {
      const newProduct = await createProduct(payload);
      const normalizedProduct = normalizeProduct(newProduct as ProductApiResponse);

      if (!normalizedProduct) {
        return;
      }

      set((state) => ({
        products: [normalizedProduct, ...state.products],
      }));
    } finally {
      set({ loading: false });
    }
  },

  editProduct: async (id, payload) => {
    set({ loading: true });
    try {
      const updated = await updateProduct(id, payload);
      const normalizedProduct = normalizeProduct(updated as ProductApiResponse);

      if (!normalizedProduct) {
        return;
      }

      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? normalizedProduct : p
        ),
      }));
    } finally {
      set({ loading: false });
    }
  },

  removeProduct: async (id) => {
    set({ loading: true });
    try {
      await deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } finally {
      set({ loading: false });
    }
  },
}));