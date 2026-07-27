import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosAdminClientDelete,
    axiosAdminClientIsRead, axiosAdminClientIsVisible,
    axiosAdminClientsList
} from "@/shared/services/admin/clientAdmin.service";

interface ClientAdminState {
    clients: any
    loading: boolean

    clientAdminList: () => void
    clientAdminIsRead: (id: number) => void
    clientIsVisible: (id: number) => void
    clientAdminDelete: (id: number) => void
}

export const useClientAdminStore = create<ClientAdminState>()(
    persist((set, get) => ({
        clients: [],
        loading: false,

        clientAdminList: async () => {
            try {
                set({ clients: [], loading: true })
                const data = await axiosAdminClientsList()
                set({ clients: data.clients, loading: false })
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        clientAdminIsRead: async (id: number) => {
            try {
                await axiosAdminClientIsRead(id)
                await get().clientAdminList()
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        clientIsVisible: async (id: number) => {
            try {
                await axiosAdminClientIsVisible(id)
                await get().clientAdminList()
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        clientAdminDelete: async (id: number) => {
            try {
                await axiosAdminClientDelete(id)
                await get().clientAdminList()
            } catch(err) {
                console.log(err)
                throw err
            }
        }

    }), {name: 'client-admin-state'})
)