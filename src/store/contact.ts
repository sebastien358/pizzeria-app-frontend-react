import {create} from "zustand";
import {persist} from "zustand/middleware";

export const useContactStore = create()(
    persist((set) => ({
        error: null,

        addContact: async (data) => {
            try {
                console.log(data)
            } catch (err) {
                throw err
            }
        }
    }),
        {name: 'contact-storage'}
    )
)