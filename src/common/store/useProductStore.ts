import { create } from "zustand";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/productsApi";
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

const toProduct = (obj: unknown): Product | null => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
  const data = obj as Record<string, unknown>;
  const id = Number(data.id);
  if (!Number.isFinite(id) || id <= 0) return null;

  const rawPrice = data.price;
  const numericPrice =
    typeof rawPrice === "number"
      ? rawPrice
      : typeof rawPrice === "string"
      ? Number(rawPrice)
      : 0;

  return {
    ...(data as unknown as Product),
    id,
    name:
      typeof data.name === "string"
        ? data.name
        : typeof data.title === "string"
        ? data.title
        : "",
    price: Number.isFinite(numericPrice) ? numericPrice : 0,
    category_id: Number(data.category_id) || Number((data.category as any)?.id) || null,
  };
};

const toProductList = (data: unknown): Product[] => {
  const list =
    Array.isArray(data) ? data :
    Array.isArray((data as any)?.data) ? (data as any).data :
    Array.isArray((data as any)?.products) ? (data as any).products :
    Array.isArray((data as any)?.data?.data) ? (data as any).data.data :
    [];
  return list.map(toProduct).filter((p: Product | null): p is Product => p !== null);
};

const toSingleProduct = (data: unknown): Product | null =>
  toProduct(data) ??
  toProduct((data as any)?.data) ??
  toProduct((data as any)?.product) ??
  toProduct((data as any)?.data?.data) ??
  toProduct((data as any)?.data?.product) ??
  null;

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getProducts();
      set({ products: toProductList(data), error: null });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Xəta" });
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await createProduct(payload);
      const product = toSingleProduct(res);
      if (product) {
        set((state) => ({ products: [product, ...state.products], error: null }));
      }
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
      const product = toSingleProduct(res);
      if (product) {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? product : p)),
          error: null,
        }));
      }
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
      set((state) => ({ products: state.products.filter((p) => p.id !== id), error: null }));
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Xəta" });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));