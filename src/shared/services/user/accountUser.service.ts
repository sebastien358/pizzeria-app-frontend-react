import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosAccountUserDetails() {
    try {
        const response = await axios.get(`${BASE_URL}/api/user/account/me`)
        if (response.status <= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération d'un utilisateur : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAccountUserEdit(id: number, data) {
    try {
        const response = await axios.patch(`${BASE_URL}/api/user/account/edi/${id}`, data)
        if (response.status <= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la modification des données d'un utilisateur : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}