import {create} from "zustand";
import {persist} from "zustand/middleware";
import {productList} from "@/shared/services/product.service";

export const useProductStore = create()(
    persist((set, get) => ({
            products: [],
            loading: false,
            offset: 0,
            limit: 3,

            productList: async () => {
                try {
                    const { offset, limit } = get()
                    set({ loading: true, products: [] })
                    const data = await productList(offset, limit)
                    set({ products: data, loading: false })
                } catch(err) {
                    set({ loading: false, products: [] })
                    console.error(err)
                    throw err
                }
            }

        }), {name: 'product-storage'}
    )
)