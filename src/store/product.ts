import {create} from "zustand";
import {persist} from "zustand/middleware";
import {productList} from "@/shared/services/product.service";

export const useProductStore = create()(
    persist((set, get) => ({
        products: [],

        productList: async () => {
            try {
                const data = await productList()
                set({ products: data })
            } catch(err) {
                console.error(err)
                throw err
            }
        }

    }), {name: 'product-storage'}
    )
)