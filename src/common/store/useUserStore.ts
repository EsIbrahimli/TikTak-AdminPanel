import { create } from "zustand";
import { getUsers } from "../../services/usersApi";

interface User {
  id: number;
  full_name: string;
  phone: string;
  address?: string;
  img_url?: string;
  role: string;
}

interface UserStore {
  users: User[];
  loading: boolean;
  error: string | null;
  totalUsers: number;
  
  fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  error: null,
  totalUsers: 0,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getUsers();
      const normalizedUsers = Array.isArray(data) ? data : [];

      set({ 
        users: normalizedUsers, 
        totalUsers: normalizedUsers.length, 
        loading: false 
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'İstifadəçilər yüklənmədi';
      set({ error: message, loading: false });
    }
  },
}));