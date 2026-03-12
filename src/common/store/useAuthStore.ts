import { create } from "zustand"
import { AuthApi } from "../../services/authApi"

interface AuthState {
  token: string | null
  loading: boolean
  login: (phone: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  loading: false,

  login: async (phone, password) => {
    set({ loading: true })

    const data = await AuthApi.login(phone, password)
    console.log("Login response:", data.data)

    localStorage.setItem("token", data.data.tokens.access_token)

    set({
      token: data.data.tokens.access_token,
      loading: false
    })
  },

  logout: () => {
    localStorage.removeItem("token")
    set({ token: null })
  }
}))

