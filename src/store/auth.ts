import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { axiosLogin } from "@/shared/services/auth.service";

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
    persist((set) => ({
        token: null,
        user: null,
        loading: false,
        error: null,

        login: async (data) => {
            try {
                set({ loading: true, error: null })
                const { token, user } = await axiosLogin(data)
                set({ token, user, loading: false })
            } catch (err: any) {
                set({ error: err.response?.data?.message || err.message, loading: false })
                throw  err
            }
        },

        logout: () => set({ token: null, user: null, error: null }),
    }),
        { name: 'auth-storage' }
    )
)