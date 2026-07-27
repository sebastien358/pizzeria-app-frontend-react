import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosAccountDeleteUser,
    axiosAccountUserDetails,
    axiosAccountUserEdit
} from "@/shared/services/user/accountUser.service";
import axios from "axios";

interface AccountUserState {
    user: any
    loading: boolean
    error: string | null

    accountUserDetails: () => Promise<void>
    accountUserEdit: (id: number, data: any) => Promise<void>
    accountDeleteUser: () => void
    clearError: () => void
}

export const useAccountUserStore = create<AccountUserState>()(
    persist((set, get) => ({
        user: null,
        loading: false,
        error: null,

        accountUserDetails: async () => {
            try {
                set({ user: null, loading: true })
                const data = await axiosAccountUserDetails()
                set({ user: data, loading: false })
            } catch (err) {
                console.error(err)
                throw err
            }
        },

        accountUserEdit: async (id: number, data) => {
            try {
                await axiosAccountUserEdit(id, data)
            } catch(err) {
                const apiError = axios.isAxiosError(err) ? err.response?.data : null
                if (apiError?.type === 'ACCOUNT_ERROR_EDIT_USER') {
                    set({ error: apiError?.message || 'Les données n\'ont pas pu être modifiées' })
                } else {
                    set({ error: 'Les données n\'ont pas pu être modifiées' })
                }
                throw err
            }
        },

        accountDeleteUser: async () => {
            try {
                await axiosAccountDeleteUser()
            } catch (err) {
                throw err
            }
        },

        clearError: () => {
            set({ error: null })
        },

    }), {name: 'account-user-state'})
)