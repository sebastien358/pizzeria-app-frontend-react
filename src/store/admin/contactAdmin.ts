import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosContactAdminDelete,
    axiosContactAdminDetails, axiosContactAdminIsRead,
    axiosContactAdminList,
    axiosContactAdminSearch
} from "@/shared/services/admin/contactAdmin.service";

interface Contact {
    id: string
    firstName: string
    lastName: string
    email: string
    message: string
    isRead: boolean
    createdAt: string
}

interface ContactAdminState {
    contacts: Contact[]
    currentContact: Contact | null
    loading: boolean
    term: string
    currentPage: number
    limit: number
    pages: number
    totalContacts: number

    getItemsPerPage: () => number
    contactAdminList: () => Promise<void>
    previousPage: () => Promise<void>
    nextPage: () => Promise<void>
    searchAdminContact: (term: string) => Promise<void>
    contactAdminDetails: (id: string) => Promise<void>
    contactAdminIsPublished: (id: string) => Promise<void>
    contactAdminDelete: (id: string) => Promise<void>
}

export const useContactAdminStore = create<ContactAdminState>()(
    persist((set, get) => ({
        contacts: [],
        currentContact: null,
        loading: false,
        term: "",
        currentPage: 1,
        limit: 2,
        pages: 0,
        totalContacts: 0,

        getItemsPerPage() {
            if (window.innerWidth > 1600) {
                return 12
            } else if (window.innerWidth >= 1024) {
                return 6
            } else if (window.innerWidth >= 768) {
                return 5
            } else {
                return 3
            }
        },

        contactAdminList: async () => {
            try {
                set({ contacts: [], limit: get().getItemsPerPage(), loading: true })
                const currentPage = get().currentPage
                const limit = get().limit
                const data = await axiosContactAdminList(currentPage, limit)
                set({ contacts: data.contacts, totalContacts: data.totalContacts, pages: data.pages, loading: false })
            } catch(err) {
                set({ contacts: [], loading: false })
                console.error(err)
                throw err
            }
        },

        previousPage: async () => {
            try {
                const { currentPage } = get()
                if (currentPage > 1)  {
                    set({ currentPage: currentPage - 1 })
                    await get().contactAdminList()
                }
            } catch(err) {
                console.error(err)
                throw err
            }

        },

        nextPage: async () => {
            try {
                const { currentPage, pages } = get()
                if (currentPage < pages) {
                    set({ currentPage: currentPage + 1 })
                    await get().contactAdminList()
                }
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        searchAdminContact: async (term: string) => {
            const trimmed = term.trim()
            try {
                if (!trimmed) {
                    set({ term: "" })
                    await get().contactAdminList()
                }

                if (trimmed) {
                    set({ term: trimmed })
                }

                set({loading: true})
                const data = await axiosContactAdminSearch(trimmed)
                set({ contacts: data, loading: false })
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        contactAdminDetails: async (id: string) => {
            try {
                set({ loading: true })
                const data = await axiosContactAdminDetails(id)
                set({ currentContact: data, loading: false })
            } catch(err) {
                set({ currentContact: null, loading: false })
                console.error(err)
                throw err
            }
        },
        contactAdminIsPublished: async (id: string) => {
            try {
                await axiosContactAdminIsRead(id)
                await get().contactAdminDetails(id)
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        contactAdminDelete: async (id: string) => {
            try {
                await axiosContactAdminDelete(id)

                const { contacts, currentPage } = get()
                if (contacts.length === 0 && currentPage > 1) {
                    set({ currentPage: currentPage - 1 })
                }

                await get().contactAdminList()
            } catch(err) {
                console.error(err)
                throw err
            }
        }

    }),
        {name: 'contact-admin-state'}
    )
)