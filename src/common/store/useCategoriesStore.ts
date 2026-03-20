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

type CategoriesApiResponse =
  | Category[]
  | {
      data?: Category[] | { data?: Category[]; categories?: Category[] };
      categories?: Category[];
    };

type CategoryApiResponse = unknown;

const normalizeCategories = (payload: CategoriesApiResponse): Category[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.categories)) {
    return payload.categories;
  }

  if (payload?.data && typeof payload.data === "object") {
    if (Array.isArray(payload.data.data)) {
      return payload.data.data;
    }

    if (Array.isArray(payload.data.categories)) {
      return payload.data.categories;
    }
  }

  return [];
};

const normalizeCategory = (payload: CategoryApiResponse): Category | null => {
  const asRecord = (value: unknown): Record<string, unknown> | null => {
    return value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : null;
  };

  const asCategory = (value: unknown): Category | null => {
    const record = asRecord(value);
    if (!record) {
      return null;
    }

    return typeof record.id === "number"
      ? (record as unknown as Category)
      : null;
  };

  const directCategory = asCategory(payload);
  if (directCategory) {
    return directCategory;
  }

  const payloadRecord = asRecord(payload);
  if (!payloadRecord) {
    return null;
  }

  const dataCategory = asCategory(payloadRecord.data);
  if (dataCategory) {
    return dataCategory;
  }

  const nestedDataRecord = asRecord(payloadRecord.data);
  const nestedDataCategory = asCategory(nestedDataRecord?.data);
  if (nestedDataCategory) {
    return nestedDataCategory;
  }

  const nestedCategory = asCategory(nestedDataRecord?.category);
  if (nestedCategory) {
    return nestedCategory;
  }

  return asCategory(payloadRecord.category);
};

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  loading: false,

  fetchCategories: async () => {
    set({ loading: true });
    try {
      const data = await getCategories();
      const normalizedCategories = normalizeCategories(data as CategoriesApiResponse);

      set({
        categories: normalizedCategories,
      });
    } finally {
      set({ loading: false });
    }
  },

  addCategory: async (payload) => {
    set({ loading: true });
    try {
      const createdCategory = await createCategory(payload);
      const normalizedCreatedCategory = normalizeCategory(
        createdCategory as CategoryApiResponse
      );

      if (!normalizedCreatedCategory) {
        return;
      }

      set((state) => ({
        categories: [normalizedCreatedCategory, ...state.categories],
      }));
    } finally {
      set({ loading: false });
    }
  },

  editCategory: async (id, payload) => {
    set({ loading: true });
    try {
      const updatedCategory = await updateCategory(id, payload);
      const normalizedUpdatedCategory = normalizeCategory(
        updatedCategory as CategoryApiResponse
      );

      if (!normalizedUpdatedCategory) {
        return;
      }

      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? normalizedUpdatedCategory : category
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