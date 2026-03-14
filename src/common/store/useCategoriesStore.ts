import { create } from "zustand";
import { getCategories, deleteCategory } from "../../services/categoriesApi";


export interface Category {
  id: number;
  name: string;
  img_url: string;
  description: string;
  created_at: string;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
  removeCategory: (id: number) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  loading: false,

  fetchCategories: async () => {
    set({ loading: true });

    const data = await getCategories();

    set({
      categories: data,
      loading: false,
    });
  },

  removeCategory: async (id: number) => {
    await deleteCategory(id);

    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
  },
}));