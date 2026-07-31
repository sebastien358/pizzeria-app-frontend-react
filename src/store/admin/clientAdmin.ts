import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosAdminClientDelete,
    axiosAdminClientIsRead, axiosAdminClientIsVisible,
    axiosAdminClientsList, axiosAdminClientsSearch
} from "@/shared/services/admin/clientAdmin.service";

interface ClientAdminState {
    clients: any
    term: string
    loading: boolean
    countClients: number
    currentPage: number
    limit: number
    pages: number

    itemsPerPage: () => number
    clientAdminList: () => void
    previousPage: () => void
    nextPage: () => void
    searchAdminClients: (term: string) => void
    clientAdminIsRead: (id: number) => void
    clientIsVisible: (id: number) => void
    clientAdminDelete: (id: number) => void
}

export const useClientAdminStore = create<ClientAdminState>()(
    persist((set, get) => ({
        clients: [],
        term: "",
        loading: false,
        countClients: 0,
        currentPage: 1,
        limit: 1,
        pages: 0,

        itemsPerPage: () => {
            if (window.innerWidth >= 1600) {
                return 15
            } else if (window.innerWidth >= 991) {
                return 10
            } else if (window.innerWidth >= 768) {
                return 8
            } else {
                return 4
            }
        },

        clientAdminList: async () => {
            try {
                set({ clients: [], countClients: 0, limit: get().itemsPerPage(), loading: true })
                const currentPage = get().currentPage
                const limit = get().limit
                const data = await axiosAdminClientsList(currentPage, limit)
                set({ clients: data.clients, countClients: data.count, pages: data.pages, loading: false })
                console.log(data)
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        previousPage: () => {
            const { currentPage } = get()
            if (currentPage > 1) {
                set({ currentPage: currentPage - 1 })
                get().clientAdminList()
            }
        },

        nextPage: () => {
            const { currentPage, pages } = get()
            if (currentPage < pages) {
                set({ currentPage: currentPage + 1 })
                get().clientAdminList()
            }
        },

        searchAdminClients: async (term: string) => {
            const trimmed = term.toLowerCase().trim()

            if (!trimmed) {
                get().clientAdminList()
            }

            if (trimmed) set({ term: trimmed })
            try {
                set({ loading: true })
                const data = await axiosAdminClientsSearch(trimmed)
                set({ clients: data, loading: false })
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        clientAdminIsRead: async (id: number) => {
            try {
                await axiosAdminClientIsRead(id)
                get().clientAdminList()
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        clientIsVisible: async (id: number) => {
            try {
                await axiosAdminClientIsVisible(id)
                get().clientAdminList()
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        clientAdminDelete: async (id: number) => {
            try {
                await axiosAdminClientDelete(id)
                get().clientAdminList()
            } catch(err) {
                console.log(err)
                throw err
            }
        }

    }), {name: 'client-admin-state'})
)