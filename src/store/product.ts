import {create} from "zustand";
import {persist} from "zustand/middleware";
import {productList, productSearch} from "@/shared/services/product.service";

export interface ProductState {
    products: object,
    productsHome: object,
    loading: boolean,
    offset: number,
    limit: number,
    term: string,
    hasMore: boolean
    countProduct: number
}

export const useProductStore = create<ProductState>()(
    persist((set, get) => ({
            products: [],
            productsHome: [],
            loading: false,
            offset: 0,
            limit: 4,
            term: "",
            hasMore: true,
            countProduct: 0,

            itemsPerPagePizzas: () => {
                if (window.innerWidth >= 1400) {
                    return 12
                } else if (window.innerWidth >= 1024) {
                    return 9
                } else if (window.innerWidth >= 767) {
                    return 6
                } else {
                    return 4
                }
            },

            itemsPerPageHome: () => {
                if (window.innerWidth >= 1600) {
                    return 4
                } else if (window.innerWidth >= 1024) {
                    return 3
                } else {
                    return 2
                }
            },

            productListHome: async () => {
                try {
                    const { itemsPerPageHome, limit } = get()
                    set({ limit: itemsPerPageHome() })

                    set({ productsHome: [], loading: true, offset: 0 })
                    const data = await productList(0, limit)

                    set({ productsHome: data.products, loading: false })
                } catch (err) {
                    set({ productsHome: [], loading: true, offset: 0 })
                    console.error(err)
                    throw err
                }
            },

            productList: async () => {
                try {
                    const { itemsPerPagePizzas, limit } = get()

                    set({ limit: itemsPerPagePizzas() })
                    set({ products: [], loading: true, offset: 0 })

                    const data = await productList(0, limit)
                    set({ products: data.products, countProduct: data.countProduct, loading: false })

                    if (data.countProduct < get().limit) {
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
                    const { products, offset, limit } = get()
                    set({ offset: offset + limit })
                    const data = await productList(get().offset, limit)
                    set({ products: [...products, ...data.products] })
                } catch(err) {
                    console.error(err)
                    throw err
                }
            },

            searchProduct: async (term: string) => {
                const trimmed = term.toLowerCase().trim()

                if (!trimmed) {
                    set({ term: "", offset: 0, hasMore: false })
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