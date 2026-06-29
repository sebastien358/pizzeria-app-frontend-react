import {create} from "zustand";
import {persist} from "zustand/middleware";
import {productList, productSearch} from "@/shared/services/product.service";

export interface ProductState {
    products: object,
    loading: boolean,
    offset: number,
    limit: number,
    term: string,
    hasMore: boolean
}

export const useProductStore = create<ProductState>()(
    persist((set, get) => ({
            products: [],
            loading: false,
            offset: 0,
            limit: 4,
            term: "",
            hasMore: true,

            productList: async () => {
                try {
                    set({ products: [], loading: true, offset: 0 })
                    const { limit } = get()
                    const data = await productList(0, limit)
                    set({ products: data, loading: false })

                    if (data.length <= limit -1) {
                        set({ hasMore: false })
                    } else {
                        set({ hasMore: true })
                    }
                } catch(err) {
                    set({ products: [], loading: false})
                    console.error(err)
                    throw err
                }
            },

            lazyLoad: async () => {
                try {
                    const { offset, limit } = get()
                    set({ offset: offset + limit })
                    const data = await productList(get().offset, limit)
                    set({ products: [...get().products, ...data] })
                } catch(err) {
                    console.error(err)
                    throw err
                }
            },

            searchProduct: async (term: string) => {
                const trimmed = term.toLowerCase().trim()

                if (!trimmed) {
                    set({ term: "", offset: 0 })
                    get().productList()
                    return
                }

                if (trimmed) {
                    set({ term: trimmed.trim() })
                }

                try {
                    set({ loading: true })
                    const { term } = get()
                    const data = await productSearch(term)
                    set({ products: data, loading: false })
                } catch(err) {
                    console.error(err)
                    throw err
                }
            }

        }),
        {
            name: 'product-storage',
            partialize: (state) => ({ offset: state.offset, limit: state.limit })
        }
    )
)