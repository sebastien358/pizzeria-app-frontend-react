import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosCommandUserList(currentPage: number, limit: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/command/user/list`, {
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

export async function axiosCommandUserDetails(id: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/command/user/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des commandes : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosCommandUserDelete(id: number) {
    try {
        const response = await axios.delete(`${BASE_URL}/api/command/user/delete/${id}`)
        if (response.status === 200 || response.status === 204) {
            return response.data
        }
        throw new Error(`Erreur de la suppression de la commande : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function axiosAddCommand(data: any, cart: any []) {
    try {
        const response = await axios.post(`${BASE_URL}/api/command/user/add`, {
            dataClient: data,
            cartItems: cart
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de l'ajout d'une commande : ${response.status}`)
    } catch(err) {
        console.error(err)
        throw err
    }
}