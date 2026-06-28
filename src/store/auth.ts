import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {infoMe, login} from "@/shared/services/auth.service";

type User = { id: number; email: string; roles: string[] }

type AuthState = {
    token: string | null
    user: User | null
    loading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist((set, get) => ({
        token: null,
        user: null,
        loading: false,
        error: null,

        login: async (data) => {
            try {
                set({ error: null })
                const { token } = await login(data)
                set({ token: token })
                await get().infoMe()
            } catch (err: any) {
                set({ error: 'La connexion a échouée' })
                throw  err
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

        isAdmin: () => get().user?.roles.includes('ROLE_ADMIN') ?? false,

        isUser: () => get().user?.roles.includes('ROLE_USER') ?? false,

        logout: () => {
            set({ token: null, user: null, error: null })
        },

        clearError: () => set({ error: null })
    }),
        { name: 'auth-storage' }
    )
)