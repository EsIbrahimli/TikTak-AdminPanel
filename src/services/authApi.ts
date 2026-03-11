import axios from "axios"

export const authApi = {
    login: (phone: string, password: number) => {
        return axios.post('/api/auth/login', { phone, password })
    }
}

