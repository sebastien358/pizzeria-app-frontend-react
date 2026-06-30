import {create} from "zustand";
import {persist} from "zustand/middleware";
import {useProductStore} from "@/store/product";

export interface CartState {
    cart: object
}

export const useProductToCart = create()(
    persist((set, get) => ({
        cart: [],

        totalCartPrice: () => {
            const cart = get().cart
            const initialValue = 0;
            return cart.reduce((acc, product) => acc + product.productOption.price * product.quantity, initialValue)
        },

        productToCart: (id: number, option) => {

            const products = useProductStore.getState().products
            const productExist = products.find((p) => p.id === id)

            if (!productExist) {
                console.warn(`Product ${id} not found`)
                return
            }

            const cart = get().cart
            const productInCart = cart.find((p) => p.id === id && p.productOption.id === option.id)

            if (productInCart) {
                set({
                    cart: cart.map((p) => p.id === id && p.productOption.id === option.id ? { ...p, quantity: p.quantity + 1 } : p)
                })
            } else {
                set({
                    cart: [...cart, { ...productExist, productOption: option, quantity: 1 }]

                })
            }
        },

        deleteProductToCart: (id: number) => {
            const cart = get().cart
            const productInCart = cart.find((p) => p.id === id)

            if (!productInCart) return

            if (productInCart.quantity > 1) {
                set({
                    cart: cart.map((p) =>
                        p.id === id
                            ? { ...p, quantity: p.quantity - 1 }
                            : p
                    )
                })
            } else {
                set({
                    cart: cart.filter((p) => !(p.id === id))
                })
            }
        }
    }), {
        name: 'product-to-cart-state',
    })
)