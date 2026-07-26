import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosAccountUserDetails, axiosAccountUserEdit} from "@/shared/services/user/accountUser.service";

export const useAccountUserStore = create()(
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
                const apiError = err?.response?.data
                if (apiError?.type === 'ACCOUNT_ERROR_EDIT_USER') {
                    set({ error: apiError?.message || 'Les données n\'ont pas pu être modifiées' })
                } else {
                    set({ error: 'Les données n\'ont pas pu être modifiées' })
                }
                throw err
            }
        },

        clearError: () => {
            console.log('clearError appelé')
            set({ error: null })
        },

    }), {name: 'account-user-state'})
)