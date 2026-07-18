import {create} from "zustand";
import {persist} from "zustand/middleware";
import {addContact} from "@/shared/services/contact.service";

export type ContactFormData = {
    firstname: string
    lastname: string
    email: string
    message: string
}

export type ContactState = {
    error: string | null
    addContact: (data: ContactFormData) => Promise<any>
    clearError: () => void
}

export const useContactStore = create<ContactState>()(
    persist((set, get) => ({
        error: null,

        addContact: async (data: ContactFormData) => {
            try {
                set({ error: null })
                return await addContact(data)
            } catch (err) {
                set({ error: "Une erreur est survenue, veuillez réessayer plus tard." })
                throw err
            }
        },

        clearError: () => set({ error: null })
    }),
        {name: 'contact-storage'}
    )
)