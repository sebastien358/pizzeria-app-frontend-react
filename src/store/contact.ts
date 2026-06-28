import {create} from "zustand";
import {persist} from "zustand/middleware";
import {addContact} from "@/shared/services/contact.service";

export type ContactState = {
    error: string | null
}

export const useContactStore = create<ContactState>()(
    persist((set) => ({
        error: null,

        addContact: async (data) => {
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