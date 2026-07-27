import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosAccountAdmin, axiosAccountAdminEdit} from "@/shared/services/admin/accountAdmin.service";
import axios from "axios";

interface AccountAdminState {
    user: any
    loading: boolean
    error: string | null

    accountAdminDetails: () => void
    accountAdminEdit: (id: number, data: any) => void
    clearError: () => void
}

export const useAccountAdminStore = create<AccountAdminState>()(
    persist((set, get) => ({
        user: null,
        loading: false,
        error: null,

        accountAdminDetails: async () => {
            try {
                set({ user: null, loading: true })
                const data = await axiosAccountAdmin()
                set({ user: data, loading: false })
            } catch (err) {
                console.error(err)
                throw err
            }
        },

        accountAdminEdit: async (id: number, data: any) => {
            try {
                await axiosAccountAdminEdit(id, data)
            } catch(err) {
                const apiError = axios.isAxiosError(err) ? err?.response?.data : null
                if (apiError?.type === 'ACCOUNT_ERROR_EDIT_ADMIN') {
                    set({ error: apiError?.message || 'Les données n\'ont pas pu être modifiées' })
                } else {
                    set({ error: 'Les données n\'ont pas pu être modifiées' })
                }
                throw err
            }
        },

        clearError: () => set({ error: null })

    }),
        {name: 'account-admin-state'}
    )
)