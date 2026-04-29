import { create } from "zustand"
import { AuthApi } from "../../services/authApi"

interface AuthState {
  token: string | null
  savedPhone: string
  savedPassword: string
  loading: boolean
  login: (phone: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  savedPhone: localStorage.getItem("savedPhone") ?? '+994559916601',
  savedPassword: '1234',
  loading: false,

  login: async (phone, password) => {
    set({ loading: true })
    try {
      const res = await AuthApi.login(phone, password)
      console.log("Login response:", res)

      const token =
        res.data?.data?.tokens?.access_token;

      if (!token) {
        throw new Error("Access token missing in login response")
      }

      localStorage.setItem("token", token)

      localStorage.setItem("savedPhone", phone)

      set({
        token,
        savedPhone: phone,
        savedPassword: password,
      })
    } finally {
      set({ loading: false })
    }
  },

  logout: () => {
    localStorage.removeItem("token")
    set({ token: null, savedPassword: '' });
  }
}))

