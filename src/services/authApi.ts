import axios from "axios"

export const authApi = {
    login: (phone: string, password: string) => {
        return axios.post('/api/auth/login', { phone, password })
    }
}



