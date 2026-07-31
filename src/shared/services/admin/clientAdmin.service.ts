import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosAdminClientsList(currentPage: number, limit: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/client/list`, {
            params: {
                currentPage,
                limit
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération de la liste des clients : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminClientsSearch(trimmed: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/client/search`, {
            params: {
                search: trimmed
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la recherche d'un client : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminClientIsRead(id: number) {
    try {
        const response = await axios.patch(`${BASE_URL}/api/admin/client/is-read/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur utlisateur (vu) : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminClientIsVisible(id: number) {
    try {
        const response = await axios.patch(`${BASE_URL}/api/admin/client/is-visible/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la suppression d'un utilisateur : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminClientDelete(id: number) {
    try {
        const response = await axios.delete(`${BASE_URL}/api/admin/client/remove/${id}`)
        if (response.status === 200 || response.status === 204) {
            return response.data
        }
        throw new Error(`Erreur de la suppression d'un utilisateur : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}