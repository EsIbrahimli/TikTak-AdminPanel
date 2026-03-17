import { create } from "zustand";
import { getUsers } from "../../services/usersApi";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UserStore {
  users: User[];
  loading: boolean;
  error: string | null;
  totalUsers: number;
  
  // Funksiya API çağırışı üçün
  getUsers: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  error: null,
  totalUsers: 0,

  getUsers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchUsers(); // API çağırışı
      set({ 
        users: data, 
        totalUsers: data.length, 
        loading: false 
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));