import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosDeleteImage,
    axiosProductAdminEdit,
    axiosProductAdminNew,
    getProductAdminDetails,
    productAdminDelete,
    productAdminList,
    productAdminSearch, uploadImage
} from "@/shared/services/admin/productAdmin.service";

interface ProductOption {
    name: string
    price: number
}

interface ProductPicture {
    id: number
    filename: string
}

interface Product {
    id: number
    title: string
    description: string
    productOptions: ProductOption[]
    pictures: ProductPicture[]
    [key: string]: any // temporaire, à affiner selon ta vraie entité Symfony
}

interface ProductFormValues {
    title: string
    description: string
    image: File
    productOption: ProductOption[]
}

interface ProductAdminState {
    products: Product[]
    loading: boolean
    term: string
    currentPage: number
    pages: number
    limit: number
    offset: number
    totalProducts: number
    errorMessage: string | null
    currentProduct: Product | null

    getItemsPerPage: () => number
    productAdminList: () => Promise<void>
    previousPage: () => void
    nextPage: () => void
    productAdminDetails: (id: string | number) => Promise<void>
    productAdminNew: (formValues: ProductFormValues) => Promise<void>
    productAdminEdit: (productId: number | string, formValues: ProductFormValues) => Promise<void>
    deleteImage: (productId: number, imageId: number) => Promise<void>
    uploadImage: (productId: number, file: File) => Promise<void>
    deleteProduct: (id: number) => Promise<any>
    searchAdminProduct: (term: string) => Promise<void>
    clearMessage: () => void
}

export const useProductAdmin = create<ProductAdminState>()(
    persist((set, get) => ({
        products: [],
        loading: false,
        term: "",
        currentPage: 1,
        pages: 0,
        limit: 2,
        offset: 0,
        totalProducts: 0,
        errorMessage: "",
        currentProduct: null,

        getItemsPerPage() {
            if (window.innerWidth >= 1600) {
                return 12
            } else if (window.innerWidth >= 1024) {
                return 8
            } else if (window.innerWidth >= 767) {
                return 6
            } else {
                return 4
            }
        },

        productAdminList: async () => {
            try {
                const { getItemsPerPage, currentPage, limit } = get()

                set({ products: [], loading: true, limit: getItemsPerPage() })
                const data = await productAdminList(currentPage, limit)

                set({ products: data.products, pages: data.pages, totalProducts: data.totalProducts, loading: false })
            } catch(err) {
                set({ products: [], loading: false })
                console.error(err)
                throw err
            }
        },

        previousPage: () => {
            const { currentPage, productAdminList } = get()
            if (currentPage > 1) {
                set({ currentPage: currentPage - 1 })
                productAdminList()
            }
        },

        nextPage: () => {
            const { currentPage, pages, productAdminList } = get()
            if (currentPage < pages) {
                set({ currentPage: currentPage + 1 })
                productAdminList()
            }
        },

        productAdminDetails: async (id: string | number) => {
            try {
                set({ loading: true })
                const data = await getProductAdminDetails(Number(id))
                set({ currentProduct: data, loading: false })
            } catch(err) {
                set({ loading: false })
                console.error(err)
                throw err
            }
        },

        productAdminNew: async (formValues) => {
            try {
                const formData = new FormData()

                formData.append('title', formValues.title)
                formData.append('description', formValues.description)
                formData.append('image', formValues.image)

               formValues.productOption.forEach((po, index) => {
                   formData.append(`productOption[${index}][name]`, po.name)
                   formData.append(`productOption[${index}][price]`, po.price.toString())
               })

                const data = await axiosProductAdminNew(formData)
                set({ products: data })
            } catch(err) {
                set({ errorMessage: 'Le produit n\'a pas été ajouté' })
                throw err
            }
        },

        productAdminEdit: async (productId: string | number, formValues: ProductFormValues) => {
            try {
                const formData = new FormData()

                formData.append('title', formValues.title)
                formData.append('description', formValues.description)
                formData.append('image', formValues.image)

                formValues.productOption.forEach((po, index) => {
                    formData.append(`productOption[${index}][name]`, po.name)
                    formData.append(`productOption[${index}][price]`, po.price.toString())
                })

                const data = await axiosProductAdminEdit(Number(productId), formData)
                set({ products: data })

                await get().productAdminDetails(productId)
            } catch(err) {
                console.error(err)
                throw err
            }
        },

            deleteImage: async (productId: number, imageId: number) => {
                try {
                    await axiosDeleteImage(productId, imageId)  // vérifie le nom de la fonction importée
                    set((state) => ({
                        currentProduct: state.currentProduct ? {
                            ...state.currentProduct,
                            pictures: state.currentProduct.pictures.filter((pic) => pic.id !== imageId)
                        } : null
                    }))
                } catch(err) {
                    console.error(err)
                    throw err
                }
            },

        uploadImage: async (productId: number, file) => {
            try {
                const formData = new FormData()
                formData.append('image', file)
                await uploadImage(productId, formData)
                await get().productAdminDetails(productId)  // Tu penses quoi ce ca pour relancer l'image directement ?
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        deleteProduct: async (id: number) => {
            try {
                return await productAdminDelete(id)
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        searchAdminProduct: async (term: string) => {
            const trimmed = term.toLowerCase().trim()
            try {
                if (!trimmed) {
                    set({ term: "", offset: 0 })
                    await get().productAdminList()
                    return
                }

                if (trimmed) {
                    set({ term: trimmed})
                }

                set({ loading: true })
                const data = await productAdminSearch(trimmed)
                set({ products: data, loading: false })
            } catch(err) {
                console.error(err)
                throw err
            }
        },

        clearMessage: () => set({ errorMessage: null })
    }),
        {name: 'product-admin-state'}
    )
)