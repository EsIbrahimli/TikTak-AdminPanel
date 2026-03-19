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

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const data = await getProducts();
      set({ products: data });
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (payload) => {
    set({ loading: true });
    try {
      const newProduct = await createProduct(payload);
      set((state) => ({
        products: [newProduct, ...state.products],
      }));
    } finally {
      set({ loading: false });
    }
  },

  editProduct: async (id, payload) => {
    set({ loading: true });
    try {
      const updated = await updateProduct(id, payload);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? updated : p
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