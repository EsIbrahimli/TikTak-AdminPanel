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
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (payload: ProductPayload) => Promise<boolean>;
  editProduct: (id: number, payload: Partial<ProductPayload>) => Promise<boolean>;
  removeProduct: (id: number) => Promise<boolean>;
}

const toNum = (val: unknown): number | null => {
  if (typeof val === "number" && Number.isFinite(val)) return val;
  if (typeof val === "string" && val.trim()) {
    const parsed = Number(val);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeSingleProduct = (obj: unknown): Product | null => {
  if (!obj || typeof obj !== "object") return null;
  
  const data = obj as Record<string, unknown>;
  const id = toNum(data.id);
  
  if (id === null) return null;

  const categoryId =
    toNum(data.category_id) ??
    toNum((data.category as any)?.id) ??
    null;

  return {
    ...(data as unknown as Product),
    id,
    category_id: categoryId,
  };
};

const normalizeProducts = (data: unknown): Product[] => {
  const list = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
    ? (data as any).data
    : Array.isArray((data as any)?.products)
    ? (data as any).products
    : Array.isArray((data as any)?.data?.data)
    ? (data as any).data.data
    : [];

  return list
    .map((item) => normalizeSingleProduct(item))
    .filter((item): item is Product => item !== null);
};

const normalizeProduct = (data: unknown): Product | null => {
  let result = normalizeSingleProduct(data);
  if (result) return result;

  const obj = (data as Record<string, unknown>) ?? {};
  result = normalizeSingleProduct(obj.data);
  if (result) return result;

  result = normalizeSingleProduct((obj.data as any)?.data);
  if (result) return result;

  result = normalizeSingleProduct((obj.data as any)?.product);
  if (result) return result;

  result = normalizeSingleProduct(obj.product);
  if (result) return result;

  if (Array.isArray(obj.products) && obj.products.length > 0) {
    result = normalizeSingleProduct(obj.products[0]);
    if (result) return result;
  }

  return null;
};

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getProducts();
      set({ products: normalizeProducts(data), error: null });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : "Xəta" });
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await createProduct(payload);
      const normalized = normalizeProduct(res);
      if (!normalized) throw new Error("Invalid response");

      set((state) => ({
        products: [normalized, ...state.products],
        error: null,
      }));
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Xəta" });
        return false;
    } finally {
      set({ loading: false });
    }
  },

  editProduct: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await updateProduct(id, payload);
      const normalized = normalizeProduct(res);
      if (!normalized) throw new Error("Invalid response");

      set((state) => ({
        products: state.products.map((p) => (p.id === id ? normalized : p)),
        error: null,
      }));
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Xəta" });
        return false;
    } finally {
      set({ loading: false });
    }
  },

  removeProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        error: null,
      }));
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Xəta" });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));