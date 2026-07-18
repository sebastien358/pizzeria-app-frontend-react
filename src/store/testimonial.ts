import {create} from "zustand";
import {persist} from "zustand/middleware";
import {newTestimonial, testimonialList, testimonialListHome} from "@/shared/services/testimonial";

interface TestimonialFormData {
    firstname: string
    lastname: string
    rating: number
    message: string
    image?: File
}

export interface TestimonialState {
    testimonialsHome: any[]
    testimonials: any[]
    loadingTestimonial: boolean
    error: string | null
    countTestimonials: number | null
    averageRating: number | null
    currentPage: number
    limit: number
    pages: number | null

    testimonialListHome: () => Promise<void>
    testimonialList: () => Promise<void>
    previousPage: () => void
    nextPage: () => void
    addTestimonial: (data: TestimonialFormData) => Promise<void>
    clearError: () => void
}

export const useTestimonial = create<TestimonialState>()(
    persist((set, get) => ({
        testimonialsHome: [],
        testimonials: [],
        loadingTestimonial: false,
        error: null,
        countTestimonials: 0,
        averageRating: 0,
        currentPage: 1,
        limit: 3,
        pages: 0,

        testimonialListHome: async () => {
            try {
                set({ testimonialsHome: [], loadingTestimonial: true })
                const data = await testimonialListHome()
                set({ testimonialsHome: data, loadingTestimonial: false })
            } catch(err) {
                set({ testimonialsHome: [], loadingTestimonial: false })
                console.error(err)
                throw err
            }
        },

        testimonialList: async () => {
            try {
                set({ testimonials: [], loadingTestimonial: true })
                const currentPage = get().currentPage
                const limit = get().limit
                const data = await testimonialList(currentPage, limit)
                set({ testimonials: data.testimonials, loadingTestimonial: false, countTestimonials: data.countTestimonials, pages: data.pages, averageRating: data.averageRating })
            } catch(err) {
                set({ testimonials: [], loadingTestimonial: false })
                console.error(err)
                throw err
            }
        },

        previousPage: () => {
            const { currentPage } = get()
            if (currentPage > 1) {
                set({ currentPage: currentPage - 1 })
                get().testimonialList()
            }
        },

        nextPage: () => {
            const { currentPage, pages } = get()
            if (pages !== null && currentPage < pages) {
                set({ currentPage: currentPage + 1 })
                get().testimonialList()
            }
        },

        addTestimonial: async (data) => {
            try {
                const formData = new FormData()

                formData.append('firstname', data.firstname)
                formData.append('lastname', data.lastname)
                formData.append('rating', data.rating.toString())
                formData.append('message', data.message)

                if (data?.image) {
                    formData.append('image', data.image)
                }

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