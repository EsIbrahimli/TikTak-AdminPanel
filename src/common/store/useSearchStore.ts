import { create } from "zustand";
import { axiosInstance } from "../../services/axiosInstance";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface SearchState {
  query: string;
  results: Product[];
  loading: boolean;

  setQuery: (value: string) => void;
  searchProducts: (value: string) => void;
  clear: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  results: [],
  loading: false,

  setQuery: (value) => set({ query: value }),

  searchProducts: async (value) => {
      console.log("SEARCH VALUE:", value);
    if (value.trim().length < 2) {
      set({ results: [] });
      return;
    }

    try {
      set({ loading: true });

      const res = await axiosInstance.get("admin/products", {
        params: { 
            page: 1,
            limit: 10,
            search: value,
             _t: Date.now()
         },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.products || [];

      set({ results: data });
    } catch (err) {
      set({ results: [] });
    } finally {
      set({ loading: false });
    }
  },

  clear: () => set({ query: "", results: [] }),
}));