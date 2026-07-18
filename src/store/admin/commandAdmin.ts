import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosCommandAdminDelete,
    axiosCommandAdminIsRead,
    axiosCommandAdminList,
    axiosCommandAdminPreparationStatus, axiosCommandAdminSearch
} from "@/shared/services/admin/commandAdmin.service";

interface Command {
    id: string
    [key: string]: any // temporaire, à affiner avec les vrais champs de commande
}

interface CommandAdminState {
    commands: Command[]
    loading: boolean
    term: string
    currentPage: number
    limit: number
    pages: number
    countCommandsUnread: number

    commandAdminList: () => Promise<void>
    previousPage: () => Promise<void>
    nextPage: () => Promise<void>
    commandAdminSearch: (term: string) => Promise<void>
    commandAdminIsRead: (id: string) => Promise<void>
    commandAdminPreparationStatus: (id: string, preparationStatus: string) => Promise<void>
    commandAdminDelete: (commandId: string) => Promise<void>
}

export const useCommandAdminStore = create<CommandAdminState>()(
    persist((set, get) => ({
        commands: [],
        loading: false,
        term: "",
        currentPage: 1,
        limit: 2,
        pages: 0,
        countCommandsUnread: 0,

        commandAdminList: async () => {
            try {
                set({ commands: [], loading: true })
                const currentPage = get().currentPage
                const limit = get().limit
                const data = await axiosCommandAdminList(currentPage, limit)

                console.log(data)
                set({ commands: data.commands, countCommandsUnread: data.countCommandsUnread, pages: data.pages, loading: false })

                console.log(get().countCommandsUnread)

            } catch (err) {
                set({ commands: [], loading: false })
                console.error(err)
                throw err
            }
        },

        previousPage: async () => {
            try {
                const { currentPage, pages } = get()
                if (currentPage > 1) {
                    set({ currentPage: currentPage - 1 })
                }
                await get().commandAdminList()
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
                }
                await get().commandAdminList()
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        commandAdminSearch: async (term: string) => {
            const trimmed = term.toLowerCase().trim()
            try {
                if (!trimmed) {
                    set({ term: "" })
                    await get().commandAdminList()
                    return
                }

                if (trimmed) {
                    set({ term: trimmed })
                }

                set({ loading: true })
                const data = await axiosCommandAdminSearch(trimmed)
                set({ commands: data, loading: false })
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        commandAdminIsRead: async (id: string) => {
            try {
                await axiosCommandAdminIsRead(id)
                await get().commandAdminList()
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        commandAdminPreparationStatus: async (id: string, preparationStatus: string) => {
            try {
                await axiosCommandAdminPreparationStatus(id, preparationStatus)
                await get().commandAdminList()
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        commandAdminDelete: async (commandId: string) => {
            try {
                await axiosCommandAdminDelete(commandId)
                await get().commandAdminList()
            } catch(err) {
                console.error(err)
                throw err
            }
        }
    }),
        { name: 'command-admin-state' }
    )
)