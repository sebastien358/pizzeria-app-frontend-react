import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosContactAdminList(currentPage: number, limit: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/contact/list`, {
            params: {
                currentPage,
                limit
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des messages : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosContactAdminSearch(trimmed: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/contact/search`, {
            params: {
                search: trimmed
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la recherche d'un produit (search) : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosContactAdminDetails(id: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/contact/current/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération d'un produit : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosContactAdminIsRead(id: string) {
    try {
        const response = await axios.patch(`${BASE_URL}/api/admin/contact/is-read/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la suppression d'un produit : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosContactAdminDelete(id: string) {
    try {
        const response = await axios.delete(`${BASE_URL}/api/admin/contact/remove/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la suppression d'un produit : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}