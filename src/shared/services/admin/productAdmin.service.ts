import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function productAdminList(currentPage: number, limit: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/product/list`, {
            params: {
                currentPage,
                limit
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des produits : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function productAdminSearch(term: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/product/search`, {
            params: {
                search: term
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des produits (search) : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosProductAdminNew(formData: FormData) {
    try {
        const response = await axios.post(`${BASE_URL}/api/admin/product/new`, formData)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de l'ajout d'un produit : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function getProductAdminDetails(id: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/product/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération d'un produit : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosProductAdminEdit(productId: number, formData: FormData) {
    try {
        const response = await axios.post(`${BASE_URL}/api/admin/product/${productId}/edit`, formData)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de l'édition d'un produit : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosDeleteImage(productId: number, imageId: number) {
    try {
        const response = await axios.delete(`${BASE_URL}/api/admin/product/delete/${productId}/image/${imageId}`)
        if (response.status === 200 || response.status === 204) {
            return response.data
        }
        throw new Error(`Erreur de la suppression d'une image : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function uploadImage(productId: number, formData: FormData) {
    try {
        const response = await axios.post(`${BASE_URL}/api/admin/product/${productId}/upload-image`, formData)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la suppression d'une image : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function productAdminDelete(id: number) {
    try {
        const response = await axios.delete(`${BASE_URL}/api/admin/product/delete/${id}`)
        if (response.status === 200 || response.status === 304) {
            return response.data
        }
        throw new Error(`Erreur de la supression d'un produit : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}
