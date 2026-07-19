import axios from "axios";
import {useAuthStore} from "@/store/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function login(data: {email: string, password: string}) {
    try {
        const response = await axios.post(`${BASE_URL}/api/login_check`, {
            username: data.email,
            password: data.password,
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`La connexion a échouée : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function registerUser(data: any) {
    try {
        const response = await axios.post(`${BASE_URL}/api/register`, data)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`L\'inscription a échouée : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function infoMe() {
    try {
        const response = await axios.get(`${BASE_URL}/api/user/account/me`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération de l'utilisateur connecté : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function emailExisting(email: string) {
    try {
        const response = await axios.post(`${BASE_URL}/api/user/email/existing`, {email})
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`La vérification d'email a échouée : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosRequestPassword(data: {email: string}) {
    try {
        const response = await axios.post(`${BASE_URL}/api/user/request-password`, data)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de l'envoi de la notification par email : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosResetPassword(data: any, token: string) {
    try {
        const response = await axios.post(`${BASE_URL}/api/user/reset-password/${token}`, data)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la modification du mot de passe : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

axios.defaults.withCredentials = true

axios.interceptors.request.use((config) => {
        const token = useAuthStore.getState().token
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`
            } as any
        }
        return config
    },
    (error) => Promise.reject(error)
)

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const authStore = useAuthStore.getState()
        const hasAuthHeader = Boolean(
            error.config?.headers?.Authorization ||
            error.config?.headers?.authorization
        )
        if (error.response?.status === 401 && hasAuthHeader) {
            authStore.logout()
            window.location.href = '/'
        }
        return Promise.reject(error)
    }
)
