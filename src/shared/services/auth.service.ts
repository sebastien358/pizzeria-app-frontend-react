import axios from "axios";
import {useAuthStore} from "@/store/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function login(data) {
    try {
        const response = await axios.post(`${BASE_URL}/api/login_check`, {
            username: data.email,
            password: data.password,
        })

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }

        throw new Error(`La connexion a échouée :  ${response.status}`)
    } catch (e) {
        console.error(e)
        throw e
    }
}

export async function infoMe() {
    try {
        const response = await axios.get(`${BASE_URL}/api/user/account/me`)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }

        throw new Error(`Erreur de la récupération de l'utilisateur connecté :  ${response.status}`)
    } catch (e) {
        console.error(e)
        throw e
    }
}

axios.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`
        }
    }
    return config
},
    (error) => Promise.reject(error)
)