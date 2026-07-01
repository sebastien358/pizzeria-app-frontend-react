import {create} from "zustand";
import {persist} from "zustand/middleware";
import {newTestimonial, testimonialList, testimonialListHome} from "@/shared/services/testimonial";

export interface TestimonialState {
    testimonials: object,
    loadingTestimonial: boolean,
    error: string | null,
}

export const useTestimonial = create<TestimonialState>()(
    persist((set, get) => ({
        testimonials: [],
        loadingTestimonial: false,
        error: null,

        testimonialListHome: async () => {
            try {
                set({ testimonials: [], loadingTestimonial: true })
                const data = await testimonialListHome()
                set({ testimonials: data, loadingTestimonial: false })
            } catch(err) {
                set({ testimonials: [], loadingTestimonial: false })
                console.error(err)
                throw err
            }
        },

        testimonialList: async () => {
            try {
                set({ testimonials: [], loadingTestimonial: true })
                const data = await testimonialList()
                set({ testimonials: data, loadingTestimonial: false })
            } catch(err) {
                set({ testimonials: [], loadingTestimonial: false })
                console.error(err)
                throw err
            }
        },

        addTestimonial: async (data) => {
            try {
                const formData = new FormData()

                formData.append('firstname', data.firstname)
                formData.append('lastname', data.lastname)
                formData.append('rating', data.rating)
                formData.append('message', data.message)
                formData.append('image', data?.image)

                const response = await newTestimonial(formData)
                set({ testimonials: response })
            } catch(err) {
                set({ error: "Le témoignage n'a pas pu être envoyé" })
                throw err
            }
        },

        clearError: () => set({ error: null }),

    }), {
        name: 'testimonial-state'
    })
)