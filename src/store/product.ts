import {create} from "zustand";
import {persist} from "zustand/middleware";
import {productList} from "@/shared/services/product.service";

export interface ProductState {
    products: object,
    loading: boolean,
    offset: number,
    limit: number,
}

export const useProductStore = create<ProductState>()(
    persist((set, get) => ({
            products: [],
            loading: false,
            offset: 0,
            limit: 4,

            productList: async () => {
                try {
                    const { offset, limit } = get()
                    set({ products: [], loading: true })
                    const data = await productList(offset, limit)
                    set({ products: data, loading: false })
                } catch(err) {
                    set({ products: [], loading: false})
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