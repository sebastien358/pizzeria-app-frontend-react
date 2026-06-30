import {create} from "zustand";
import {persist} from "zustand/middleware";
import {testimonialList, testimonialListHome} from "@/shared/services/testimonial";

export interface TestimonialState {
    testimonials: object,
    loadingTestimonial: boolean,
}

export const useTestimonialList = create<TestimonialState>()(
    persist((set) => ({
        testimonials: [],
        loadingTestimonial: false,

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
        }
    }), {
        name: 'testimonial-state'
    })
)