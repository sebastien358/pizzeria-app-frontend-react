import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosAddCommand, axiosCommandUserDelete,
    axiosCommandUserDetails,
    axiosCommandUserList
} from "@/shared/services/user/commandUser.service";
import {useProductToCart} from "@/store/cartProduct";

interface Command {
    id: number
    [key: string]: any // temporaire, à affiner avec les vrais champs de commande
}

interface CommandUserState {
    commands: Command[]
    pendingCommand: Command | null
    profileCommand: Command | null
    currentPage: number
    countCommands: number
    pages: number
    loading: boolean
    errorMessage: string | null
    limit: number

    commandUserList: () => Promise<void>
    previousPage: () => void
    nextPage: () => void
    commandUserDetails: (id: string | number) => Promise<void>
    addCommand: (data: any) => Promise<void>
    deleteCommand: (id: number) => Promise<void>
    resetCommandPending: () => void
    resetCommandProfile: () => void
    clearErrorMessage: () => void
}


export  const useCommandUser = create<CommandUserState>()(
    persist((set, get) => ({
        commands: [],
        pendingCommand: null,
        profileCommand: null,
        currentPage: 1,
        countCommands: 0,
        pages: 0,
        loading: false,
        errorMessage: null,
        limit: 2,

        commandUserList: async () => {
            try {
                set({ commands: [], loading: true })
                const currentPage = get().currentPage
                const limit = get().limit
                const data = await axiosCommandUserList(currentPage, limit)
                set({ commands: data.commands, countCommands: data.countCommands, pages: data.pages, loading: false })
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        previousPage: () => {
            const { currentPage, pages} = get()
            if (currentPage > 1) {
                set({ currentPage: currentPage - 1 })
                get().commandUserList()
            }
        },

        nextPage: () => {
            const { currentPage, pages } = get()
            if (currentPage < pages) {
                set({ currentPage: currentPage + 1 })
                get().commandUserList()
            }
        },

        commandUserDetails: async (id: string | number) => {
            try {
                set({ loading: true })
                const data = await axiosCommandUserDetails(Number(id))
                set({ profileCommand: data, loading: false })
            } catch(err) {
                set({ profileCommand: null, loading: false })
                console.error(err)
                throw err
            }
        },

        addCommand: async (data) => {
            try {
                const { cart } = useProductToCart.getState()
                const command = await axiosAddCommand(data, cart)
                set({ commands: command, pendingCommand: command.pendingCommand })
            } catch(err) {
                set({ errorMessage: 'La commande a échouée' })
                throw err
            }
        },

        deleteCommand: async (id: number) => {
            try {
                await axiosCommandUserDelete(id)
                await get().commandUserList()
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        resetCommandPending: () => set({ pendingCommand: null }),

        resetCommandProfile: () => set({ profileCommand: null }),

        clearErrorMessage: () => set({ errorMessage: null })
    }),
        {name: 'command-user-state'}
    )
)