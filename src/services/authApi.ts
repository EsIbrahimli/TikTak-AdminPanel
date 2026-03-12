import { axiosInstance } from "./axiosInstance"

export const AuthApi = {
  login: async (phone: string, password: string) => {
    try {
      const res = await axiosInstance.post("auth/admin/login", {
        phone,
        password
      })

      return res.data
    } catch (error) {
      console.error("Login API error:", error)
      throw error
    }
  }
}