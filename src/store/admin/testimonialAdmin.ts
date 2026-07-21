import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosTestimonialAdminDelete,
    axiosTestimonialAdminList,
    axiosTestimonialAdminPublished,
    axiosTestimonialAdminSearch,
    axiosTestimonialDetails
} from "@/shared/services/admin/testimonialAdmin.service";

interface Testimonial {
    id: number
    name: string
    message: string
    rating: number
    isPublished: boolean
    createdAt: string
    [key: string]: any // temporaire, à affiner selon ta vraie entité Symfony
}

interface TestimonialAdminState {
    testimonials: Testimonial[]
    currentTestimonial: Testimonial | null
    loading: boolean
    countTestimonials: number
    currentPage: number
    limit: number
    pages: number
    term: string

    getItemsPerPage: () => number
    testimonialAdminList: () => Promise<void>
    previousPage: () => void
    nextPage: () => void
    testimonialAdminSearch: (term: string) => Promise<void>
    testimonialDetails: (id: number | string) => Promise<void>
    testimonialDelete: (id: number) => Promise<void>
    publishedTestimonial: (id: string) => Promise<void>
}

export const useTestimonialAdmin = create<TestimonialAdminState>()(
    persist((set, get) => ({
        testimonials: [],
        currentTestimonial: null,
        loading: false,
        countTestimonials: 0,
        currentPage: 1,
        limit: 2,
        pages: 0,
        term: "",

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

        testimonialAdminList: async () => {
            try {
                set({ testimonials: [], limit: get().getItemsPerPage(), loading: true })
                const currentPage = get().currentPage
                const limit = get().limit
                const data = await axiosTestimonialAdminList(currentPage, limit)
                set({ testimonials: data.testimonials, pages: data.pages, countTestimonials: data.totalTestimonials, loading: false })
            } catch(err) {
                set({ testimonials: [], loading: false })
                console.error(err)
                throw err
            }
        },

        previousPage: () => {
            const { currentPage } = get()
            if (currentPage > 1) {
                set({ currentPage: currentPage - 1 })
                get().testimonialAdminList()
            }
        },

        nextPage: () => {
            const { currentPage, pages } = get()
            if (pages !== null && currentPage < pages) {
                set({ currentPage: currentPage + 1 })
                get().testimonialAdminList()
            }
        },

        testimonialAdminSearch: async (term: string) => {
            const trimmed = term.toLowerCase().trim()
            try {
                if (!trimmed) {
                    set({ term: "", loading: false })
                    await get().testimonialAdminList()
                    return
                }

                if (trimmed) {
                    set({ term: trimmed })
                }

                set({ loading: true })
                const data = await axiosTestimonialAdminSearch(trimmed)
                set({ testimonials: data, loading: false })
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        testimonialDetails: async (id: string | number) => {
            try {
                set({ loading: true })
                const data = await axiosTestimonialDetails(Number(id))
                set({ currentTestimonial: data, loading: false })
            } catch(err) {
                set({ loading: false })
                console.error(err)
                throw err
            }
        },

        testimonialDelete: async (id: number) => {
            try {
                await axiosTestimonialAdminDelete(id)
                const { testimonials, currentPage } = get()

                if (testimonials.length === 1 && currentPage > 1) {
                    set({ currentPage: currentPage - 1 })
                }

                await get().testimonialAdminList()
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        publishedTestimonial: async (id: string) => {
            try {
                await axiosTestimonialAdminPublished(id)
                await get().testimonialDetails(id)
            } catch(err) {
                console.error(err)
                throw err
            }
        }

    }), {name: 'testimonial-admin-state'})
)