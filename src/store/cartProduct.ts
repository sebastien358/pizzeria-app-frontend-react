import {create} from "zustand";
import {persist} from "zustand/middleware";
import {useProductStore} from "@/store/product";

export interface CartState {
    cart: object
}

export const useProductToCart = create()(
    persist((set, get) => ({
        cart: [],

        productToCart: (id: number) => {
            const products = useProductStore.getState().products
            const productExist = products.find((p) => p.id === id)

            if (!productExist) {
                console.warn(`Product ${id} not found`)
                return
            }

            const cart = get().cart
            const productInCart = cart.find((p) => p.id === id)

            if (productInCart) {
                set({
                    cart: cart.map((p) => p.id === id ? { ...p, quantity: p.quantity + 1 } : p)
                })
            } else {
                set({
                    cart: [...cart, { ...productExist, quantity: 1 }]
                })
            }

            //console.log(productOption)
        },

        deleteProductToCart: (id: number) => {
            const cart = get().cart
            const productInCart = cart.find((p) => p.id === id)

            if (!productInCart) return

            if (productInCart.quantity > 1) {
                set({
                    cart: cart.map((p) =>
                        p.id === id ? { ...p, quantity: p.quantity - 1 } : p
                    )
                })
            } else {
                set({ cart: cart.filter((p) => p.id !== id) })
            }
        }
    }), {
        name: 'product-to-cart-state',
    })
)