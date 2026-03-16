import { axiosInstance } from "./axiosInstance"

const normalizePhone = (value: string) => {
  const trimmed = value.trim()
  let digitsOnly = trimmed.replace(/\D/g, "")

  if (!digitsOnly) {
    return trimmed
  }

  if (digitsOnly.startsWith("00")) {
    digitsOnly = digitsOnly.slice(2)
  }

  // Users often enter +9940XXXXXXXXX. Remove the trunk "0" after country code.
  if (digitsOnly.startsWith("9940") && digitsOnly.length === 13) {
    digitsOnly = `994${digitsOnly.slice(4)}`
  }

  if (digitsOnly.length === 10 && digitsOnly.startsWith("0")) {
    digitsOnly = `994${digitsOnly.slice(1)}`
  }

  if (digitsOnly.length === 9) {
    digitsOnly = `994${digitsOnly}`
  }

  return `+${digitsOnly}`
}

export const AuthApi = {
  login: async (phone: string, password: string) => {
    try {
      const res = await axiosInstance.post("auth/admin/login", {
        phone: normalizePhone(phone),
        password
      })

      return res
    } catch (error) {
      console.error("Login API error:", error)
      throw error
    }
  }
}