import { create } from "zustand";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../services/categoriesApi";
import type { Category, CategoryPayload } from "../../services/categoriesApi";

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (payload: CategoryPayload) => Promise<void>;
  editCategory: (id: number, payload: Partial<CategoryPayload>) => Promise<void>;
  removeCategory: (id: number) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  loading: false,

  fetchCategories: async () => {
    set({ loading: true });
    try {
      const data = await getCategories();

      set({
        categories: data,
      });
    } finally {
      set({ loading: false });
    }
  },

  addCategory: async (payload) => {
    set({ loading: true });
    try {
      const createdCategory = await createCategory(payload);

      set((state) => ({
        categories: [createdCategory, ...state.categories],
      }));
    } finally {
      set({ loading: false });
    }
  },

  editCategory: async (id, payload) => {
    set({ loading: true });
    try {
      const updatedCategory = await updateCategory(id, payload);

      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? updatedCategory : category
        ),
      }));
    } finally {
      set({ loading: false });
    }
  },

  removeCategory: async (id: number) => {
    set({ loading: true });
    try {
      await deleteCategory(id);

      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
    } finally {
      set({ loading: false });
    }
  },
}));