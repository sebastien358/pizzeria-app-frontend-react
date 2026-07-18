import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
    axiosRequestPassword,
    axiosResetPassword,
    emailExisting,
    infoMe,
    login,
    registerUser
} from "@/shared/services/auth.service";

type User = { id: number; email: string; roles: string[] }

type LoginData = { email: string; password: string }

type AuthState = {
    token: string | null
    user: User | null
    loading: boolean
    error: string | null
    login: (data: LoginData) => Promise<void>
    logout: () => void
    isAdmin: () => boolean
    isUser: () => boolean
    infoMe: () => Promise<void>
    requestPassword: (data: any) => Promise<void>
    resetPassword: (data: any, token: string) => Promise<void>
    clearError: () => void,
    hasHydrated: boolean
    setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
    persist((set, get) => ({
        token: null,
        user: null,
        loading: false,
        error: null,
        hasHydrated: false,

        setHasHydrated: (state) => set({ hasHydrated: state }),


        login: async (data: LoginData) => {
            try {
                set({ error: null })
                const { token } = await login(data)
                set({ token: token })

                // Écrit le token dans un cookie pour que le middleware puisse le lire
                document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax; Secure`

                await get().infoMe()
            } catch (err: any) {
                set({ error: 'La connexion a échouée' })
                throw err
            }
        },

        registerUser: async (data: any) => {
            try {
                return await registerUser(data)
            } catch(err: any) {
                const errorApi = err.response?.data
                if (errorApi?.type === 'REGISTER_EMAIL_EXIST') {
                    set({ error: errorApi.message || 'Cet email est déjà utilisé' })
                } else {
                    set({ error: errorApi.message || 'Une erreur est survenue lors de l\'inscription' })
                }
                throw err
            }
        },

        infoMe: async () => {
            try {
                set({ user: null, error: null })
                const response = await infoMe()
                set({ user: response })
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        isAdmin: () => {
            const { user } = get()
            return user?.roles.includes('ROLE_ADMIN') ?? false
        },

        isUser: () => {
            const { user } = get()
            return user?.roles.includes('ROLE_USER') ?? false
        },

        emailExisting: async (email: string) => {
            try {
                return await emailExisting(email)
            } catch(err: any) {
                set({ error: 'Votre email n\'existe pas dans nos données' })
                console.error(err)
                throw err
            }
        },

        requestPassword: async (data) => {
            try {
                await axiosRequestPassword(data)
            } catch(err: any) {
                const apiError = err.response.data
                if (apiError?.type === 'ERROR-REQUEST-PASSWORD') {
                    set({ error: apiError?.message || 'Aucun compte n\'existe avec cet email' })
                }
                throw err
            }
        },

        resetPassword: async (data, token) => {
            try {
                await axiosResetPassword(data, token)
            } catch(err: any) {
                const apiError = err.response.data
                if (apiError?.type === 'ERROR-RESET-PASSWORD') {
                    set({ error: apiError?.message || 'Le mot de pas n\'a pas pu être modifié' })
                }
                throw err
            }
        },

        logout: () => {
            set({ token: null, user: null, error: null })
            // Supprime le cookie au logout
            document.cookie = 'token=; path=/; max-age=0; Secure'
        },

        clearError: () => set({ error: null })
    }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)
            }
        }
    )
)