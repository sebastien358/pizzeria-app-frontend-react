import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosCommandAdminList(currentPage: number, limit: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/command/list`, {
            params: {
                currentPage,
                limit
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des commandes : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosCommandAdminSearch(trimmed: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/command/search`, {
            params: {
                search: trimmed
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération search commandes : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosCommandAdminIsRead(id: string) {
    try {
        const response = await axios.patch(`${BASE_URL}/api/admin/command/is-read/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de changement de status de la commande : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosCommandAdminPreparationStatus(id: string, preparationStatus: string) {
    try {
        const response = await axios.patch(`${BASE_URL}/api/admin/command/${id}/preparation/${preparationStatus}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de changement de status de la commande : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosCommandAdminDelete(commandId: string) {
    try {
        const response = await axios.delete(`${BASE_URL}/api/admin/command/delete/${commandId}`)
        if (response.status === 200 || response.status === 204) {
            return response.data
        }
        throw new Error(`Erreur de la suppression de la commande : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}